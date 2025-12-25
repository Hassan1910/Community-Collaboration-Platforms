
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-6">
                <AlertCircleIcon className="size-12" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-tight mb-2">
                Something went wrong
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
                We encountered an error while loading this page. It might be a temporary glitch.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default" size="lg">
                    Try again
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" size="lg">
                    Reload Page
                </Button>
            </div>
        </div>
    )
}
