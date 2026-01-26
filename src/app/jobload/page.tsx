'use client';

/**
 * Job Load Progress Page
 * Real-time monitoring of Apify actor job loading
 */

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Clock, Zap, Settings, AlertTriangle, ChevronRight, Eye, Download, Search, X } from 'lucide-react';

interface LoadStatus {
  runId: string;
  actorName: string;
  status: 'queued' | 'running' | 'processing' | 'completed' | 'failed';
  progress: number;
  jobsFetched: number;
  jobsSynced: number;
  errors: string[];
  startedAt: string;
  completedAt?: string;
  estimatedCost: number;
  duration: number;
}

interface OverallStatus {
  totalLoads: number;
  completedLoads: number;
  failedLoads: number;
  runningLoads: number;
  overallProgress: number;
  totalJobsFetched: number;
  totalJobsSynced: number;
  totalCost: number;
}

interface UsageStats {
  creditsUsed: number;
  creditsRemaining: number;
  computeUnits: number;
}

interface StatusResponse {
  overall: OverallStatus;
  usage: UsageStats;
  loads: LoadStatus[];
}

interface ActorInfo {
  id: string;
  name: string;
  maxResults: number;
  estimatedCost: number;
}

interface ActorConfig extends ActorInfo {
  enabled: boolean;
  customMaxResults: number;
}

interface AvailableActorsResponse {
  actors: ActorInfo[];
  totalEstimatedCost: number;
}

