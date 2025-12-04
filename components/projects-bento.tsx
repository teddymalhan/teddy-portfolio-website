"use client"

import { Github, ExternalLink, Trophy } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const projects = [
  {
    name: "Digital Scorecards",
    title: "Digital Scorecards",
    period: "Internship",
    description: "Built enterprise-grade digital scorecards for Dialpad's contact center, bringing accountability and performance visibility to customer service teams.",
    href: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/?utm_source=chatgpt.com#:~:text=Digital%20dispositions%20and-,digital%20scorecards,-bring%20accountability%20and",
    cta: "Read More",
    className: "col-span-3 lg:col-span-2",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    github: "#",
    demo: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/?utm_source=chatgpt.com#:~:text=Digital%20dispositions%20and-,digital%20scorecards,-bring%20accountability%20and",
    internship: true,
    background: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/digital_scorecards.webp"
            alt="Digital Scorecards"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    name: "WasteWise",
    title: "WasteWise",
    period: "Oct 2024",
    description: "Architected a FAISS & NLP based waste sorting system powered by RAG, OpenAI Embeddings, parsing 20k+ mappings of food items to bins.",
    href: "https://devpost.com/software/wastewise-agcrsi",
    cta: "Learn More",
    className: "col-span-3 lg:col-span-1",
    technologies: ["React", "Python", "FAISS", "OpenAI"],
    github: "#",
    demo: "https://devpost.com/software/wastewise-agcrsi",
    background: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/wastewise.jpg"
            alt="WasteWise"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    name: "Kaeru",
    title: "Kaeru",
    period: "2024",
    description: "An innovative AI-powered platform that revolutionizes how users interact with technology through advanced machine learning and intuitive design.",
    className: "col-span-3 lg:col-span-3",
    href: "https://github.com/teddymalhan/kaeru",
    cta: "Learn More",
    technologies: ["React", "TypeScript", "Python", "TensorFlow", "Node.js", "MongoDB"],
    github: "https://github.com/teddymalhan/kaeru",
    demo: "https://github.com/teddymalhan/kaeru",
    featured: true,
    background: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/kaeru.png"
            alt="Kaeru"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    name: "GradGains",
    title: "GradGains",
    period: "2024",
    description: "🏆 Google DSC Hackathon Winner - Best Project. A financial social media platform designed to help students manage their finances.",
    className: "col-span-3 lg:col-span-1",
    href: "https://github.com/teddymalhan/grad-gains",
    cta: "View Project",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    github: "https://github.com/teddymalhan/grad-gains",
    demo: "#",
    award: "1st Place",
    featured: true,
    background: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/grad-gains.png"
            alt="GradGains"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    name: "CommitWise",
    title: "CommitWise",
    period: "2024",
    description: "A smart Git commit assistant that analyzes code changes and generates meaningful, conventional commit messages using AI.",
    className: "col-span-3 lg:col-span-2",
    href: "https://commitwise.malhan.ca",
    cta: "Demo",
    technologies: ["TypeScript", "Node.js", "OpenAI", "Git"],
    github: "https://github.com/teddymalhan/CommitWise",
    demo: "https://commitwise.malhan.ca",
    background: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/commitwise.png"
            alt="CommitWise"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
]

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
               <BentoCard key={idx} {...cardProps}>
                 <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                   <Button 
                     className="bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-700 hover:to-gray-900 transform hover:scale-110 transition-all duration-300 shadow-lg" 
                     size="sm" 
                     onClick={(e) => {
                       e.preventDefault()
                       window.open(github, "_blank")
                     }}
                   >
                     <Github className="w-4 h-4" />
                   </Button>
                   <Button 
                     className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-lg" 
                     size="sm" 
                     onClick={(e) => {
                       e.preventDefault()
                       window.open(demo, "_blank")
                     }}
                   >
                     <ExternalLink className="w-4 h-4" />
                   </Button>
                 </div>
                 {award && (
                   <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold shadow-lg animate-pulse border-0 z-10">
                     <Trophy className="w-3 h-3 mr-1" />
                     {award}
                   </Badge>
                 )}

                 <div className="absolute bottom-20 left-4 right-4 z-10">
                   <div className="flex flex-wrap gap-2">
                     {technologies.slice(0, 4).map((tech, techIdx) => (
                       <span
                         key={techIdx}
                         className="rounded-full bg-white/90 dark:bg-gray-800/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                       >
                         {tech}
                       </span>
                     ))}
                     {technologies.length > 4 && (
                       <span className="rounded-full bg-white/90 dark:bg-gray-800/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                         +{technologies.length - 4} more
                       </span>
                     )}
                   </div>
                 </div>
               </BentoCard>
             );
           })}
         </BentoGrid>
      </div>
    </section>
  )
}
