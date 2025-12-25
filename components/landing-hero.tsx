import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHero() {
    return (
        <section className="relative overflow-hidden py-20 md:py-32 bg-background">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
                        🎉 The best place to showcase your side-projects
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
                        Build clearly. <br className="hidden md:inline" />
                        <span className="text-primary">Ship proudly.</span> Connect instantly.
                    </h1>
                    <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl mt-4 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-both delay-100">
                        Descov is the premier community for developers to share their work, get constructive feedback, and find collaborators for their next big idea.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both delay-200">
                        <Link href="/ship">
                            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                Ship Project 🚀
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                                Learn more
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Abstract Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur-[100px]" />
            </div>
        </section>
    )
}