export default function JobLoadPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'api-key' | 'actors'>('api-key');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [actorConfigs, setActorConfigs] = useState<ActorConfig[]>([]);
  const [availableActors, setAvailableActors] = useState<ActorInfo[]>([]);
  const [loadingActors, setLoadingActors] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedRun, setSelectedRun] = useState<string | null>(null);
  const [runDetails, setRunDetails] = useState<any>(null);
  const [loadingRunDetails, setLoadingRunDetails] = useState(false);
  const [importing, setImporting] = useState<Record<string, boolean>>({});
  const [importProgress, setImportProgress] = useState<Record<string, { status: string; progress: number }>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [historicalRuns, setHistoricalRuns] = useState<any[]>([]);
  const [loadingHistoricalRuns, setLoadingHistoricalRuns] = useState(false);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto-dismiss after 5 seconds
  };

  // Load API key and actor configs from localStorage on mount
  useEffect(() => {
    const initializeData = async () => {
      setLoadingActors(true);

      // Load API key
      const savedKey = localStorage.getItem('apify_api_token');
      if (savedKey) {
        setApiKey(savedKey);
        setApiKeyInput(savedKey);
        setHasApiKey(true);
      }

      // Fetch available actors from API first
      try {
        const response = await fetch('/api/jobload/trigger');
        if (response.ok) {
          const data: AvailableActorsResponse = await response.json();
          setAvailableActors(data.actors);

          // Load actor configs from localStorage
          const savedConfigs = localStorage.getItem('apify_actor_configs');

          if (savedConfigs) {
            try {
              const parsedConfigs = JSON.parse(savedConfigs);
              if (parsedConfigs && parsedConfigs.length > 0) {
                // Merge saved configs with current actors to handle any changes
                const mergedConfigs = data.actors.map((actor) => {
                  const saved = parsedConfigs.find((c: ActorConfig) => c.id === actor.id);
                  return saved || {
                    ...actor,
                    enabled: true,
                    customMaxResults: actor.maxResults,
                  };
                });
                setActorConfigs(mergedConfigs);
              } else {
                // Initialize with default configs
                const initialConfigs: ActorConfig[] = data.actors.map((actor) => ({
                  ...actor,
                  enabled: true,
                  customMaxResults: actor.maxResults,
                }));
                setActorConfigs(initialConfigs);
              }
            } catch (error) {
              console.error('Failed to parse actor configs:', error);
              // Initialize with default configs on error
              const initialConfigs: ActorConfig[] = data.actors.map((actor) => ({
                ...actor,
                enabled: true,
                customMaxResults: actor.maxResults,
              }));
              setActorConfigs(initialConfigs);
            }
          } else {
            // Initialize with default configs if no saved configs
            const initialConfigs: ActorConfig[] = data.actors.map((actor) => ({
              ...actor,
              enabled: true,
              customMaxResults: actor.maxResults,
            }));
            setActorConfigs(initialConfigs);
          }
        } else {
          console.error('Failed to fetch actors:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch available actors:', error);
      } finally {
        setLoadingActors(false);
      }
    };

    initializeData();
  }, []);

  // Fetch status
  const fetchStatus = async () => {
    try {
      const headers: HeadersInit = {};
      if (apiKey) {
        headers['X-Apify-Token'] = apiKey;
      }

      const response = await fetch('/api/jobload/status', { headers });

      // Check if response is OK and is JSON
      if (!response.ok) {
        console.error('Status request failed:', response.status, response.statusText);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Expected JSON response but got:', contentType);
        return;
      }

      const data = await response.json();

      if (data.error) {
        console.error('Status error:', data.error);
        return;
      }

      setStatus(data);

      // Update logs
      if (data.loads) {
        const newLogs = data.loads.map((load: LoadStatus) => {
          if (load.status === 'completed') {
            return `✅ ${load.actorName}: Synced ${load.jobsSynced} jobs in ${load.duration}s`;
          } else if (load.status === 'failed') {
            return `❌ ${load.actorName}: Failed - ${load.errors[0] || 'Unknown error'}`;
          } else {
            return `⏳ ${load.actorName}: ${load.progress}% complete`;
          }
        });
        setLogs(newLogs);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  // Save API key
  const saveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('apify_api_token', apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setHasApiKey(true);
      setShowSettings(false);
      showToast('API key saved! You can now start job loading.', 'success');
      // Fetch status with new key
      fetchStatus();
    } else {
      showToast('Please enter a valid API key', 'error');
    }
  };

  // Clear API key
  const clearApiKey = () => {
    if (confirm('Are you sure you want to remove the API key?')) {
      localStorage.removeItem('apify_api_token');
      setApiKey('');
      setApiKeyInput('');
      setHasApiKey(false);
      setShowSettings(false);
    }
  };

  // Save actor configurations
  const saveActorConfigs = () => {
    localStorage.setItem('apify_actor_configs', JSON.stringify(actorConfigs));
    showToast('Actor configurations saved!', 'success');
    setShowSettings(false);
  };

  // Update actor config
  const updateActorConfig = (actorId: string, updates: Partial<ActorConfig>) => {
    setActorConfigs((prev) =>
      prev.map((config) =>
        config.id === actorId ? { ...config, ...updates } : config
      )
    );
  };

  // Fetch historical runs from Apify
  const fetchHistoricalRuns = async () => {
    setLoadingHistoricalRuns(true);
    try {
      const headers: HeadersInit = {};
      if (apiKey) {
        headers['X-Apify-Token'] = apiKey;
      }

      const response = await fetch('/api/jobload/runs', { headers });

      if (!response.ok) {
        console.error('Failed to fetch historical runs:', response.status);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setHistoricalRuns(data.runs);
      }
    } catch (error) {
      console.error('Error fetching historical runs:', error);
    } finally {
      setLoadingHistoricalRuns(false);
    }
  };

  // Fetch run details
  const fetchRunDetails = async (runId: string) => {
    setLoadingRunDetails(true);
    try {
      const headers: HeadersInit = {};
      if (apiKey) {
        headers['X-Apify-Token'] = apiKey;
      }

      const response = await fetch(`/api/jobload/runs/${runId}`, { headers });

      if (!response.ok) {
        showToast('Failed to fetch run details', 'error');
        return;
      }

      const data = await response.json();
      setRunDetails(data);
    } catch (error) {
      console.error('Error fetching run details:', error);
      showToast('Failed to fetch run details', 'error');
    } finally {
      setLoadingRunDetails(false);
    }
  };

  // Import jobs from run
  const importRun = async (runId: string, actorId: string) => {
    if (
      !confirm(
        'Import all jobs from this run to your database?\n\n' +
          'Jobs will be automatically normalized to your unified format and saved. ' +
          'Existing jobs will be updated, new jobs will be added. ' +
          'Duplicates will be automatically detected and removed.\n\n' +
          'Continue?'
      )
    ) {
      return;
    }

    setImporting((prev) => ({ ...prev, [runId]: true }));
    setImportProgress((prev) => ({ ...prev, [runId]: { status: 'Fetching run data...', progress: 10 } }));

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (apiKey) {
        headers['X-Apify-Token'] = apiKey;
      }

      setImportProgress((prev) => ({ ...prev, [runId]: { status: 'Normalizing jobs...', progress: 30 } }));

      const response = await fetch(`/api/jobload/runs/${runId}/import`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ actorId }),
      });

      if (!response.ok) {
        showToast('Failed to import jobs', 'error');
        setImportProgress((prev) => {
          const newState = { ...prev };
          delete newState[runId];
          return newState;
        });
        return;
      }

      setImportProgress((prev) => ({ ...prev, [runId]: { status: 'Saving to database...', progress: 70 } }));

      const data = await response.json();

      if (data.success) {
        setImportProgress((prev) => ({ ...prev, [runId]: { status: 'Removing duplicates...', progress: 90 } }));

        // Remove duplicates
        await removeDuplicates();

        setImportProgress((prev) => ({ ...prev, [runId]: { status: 'Complete!', progress: 100 } }));

        showToast(
          `✅ Successfully imported ${data.stats.created + data.stats.updated} jobs! (${data.stats.created} new, ${data.stats.updated} updated from ${data.stats.totalFetched} fetched)`,
          'success'
        );

        // Clear progress after 2 seconds
        setTimeout(() => {
          setImportProgress((prev) => {
            const newState = { ...prev };
            delete newState[runId];
            return newState;
          });
        }, 2000);
      } else {
        showToast(`Failed to import: ${data.error}`, 'error');
        setImportProgress((prev) => {
          const newState = { ...prev };
          delete newState[runId];
          return newState;
        });
      }
    } catch (error) {
      console.error('Error importing jobs:', error);
      showToast('Failed to import jobs', 'error');
      setImportProgress((prev) => {
        const newState = { ...prev };
        delete newState[runId];
        return newState;
      });
    } finally {
      setImporting((prev) => {
        const newState = { ...prev };
        delete newState[runId];
        return newState;
      });
    }
  };

  // Remove duplicates from database
  const removeDuplicates = async () => {
    try {
      const response = await fetch('/api/jobs/remove-duplicates', {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Failed to remove duplicates');
        return;
      }

      const data = await response.json();
      console.log(`Removed ${data.removed} duplicate jobs`);
    } catch (error) {
      console.error('Error removing duplicates:', error);
    }
  };

  // View run details
  const viewRunDetails = async (runId: string) => {
    setSelectedRun(runId);
    await fetchRunDetails(runId);
  };

  // Close run details modal
  const closeRunDetails = () => {
    setSelectedRun(null);
    setRunDetails(null);
    setSearchQuery('');
  };

  // Calculate total estimated cost
  const calculateTotalCost = () => {
    return actorConfigs
      .filter((config) => config.enabled)
      .reduce((sum, config) => {
        // Calculate cost based on customMaxResults
        const costPerUnit = config.estimatedCost / config.maxResults;
        return sum + costPerUnit * config.customMaxResults;
      }, 0);
  };

  // Start job load
  const startJobLoad = async () => {
    if (!hasApiKey) {
      showToast('Please configure your Apify API token first!', 'error');
      setShowSettings(true);
      return;
    }

    // Get enabled actors
    const enabledActors = actorConfigs.filter((config) => config.enabled);

    if (enabledActors.length === 0) {
      showToast('Please enable at least one actor in the settings!', 'error');
      setShowSettings(true);
      setSettingsTab('actors');
      return;
    }

    const totalCost = calculateTotalCost();

    // Confirm before starting
    if (
      !confirm(
        `Start loading jobs from ${enabledActors.length} actor(s)?\n\n` +
          `Total estimated cost: $${totalCost.toFixed(2)}\n` +
          `Estimated jobs: ${enabledActors
            .reduce((sum, actor) => sum + actor.customMaxResults, 0)
            .toLocaleString()}\n\n` +
          `This will use your Apify credits. Continue?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/jobload/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Apify-Token': apiKey,
        },
        body: JSON.stringify({
          actorConfigs: enabledActors.map((config) => ({
            actorId: config.id,
            maxResults: config.customMaxResults,
          })),
        }),
      });

      // Check if response is OK and is JSON
      if (!response.ok) {
        const text = await response.text();
        console.error('Trigger request failed:', response.status, text);
        showToast(`Request failed (${response.status}): ${response.statusText}`, 'error');
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON response but got:', contentType, text);
        showToast('Server returned an unexpected response. Check console for details.', 'error');
        return;
      }

      const data = await response.json();

      if (data.success) {
        showToast(
          `Started loading jobs from ${data.runIds?.length || 0} actors! Estimated cost: $${data.totalEstimatedCost?.toFixed(2) || '0.00'}`,
          'success'
        );
        // Immediately fetch status to show the running jobs
        setTimeout(() => fetchStatus(), 500);
      } else {
        showToast(`Failed to start: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error starting job load:', error);
      showToast('Failed to start job load. Check console for details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh
  useEffect(() => {
    fetchStatus();

    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, apiKey]);

  // Fetch historical runs on mount and when API key changes
  useEffect(() => {
    if (hasApiKey) {
      fetchHistoricalRuns();
    }
  }, [hasApiKey]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'running':
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'running':
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getApifyStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'FAILED':
      case 'TIMED-OUT':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'ABORTED':
        return <XCircle className="w-5 h-5 text-orange-500" />;
      case 'RUNNING':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getApifyStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'FAILED':
      case 'TIMED-OUT':
        return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'ABORTED':
        return 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'RUNNING':
        return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Job Load Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor real-time job loading from Apify actors
            </p>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* API Key Warning */}
        {!hasApiKey && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                API Key Required
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                You need to configure your Apify API token to start loading jobs.
              </p>
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Configure Now
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={startJobLoad}
            disabled={loading || !hasApiKey || (status?.overall.runningLoads || 0) > 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            {!hasApiKey ? 'Configure API Key First' : 'Start Job Load'}
          </button>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">Auto-refresh</span>
          </label>
        </div>

        {status && (
          <>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {status.overall.overallProgress}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Overall Progress
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {status.overall.totalJobsSynced.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Jobs Synced
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${status.overall.totalCost.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated Cost
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hasApiKey ? `$${status.usage.creditsRemaining.toFixed(2)}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {hasApiKey ? 'Credits Remaining' : 'Configure API Key'}
                </div>
              </div>
            </div>

            {/* Actor Status Cards */}
            {status.loads.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mb-8">
                {status.loads.map((load) => (
                  <div
                    key={load.runId}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(load.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {load.actorName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {load.status === 'completed'
                              ? `Completed in ${load.duration}s`
                              : `Running for ${load.duration}s`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {load.jobsSynced.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          jobs synced
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{load.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${getStatusColor(load.status)} transition-all duration-500`}
                          style={{ width: `${load.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Fetched</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {load.jobsFetched.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Cost</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ${load.estimatedCost.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Status</div>
                        <div className="font-semibold text-gray-900 dark:text-white capitalize">
                          {load.status}
                        </div>
                      </div>
                    </div>

                    {/* Errors */}
                    {load.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                          Errors:
                        </p>
                        {load.errors.map((error, idx) => (
                          <p key={idx} className="text-sm text-red-600 dark:text-red-400">
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm text-center mb-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No job loads running. Click "Start Job Load" to begin.
                </p>
              </div>
            )}

            {/* Live Logs */}
            <div className="bg-gray-900 rounded-lg p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Live Logs</h3>
              <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400">No logs yet. Start a job load to see activity.</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="text-gray-300">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* All Historical Runs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    All Runs ({historicalRuns.length})
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Click "View Results" to preview jobs or "Import to DB" to save them in unified format
                  </p>
                </div>
                <button
                  onClick={fetchHistoricalRuns}
                  disabled={loadingHistoricalRuns}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loadingHistoricalRuns ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {loadingHistoricalRuns ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Loading historical runs...
                  </p>
                </div>
              ) : historicalRuns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    No runs found. Start a job load to see runs here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {historicalRuns.map((run) => (
                    <div
                      key={run.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getApifyStatusIcon(run.status)}
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {run.actorName}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full font-medium ${getApifyStatusColor(
                                run.status
                              )}`}
                            >
                              {run.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(run.startedAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {run.stats?.outputDataset?.itemCount !== undefined && (
                              <span>
                                {run.stats.outputDataset.itemCount.toLocaleString()} results
                              </span>
                            )}
                            {run.stats?.totalUsage && (
                              <span>${(run.stats.totalUsage.USD || 0).toFixed(4)} cost</span>
                            )}
                            {run.finishedAt && (
                              <span>
                                {Math.round(
                                  (new Date(run.finishedAt).getTime() -
                                    new Date(run.startedAt).getTime()) /
                                    1000
                                )}
                                s duration
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewRunDetails(run.id)}
                              disabled={importing[run.id]}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => importRun(run.id, run.actId)}
                              disabled={importing[run.id]}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                            >
                              {importing[run.id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              Import
                            </button>
                          </div>

                          {/* Progress bar */}
                          {importProgress[run.id] && (
                            <div className="w-full">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {importProgress[run.id].status}
                                </span>
                                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                  {importProgress[run.id].progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-green-600 h-full transition-all duration-300 ease-out"
                                  style={{ width: `${importProgress[run.id].progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!status && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading status...</p>
          </div>
        )}
      </div>

      {/* Run Details Modal */}
      {selectedRun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Job Run Results & Logs
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Run ID: {selectedRun}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Preview job results, search through them, and import to your database in unified format
                </p>
              </div>
              <button
                onClick={closeRunDetails}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingRunDetails ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading run details...</p>
              </div>
            ) : runDetails ? (
              <div className="space-y-6">
                {/* Run Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                    <div className="font-semibold text-gray-900 dark:text-white capitalize">
                      {runDetails.run.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {runDetails.totalItems.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Started</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {new Date(runDetails.run.startedAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Finished</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {new Date(runDetails.run.finishedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Import Button */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Ready to Import
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Import all {runDetails.totalItems.toLocaleString()} jobs to your database with automatic format normalization
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => importRun(selectedRun, runDetails.run.actorId)}
                        disabled={importing[selectedRun]}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                      >
                        {importing[selectedRun] ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                        {importing[selectedRun] ? importProgress[selectedRun]?.status || 'Importing...' : 'Import All Jobs'}
                      </button>

                      {/* Progress indicator */}
                      {importProgress[selectedRun] && (
                        <div className="mt-2 w-64">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {importProgress[selectedRun].status}
                            </span>
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                              {importProgress[selectedRun].progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-green-600 h-full transition-all duration-300 ease-out"
                              style={{ width: `${importProgress[selectedRun].progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Results */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Job Results ({runDetails.items.length})
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Raw data from Apify - will be normalized to unified format on import
                      </p>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jobs..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Company
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Location
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Posted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {runDetails.items
                          .filter((item: any) => {
                            if (!searchQuery) return true;
                            const query = searchQuery.toLowerCase();
                            return (
                              item.title?.toLowerCase().includes(query) ||
                              item.company?.toLowerCase().includes(query) ||
                              item.companyName?.toLowerCase().includes(query) ||
                              item.location?.toLowerCase().includes(query)
                            );
                          })
                          .slice(0, 100)
                          .map((item: any, idx: number) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 dark:hover:bg-gray-900"
                            >
                              <td className="px-4 py-3 text-gray-900 dark:text-white">
                                {item.title || item.positionName || 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {item.company || item.companyName || 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {item.location || item.locationName || 'Remote'}
                              </td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {item.publishedAt || item.postedAt
                                  ? new Date(
                                      item.publishedAt || item.postedAt
                                    ).toLocaleDateString()
                                  : 'N/A'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {searchQuery &&
                    runDetails.items.filter((item: any) => {
                      const query = searchQuery.toLowerCase();
                      return (
                        item.title?.toLowerCase().includes(query) ||
                        item.company?.toLowerCase().includes(query) ||
                        item.companyName?.toLowerCase().includes(query) ||
                        item.location?.toLowerCase().includes(query)
                      );
                    }).length === 0 && (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                        No jobs match your search query.
                      </p>
                    )}

                  {runDetails.items.length > 100 && !searchQuery && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                      Showing first 100 of {runDetails.items.length} jobs. Use search to filter.
                    </p>
                  )}
                </div>

                {/* Logs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Run Logs
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                      {runDetails.logs || 'No logs available'}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Failed to load run details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full my-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Apify Settings
            </h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSettingsTab('api-key')}
                className={`pb-2 px-4 font-medium transition-colors ${
                  settingsTab === 'api-key'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                API Key
              </button>
              <button
                onClick={() => setSettingsTab('actors')}
                className={`pb-2 px-4 font-medium transition-colors ${
                  settingsTab === 'actors'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Actor Configuration
              </button>
            </div>

            {/* API Key Tab */}
            {settingsTab === 'api-key' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Token
                  </label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="apify_api_..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Get your API token from:{' '}
                    <a
                      href="https://console.apify.com/account/integrations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Apify Console
                    </a>
                  </p>
                </div>

                <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Free Tier:</strong> $5 monthly credits (no credit card required)
                    <br />
                    <strong>Current Balance:</strong>{' '}
                    {status?.usage.creditsRemaining !== undefined
                      ? `$${status.usage.creditsRemaining.toFixed(2)}`
                      : 'Configure API key to see balance'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveApiKey}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save API Key
                  </button>
                  {hasApiKey && (
                    <button
                      onClick={clearApiKey}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Actor Configuration Tab */}
            {settingsTab === 'actors' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Configure Actors
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable/disable actors and set custom job limits for each source.
                  </p>
                </div>

                {/* Total Cost Preview */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated Total Cost
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${calculateTotalCost().toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Enabled Actors
                      </div>
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {actorConfigs.filter((c) => c.enabled).length} / {actorConfigs.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actor Cards */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {loadingActors ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Loading actors...</p>
                    </div>
                  ) : actorConfigs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No actors available. Please refresh the page.
                      </p>
                    </div>
                  ) : (
                    actorConfigs.map((config) => (
                    <div
                      key={config.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        config.enabled
                          ? 'border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
                      }`}
                    >
                      {/* Header with Toggle */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {config.name}
                            {config.enabled && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                                Active
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {config.id}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.enabled}
                            onChange={(e) =>
                              updateActorConfig(config.id, { enabled: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Max Results Slider */}
                      {config.enabled && (
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Max Results
                              </label>
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {config.customMaxResults.toLocaleString()} jobs
                              </span>
                            </div>
                            <input
                              type="range"
                              min="100"
                              max={config.maxResults}
                              step="100"
                              value={config.customMaxResults}
                              onChange={(e) =>
                                updateActorConfig(config.id, {
                                  customMaxResults: parseInt(e.target.value),
                                })
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>100</span>
                              <span>{config.maxResults.toLocaleString()} (max)</span>
                            </div>
                          </div>

                          {/* Cost Estimate */}
                          <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Estimated Cost
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              $
                              {(
                                (config.estimatedCost / config.maxResults) *
                                config.customMaxResults
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    ))
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveActorConfigs}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
