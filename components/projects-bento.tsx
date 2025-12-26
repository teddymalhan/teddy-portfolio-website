"use client";

import { ArrowUpRight, Trophy } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    name: "Digital Scorecards",
    title: "Digital Scorecards",
    period: "Internship",
    description:
      "Built enterprise-grade digital scorecards for Dialpad's contact center, bringing accountability and performance visibility to customer service teams.",
    href: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/?utm_source=chatgpt.com#:~:text=Digital%20dispositions%20and-,digital%20scorecards,-bring%20accountability%20and",
    cta: "Read More",
    className: "col-span-3 lg:col-span-2",
    technologies: ["Vue.js", "Django", "Python", "Google Cloud Platform"],
    github: "#",
    demo: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/?utm_source=chatgpt.com#:~:text=Digital%20dispositions%20and-,digital%20scorecards,-bring%20accountability%20and",
    internship: true,
    background: (
      <div className="relative h-[60%] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src="/digital_scorecards.webp"
          alt="Digital Scorecards"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 400px, 362px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={false}
        />
      </div>
    ),
  },
  {
    name: "WasteWise",
    title: "WasteWise",
    period: "Oct 2024",
    description:
      "Architected a FAISS & NLP based waste sorting system powered by RAG, OpenAI Embeddings, parsing 20k+ mappings of food items to bins.",
    href: "https://devpost.com/software/wastewise-agcrsi",
    cta: "Learn More",
    className: "col-span-3 lg:col-span-1",
    technologies: ["FastAPI", "Python", "React Native", "FAISS", "Neo4j"],
    github: "#",
    demo: "https://devpost.com/software/wastewise-agcrsi",
    background: (
      <div className="relative h-[60%] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src="/wastewise.jpg"
          alt="WasteWise"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    ),
  },
  {
    name: "Kaeru",
    title: "Kaeru",
    period: "2024",
    description:
      "An innovative AI-powered platform that revolutionizes how users interact with technology through advanced machine learning and intuitive design.",
    className: "col-span-3 lg:col-span-3",
    href: "https://github.com/teddymalhan/kaeru",
    cta: "Learn More",
    technologies: [
      "AWS CDK",
      "Next.js",
      "AWS Amplify",
      "TypeScript",
      "Python",
      "TensorFlow",
    ],
    github: "https://github.com/teddymalhan/kaeru",
    demo: "https://github.com/teddymalhan/kaeru",
    featured: true,
    background: (
      <div className="relative h-[60%] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src="/kaeru.png"
          alt="Kaeru"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    ),
  },
  {
    name: "GradGains",
    title: "GradGains",
    period: "2024",
    description:
      "🏆 Google DSC Hackathon Winner - Best Project. A financial social media platform designed to help students manage their finances.",
    className: "col-span-3 lg:col-span-1",
    href: "https://github.com/teddymalhan/grad-gains",
    cta: "View Project",
    technologies: ["Drizzle ORM", "React", "Next.js"],
    github: "https://github.com/teddymalhan/grad-gains",
    demo: "#",
    featured: true,
    background: (
      <div className="relative h-[60%] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src="/grad-gains.png"
          alt="GradGains"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    ),
  },
  {
    name: "CommitWise",
    title: "CommitWise",
    period: "2024",
    description:
      "A smart Git commit assistant that analyzes code changes and generates meaningful, conventional commit messages using AI.",
    className: "col-span-3 lg:col-span-2",
    href: "https://commitwise.malhan.ca",
    cta: "Demo",
    technologies: ["Spring Boot", "React", "Next.js"],
    github: "https://github.com/teddymalhan/CommitWise",
    demo: "https://commitwise.malhan.ca",
    background: (
      <div className="relative h-[60%] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src="/commitwise.png"
          alt="CommitWise"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    ),
  },
];

export function ProjectsBento() {
  return (
    <section id="projects" className="min-h-screen pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-5xl font-bold tracking-tight text-left text-foreground">
            Projects
          </h2>
        </div>

        <BentoGrid>
          {projects.map((project) => {
            const { technologies, github, demo, ...cardProps } = project;
            const tags = (technologies ?? []).slice(0, 3);
            const award = 'award' in project && typeof project.award === 'string' ? project.award : undefined;
            return (
              <BentoCard
                key={project.name}
                {...cardProps}
                className={cn(
                  "bg-white dark:bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                  cardProps.className
                )}
                onClick={() =>
                  window.open(project.href, "_blank", "noopener,noreferrer")
                }
              >
                {award && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold shadow-lg border-0 z-30">
                    <Trophy className="w-3 h-3 mr-1" />
                    {award}
                  </Badge>
                )}

                <div className="flex flex-1 flex-col bg-white dark:bg-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-xs font-normal bg-muted text-muted-foreground border-0"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
