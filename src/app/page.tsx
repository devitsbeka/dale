'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                // Authenticated users go to dashboard
                router.push('/dashboard');
            } else {
                // Unauthenticated users go to login
                router.push('/login');
            }
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking auth
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-2 text-sm text-gray-600">Loading CareerOS...</p>
            </div>
        </div>
    );
}
