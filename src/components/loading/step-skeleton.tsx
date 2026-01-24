/**
 * Step Skeleton Loading State
 * Displays while a wizard step is loading
 */
export function StepSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div>
                <div className="h-6 w-48 animate-pulse rounded bg-secondary"></div>
                <div className="mt-2 h-4 w-96 animate-pulse rounded bg-secondary"></div>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-secondary"></div>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-secondary"></div>
                    </div>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between border-t border-secondary pt-6">
                <div className="h-10 w-24 animate-pulse rounded-lg bg-secondary"></div>
                <div className="h-10 w-32 animate-pulse rounded-lg bg-secondary"></div>
            </div>
        </div>
    );
}
