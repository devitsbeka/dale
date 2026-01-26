/**
 * Admin Root Page - Redirect to overview
 */

import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/admin/overview');
}
