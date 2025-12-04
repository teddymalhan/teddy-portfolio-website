"use client";

import { Trophy } from "lucide-react";
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
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    github: "#",
    demo: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/?utm_source=chatgpt.com#:~:text=Digital%20dispositions%20and-,digital%20scorecards,-bring%20accountability%20and",
    internship: true,
    background: (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/digital_scorecards.webp"
            alt="Digital Scorecards"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
          />
        </div>
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
    technologies: ["React", "Python", "FAISS", "OpenAI"],
    github: "#",
    demo: "https://devpost.com/software/wastewise-agcrsi",
    background: (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/wastewise.jpg"
            alt="WasteWise"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
          />
        </div>
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
      "React",
      "TypeScript",
      "Python",
      "TensorFlow",
      "Node.js",
      "MongoDB",
    ],
    github: "https://github.com/teddymalhan/kaeru",
    demo: "https://github.com/teddymalhan/kaeru",
    featured: true,
    background: (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/kaeru.png"
            alt="Kaeru"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
          />
        </div>
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
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    github: "https://github.com/teddymalhan/grad-gains",
    demo: "#",
    award: "1st Place",
    featured: true,
    background: (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/grad-gains.png"
            alt="GradGains"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
          />
        </div>
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
    technologies: ["TypeScript", "Node.js", "OpenAI", "Git"],
    github: "https://github.com/teddymalhan/CommitWise",
    demo: "https://commitwise.malhan.ca",
    background: (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/commitwise.png"
            alt="CommitWise"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
          />
        </div>
      </div>
    ),
  },
];

export function ProjectsBento() {
  return (
    <section id="projects" className="min-h-screen pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-left text-foreground">
            Projects
          </h2>
        </div>

        <BentoGrid>
          {projects.map((project, idx) => {
            const { technologies, github, demo, award, ...cardProps } = project;
            return (
              <BentoCard 
                key={idx} 
                {...cardProps}
                onClick={() => window.open(project.href, '_blank', 'noopener,noreferrer')}
              >
                {award && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold shadow-lg animate-pulse border-0 pointer-events-none z-30">
                    <Trophy className="w-3 h-3 mr-1" />
                    {award}
                  </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none z-20">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent -mx-4 -mb-4 px-4 pb-4 pt-8">
                      <h3 className="text-xl font-semibold text-white">
                        {project.name}
                      </h3>
                    </div>
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
