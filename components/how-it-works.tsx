import { ArrowRight } from "lucide-react"

const steps = [
    {
        number: "01",
        title: "Ship It",
        description: "Submit your project with a GitHub link, demo URL, and a catchy description."
    },
    {
        number: "02",
        title: "Get Noticed",
        description: "Your project appears on the feed where the community can like, comment, and review it."
    },
    {
        number: "03",
        title: "Iterate & Grow",
        description: "Use the feedback to improve your project, find bugs, or recruit team members."
    }
]

export function HowItWorks() {
    return (
        <section className="py-20 md:py-28 bg-background border-y">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            From localhost to <span className="text-primary">launched</span> in minutes.
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            We've stripped away the complexity. No approval queues, no complicated forms. Just share what you've built.
                        </p>

                        <div className="space-y-8 mt-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-none font-mono text-3xl font-bold text-muted-foreground/30">
                                        {step.number}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:w-1/2 w-full">
                        <div className="relative rounded-xl border bg-muted/40 p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
                            {/* Visual representation / decorative elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-primary/5" />

                            <div className="relative z-10 w-full max-w-[320px] bg-background rounded-lg shadow-xl border p-4 transform rotate-3 transition-transform hover:rotate-0 duration-500">
                                <div className="h-32 bg-muted rounded-md mb-4 w-full animate-pulse" />
                                <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                                <div className="h-4 bg-muted rounded w-1/2 mb-4 animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-8 w-20 bg-primary/20 rounded animate-pulse" />
                                    <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                                </div>
                            </div>

                            <div className="absolute top-1/2 right-12 z-0 w-full max-w-[320px] bg-background/50 backdrop-blur-sm rounded-lg shadow-lg border p-4 transform -rotate-6 scale-90 opacity-60">
                                <div className="h-32 bg-muted rounded-md mb-4 w-full" />
                                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
