
export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 animate-pulse">
                <div className="space-y-3">
                    <div className="h-10 w-48 bg-muted rounded-md" />
                    <div className="h-6 w-96 bg-muted/60 rounded-md" />
                </div>
                <div className="h-10 w-32 bg-muted rounded-md" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="border border-border/60 rounded-xl overflow-hidden shadow-sm h-full flex flex-col bg-card animate-pulse">
                        <div className="aspect-video w-full bg-muted" />
                        <div className="p-4 space-y-3 flex-1">
                            <div className="h-6 w-3/4 bg-muted rounded-md" />
                            <div className="h-4 w-full bg-muted/60 rounded-md" />
                            <div className="h-4 w-2/3 bg-muted/60 rounded-md" />
                            <div className="flex gap-2 mt-2">
                                <div className="h-5 w-12 bg-muted/40 rounded-full" />
                                <div className="h-5 w-16 bg-muted/40 rounded-full" />
                            </div>
                        </div>
                        <div className="p-3 bg-muted/5 border-t flex items-center gap-2">
                            <div className="size-6 rounded-full bg-muted" />
                            <div className="h-4 w-24 bg-muted rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
