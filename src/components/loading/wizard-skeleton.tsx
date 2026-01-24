/**
 * Wizard Skeleton Loading State
 * Displays while the resume wizard is initializing
 */
export function WizardSkeleton() {
    return (
        <div className="flex h-screen overflow-hidden bg-primary">
            {/* Left side - Form skeleton */}
            <div className="flex w-[600px] flex-col border-r border-secondary">
                {/* Header skeleton */}
                <div className="border-b border-secondary bg-primary px-6 py-6">
                    <div className="h-7 w-48 animate-pulse rounded bg-secondary"></div>
                    <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary"></div>
                </div>

                {/* Tab navigation skeleton */}
                <div className="border-b border-secondary px-6 py-3">
                    <div className="flex gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="h-5 w-5 animate-pulse rounded-full bg-secondary"></div>
                                <div className="h-4 w-20 animate-pulse rounded bg-secondary"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-8">
                        <div>
                            <div className="h-6 w-48 animate-pulse rounded bg-secondary"></div>
                            <div className="mt-2 h-4 w-96 animate-pulse rounded bg-secondary"></div>
                        </div>

                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 animate-pulse rounded bg-secondary"></div>
                                    <div className="h-10 w-full animate-pulse rounded-lg bg-secondary"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Preview skeleton */}
            <div className="flex flex-1 flex-col bg-secondary/30">
                <div className="border-b border-secondary bg-primary px-6 py-4">
                    <div className="h-5 w-32 animate-pulse rounded bg-secondary"></div>
                    <div className="mt-1 h-3 w-48 animate-pulse rounded bg-secondary"></div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-[800px]">
                        <div className="h-[1000px] w-full animate-pulse rounded-lg bg-primary shadow-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
