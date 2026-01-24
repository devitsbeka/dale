/**
 * Card Skeleton Loading State
 * Displays while resume cards are loading
 */
export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-secondary bg-primary p-6">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-6 w-48 animate-pulse rounded bg-secondary"></div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-pulse rounded bg-secondary"></div>
                        <div className="h-4 w-32 animate-pulse rounded bg-secondary"></div>
                    </div>
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-secondary"></div>
            </div>

            <div className="mt-6 flex gap-2">
                <div className="h-9 flex-1 animate-pulse rounded-lg bg-secondary"></div>
                <div className="h-9 flex-1 animate-pulse rounded-lg bg-secondary"></div>
            </div>
        </div>
    );
}

/**
 * Grid of card skeletons
 */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
