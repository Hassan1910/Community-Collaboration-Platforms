import { prisma } from "@/lib/db"
import { ProjectCard } from "@/components/project-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingHero } from "@/components/landing-hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"

export const dynamic = "force-dynamic"

async function getProjects() {
  return await prisma.project.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true
        }
      }
    }
  })
}

type ProjectWithUser = Awaited<ReturnType<typeof getProjects>>[number]

export default async function Home() {
  const projects = await getProjects()

  return (
    <div className="flex flex-col min-h-screen">

      <LandingHero />
      <Features />
      <HowItWorks />

      <section id="feed" className="container mx-auto px-4 py-16 max-w-7xl border-t">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Recently Shipped</h2>
            <p className="text-muted-foreground">
              Discover what the community is building right now.
            </p>
          </div>
          <Link href="/ship">
            <Button className="font-mono">
              Ship Your Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: ProjectWithUser) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 border rounded-lg border-dashed bg-muted/20">
            <p className="text-muted-foreground mb-4">No projects shipped yet.</p>
            <Link href="/ship">
              <Button variant="outline">Be the first to ship</Button>
            </Link>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
              View all projects &rarr;
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
