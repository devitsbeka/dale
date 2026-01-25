'use client';

/**
 * Job Load Progress Page
 * Real-time monitoring of Apify actor job loading
 */

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Clock, Zap, Settings, AlertTriangle } from 'lucide-react';

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

export default function JobLoadPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('apify_api_token');
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyInput(savedKey);
      setHasApiKey(true);
    }
  }, []);

  // Fetch status
  const fetchStatus = async () => {
    try {
      const headers: HeadersInit = {};
      if (apiKey) {
        headers['X-Apify-Token'] = apiKey;
      }

      const response = await fetch('/api/jobload/status', { headers });
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
      alert('API key saved! You can now start job loading.');
      // Fetch status with new key
      fetchStatus();
    } else {
      alert('Please enter a valid API key');
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

  // Start job load
  const startJobLoad = async () => {
    if (!hasApiKey) {
      alert('Please configure your Apify API token first!');
      setShowSettings(true);
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
      });
      const data = await response.json();

      if (data.success) {
        alert(`Started loading jobs from ${data.runIds?.length || 0} actors!\n\nEstimated cost: $${data.totalEstimatedCost?.toFixed(2) || '0.00'}`);
        fetchStatus();
      } else {
        alert(`Failed to start: ${data.error}\n\nPlease check:\n1. Your API key is correct\n2. You have sufficient Apify credits\n3. The actor IDs are valid`);
      }
    } catch (error) {
      console.error('Error starting job load:', error);
      alert('Failed to start job load. Check console for details.');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
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
            <div className="bg-gray-900 rounded-lg p-6 shadow-sm">
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
          </>
        )}

        {!status && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading status...</p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Apify API Settings
            </h2>

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

            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Free Tier:</strong> $5 monthly credits (no credit card required)
                <br />
                <strong>Estimated:</strong> ~8,500 jobs total from 3 actors
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
        </div>
      )}
    </div>
  );
}
