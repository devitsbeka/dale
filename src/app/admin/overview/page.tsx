/**
 * Admin Overview Page - Dashboard with key metrics
 */

export default function AdminOverviewPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-sm font-medium text-blue-600 mb-2">Total Jobs</div>
          <div className="text-3xl font-bold text-blue-900">Loading...</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-sm font-medium text-green-600 mb-2">Active Jobs</div>
          <div className="text-3xl font-bold text-green-900">Loading...</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="text-sm font-medium text-orange-600 mb-2">Stale Jobs</div>
          <div className="text-3xl font-bold text-orange-900">Loading...</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-sm font-medium text-purple-600 mb-2">With Salary</div>
          <div className="text-3xl font-bold text-purple-900">Loading...</div>
        </div>
      </div>

      <p className="text-gray-600">
        Use the navigation on the left to access admin features for managing jobs at 100k+ scale.
      </p>
    </div>
  );
}
