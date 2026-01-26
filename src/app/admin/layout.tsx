/**
 * Admin Layout - Navigation and structure for admin pages
 */

import Link from 'next/link';

export const metadata = {
  title: 'Admin - Dale Job Board',
  description: 'Administrative interface for managing jobs at scale',
};

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: '📊' },
  { name: 'Jobs', href: '/admin/jobs', icon: '💼' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { name: 'Sync Monitor', href: '/admin/sync', icon: '🔄' },
  { name: 'Export', href: '/admin/export', icon: '📥' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Back to Site
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-500">
              100k+ Scale Management
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <AdminNavLink key={item.href} item={item} />
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function AdminNavLink({ item }: { item: typeof navigation[0] }) {
  // Note: We can't use usePathname in Server Components
  // This would need to be a Client Component for active state
  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      <span className="text-xl">{item.icon}</span>
      <span>{item.name}</span>
    </Link>
  );
}
