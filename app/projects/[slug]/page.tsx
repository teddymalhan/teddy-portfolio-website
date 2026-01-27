import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { ProjectDetailPage } from "@/components/project-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

// Only allow pre-generated project slugs (SSG optimization)
export const dynamicParams = false;

// Force static generation at build time
export const dynamic = 'force-static';

// Revalidate once per day for static content updates
export const revalidate = 86400;

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Teddy Malhan`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.heroImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPage project={project} />;
}
