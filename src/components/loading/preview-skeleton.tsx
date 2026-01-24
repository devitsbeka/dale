/**
 * Preview Skeleton Loading State
 * Displays while resume preview is rendering
 */
export function PreviewSkeleton() {
    return (
        <div className="w-full max-w-[800px] animate-in fade-in duration-300">
            <div className="rounded-lg border border-secondary bg-primary p-12 shadow-md">
                {/* Header section */}
                <div className="space-y-3 border-b border-secondary pb-6">
                    <div className="h-8 w-64 animate-pulse rounded bg-secondary"></div>
                    <div className="h-4 w-48 animate-pulse rounded bg-secondary"></div>
                    <div className="flex gap-4">
                        <div className="h-4 w-40 animate-pulse rounded bg-secondary"></div>
                        <div className="h-4 w-40 animate-pulse rounded bg-secondary"></div>
                    </div>
                </div>

                {/* Summary section */}
                <div className="space-y-3 border-b border-secondary py-6">
                    <div className="h-5 w-32 animate-pulse rounded bg-secondary"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-secondary"></div>
                        <div className="h-4 w-full animate-pulse rounded bg-secondary"></div>
                        <div className="h-4 w-3/4 animate-pulse rounded bg-secondary"></div>
                    </div>
                </div>

                {/* Experience section */}
                <div className="space-y-4 border-b border-secondary py-6">
                    <div className="h-5 w-40 animate-pulse rounded bg-secondary"></div>
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-48 animate-pulse rounded bg-secondary"></div>
                            <div className="h-4 w-32 animate-pulse rounded bg-secondary"></div>
                            <div className="space-y-1">
                                <div className="h-3 w-full animate-pulse rounded bg-secondary"></div>
                                <div className="h-3 w-full animate-pulse rounded bg-secondary"></div>
                                <div className="h-3 w-2/3 animate-pulse rounded bg-secondary"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Education section */}
                <div className="space-y-4 border-b border-secondary py-6">
                    <div className="h-5 w-32 animate-pulse rounded bg-secondary"></div>
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-56 animate-pulse rounded bg-secondary"></div>
                            <div className="h-4 w-40 animate-pulse rounded bg-secondary"></div>
                        </div>
                    ))}
                </div>

                {/* Skills section */}
                <div className="space-y-4 py-6">
                    <div className="h-5 w-24 animate-pulse rounded bg-secondary"></div>
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-6 w-20 animate-pulse rounded bg-secondary"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
