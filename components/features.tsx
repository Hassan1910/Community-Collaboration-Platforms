import { Rocket, MessageSquare, Users, Star } from "lucide-react"

const features = [
    {
        icon: <Rocket className="h-6 w-6 text-primary" />,
        title: "Showcase Your Work",
        description: "Give your side projects the visibility they deserve. Create a portfolio that stands out to recruiters and peers alike."
    },
    {
        icon: <MessageSquare className="h-6 w-6 text-primary" />,
        title: "Get Honest Feedback",
        description: "Connect with other developers who can provide code reviews, UI/UX suggestions, and feature ideas."
    },
    {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: "Find Collaborators",
        description: "Stuck on a problem or need a designer? Mark your project as 'seeking contributors' and build a team."
    },
    {
        icon: <Star className="h-6 w-6 text-primary" />,
        title: "Weekly Highlights",
        description: "Top projects get featured in our weekly highlights, giving you extra exposure to the community."
    }
]

export function Features() {
    return (
        <section id="features" className="py-20 md:py-28 bg-muted/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Why use Descov?
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-lg">
                        We provide the ecosystem you need to turn your side projects into real products.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-6 bg-background rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
                        >
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed text-balance max-w-[80%] mx-auto">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
