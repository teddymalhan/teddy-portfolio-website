/**
 * Project data types and content for portfolio
 */

// Terminal animation step types
export interface TerminalStep {
  text: string;
  type: "command" | "output" | "success" | "error" | "progress";
  delay?: number;
}

// Feature bullet with colored dot
export interface ProjectFeature {
  text: string;
  dotColor: string;
}

// External link for sidebar
export interface ProjectLink {
  label: string;
  href: string;
  icon: "ExternalLink" | "Github" | "Youtube" | "FileText" | "Play";
}

// Timeline entry
export interface TimelineEntry {
  date: string;
  event?: string;
}

// Media for demo section
export interface ProjectMedia {
  type: "image" | "video" | "gif";
  src: string;
  alt: string;
  caption?: string;
}

// Content section (Overview, Background, etc.)
export interface ContentSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

// Project type categories
export type ProjectType = "internship" | "hackathon" | "personal" | "opensource";

// Full project data
export interface Project {
  // Identity
  slug: string;
  name: string;
  title: string;
  tagline?: string;

  // Metadata
  period: string;
  year: number;
  technologies: string[];
  type: ProjectType;
  featured?: boolean;
  award?: string;

  // Card content
  description: string;
  cta: string;
  heroImage: string;
  gridClassName: string;

  // External links
  href: string;
  github?: string;
  demo?: string;
  links: ProjectLink[];

  // Detail page - Hero
  features: ProjectFeature[];
  desktopMockup?: string;
  mobileMockups?: string[];

  // Detail page - Terminal
  terminalSteps: TerminalStep[];
  terminalProgressMessage?: string;

  // Detail page - Demo
  demoMedia?: ProjectMedia;

  // Detail page - Content
  sections: ContentSection[];

  // Detail page - Sidebar
  timeline: TimelineEntry[];
  tools: string[];

  // Detail page - Results
  results?: string[];
  takeaways?: string[];
}

// Simplified type for bento card display
export type BentoProject = Pick<
  Project,
  | "slug"
  | "name"
  | "title"
  | "period"
  | "description"
  | "cta"
  | "technologies"
  | "featured"
  | "award"
  | "type"
  | "heroImage"
  | "gridClassName"
>;

// Project data
export const projects: Project[] = [
  {
    slug: "digital-scorecards",
    name: "Digital Scorecards",
    title: "Digital Scorecards",
    tagline:
      "Enterprise-grade performance visibility for contact center teams",
    period: "Internship",
    year: 2024,
    technologies: ["Vue.js", "Django", "Python", "Google Cloud Platform"],
    type: "internship",
    description:
      "Built enterprise-grade digital scorecards for Dialpad's contact center, bringing accountability and performance visibility to customer service teams.",
    cta: "Read More",
    heroImage: "/digital_scorecards.webp",
    gridClassName: "col-span-3 lg:col-span-2",
    href: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/?utm_source=chatgpt.com#:~:text=Digital%20dispositions%20and-,digital%20scorecards,-bring%20accountability%20and",
    github: "#",
    demo: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/?utm_source=chatgpt.com#:~:text=Digital%20dispositions%20and-,digital%20scorecards,-bring%20accountability%20and",
    links: [
      {
        label: "Read Blog Post",
        href: "https://www.dialpad.com/blog/new-dialpad-features-and-updates-for-the-enterprise-contact-center/",
        icon: "ExternalLink",
      },
    ],
    features: [
      { text: "Real-time agent performance tracking", dotColor: "#4CAF50" },
      { text: "Customizable scoring metrics and criteria", dotColor: "#2196F3" },
      {
        text: "Manager dashboard with drill-down analytics",
        dotColor: "#FF9800",
      },
      { text: "Integration with Dialpad's contact center", dotColor: "#9C27B0" },
      { text: "Automated performance reports", dotColor: "#00BCD4" },
    ],
    terminalSteps: [
      { text: "npm run build", type: "command" },
      { text: "Compiling Vue.js components...", type: "output", delay: 40 },
      { text: "Building Django backend...", type: "output", delay: 40 },
      { text: "Running test suite...", type: "output", delay: 40 },
      { text: "All 47 tests passed", type: "success", delay: 40 },
      { text: "Deploying to GCP...", type: "output", delay: 40 },
    ],
    terminalProgressMessage: "Deploying to Google Cloud Platform...",
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "Digital Scorecards is an enterprise feature built for Dialpad's contact center platform, enabling managers to track and evaluate agent performance in real-time. The system provides customizable scoring criteria and automated performance reports.",
          "As a Software Engineering Intern, I designed and implemented the full-stack solution, working closely with product managers and senior engineers to deliver a feature that now serves thousands of contact center agents.",
        ],
      },
      {
        title: "Background",
        paragraphs: [
          "Contact centers face a constant challenge: how do you measure and improve agent performance at scale? Traditional methods relied on manual call reviews and subjective assessments, which were time-consuming and inconsistent.",
          "The goal was to create an automated, data-driven system that could score agent interactions based on customizable criteria, providing managers with actionable insights while giving agents clear feedback on their performance.",
        ],
      },
      {
        title: "Technical Implementation",
        paragraphs: [
          "The frontend was built with Vue.js, featuring a responsive dashboard with real-time updates via WebSocket connections. The scoring interface allows managers to define custom evaluation criteria with weighted scoring.",
          "The backend, built with Django and Python, handles score calculation, aggregation, and report generation. Data is stored in Google Cloud SQL with caching through Memcached for high-performance queries.",
        ],
      },
    ],
    timeline: [{ date: "Spring 2025" }],
    tools: [
      "Vue.js 3",
      "Django 4",
      "Python 3.11",
      "Google Cloud Platform",
      "PostgreSQL",
      "Memcached",
      "WebSockets",
    ],
    results: [
      "Shipped to production serving 1000+ contact center agents",
      "Reduced manual performance review time by 60%",
      "Achieved 99.9% uptime with auto-scaling infrastructure",
    ],
    takeaways: [
      "Enterprise software requires careful consideration of scale and reliability",
      "Close collaboration with product managers leads to better user experiences",
      "Performance optimization is critical for real-time dashboards",
    ],
  },
  {
    slug: "wastewise",
    name: "WasteWise",
    title: "WasteWise",
    tagline: "AI-powered waste sorting for sustainable communities",
    period: "Oct 2024",
    year: 2024,
    technologies: ["FastAPI", "Python", "React Native", "FAISS", "Neo4j"],
    type: "hackathon",
    description:
      "AI-powered waste sorting for sustainable communities",
    cta: "Learn More",
    heroImage: "/wastewise.jpg",
    gridClassName: "col-span-3 lg:col-span-1",
    href: "https://devpost.com/software/wastewise-agcrsi",
    github: "#",
    demo: "https://devpost.com/software/wastewise-agcrsi",
    links: [
      {
        label: "View on Devpost",
        href: "https://devpost.com/software/wastewise-agcrsi",
        icon: "ExternalLink",
      },
    ],
    features: [
      { text: "RAG-powered item classification", dotColor: "#4CAF50" },
      { text: "20k+ food item mappings", dotColor: "#2196F3" },
      { text: "Real-time sorting recommendations", dotColor: "#FF9800" },
      { text: "Neo4j knowledge graph for relationships", dotColor: "#9C27B0" },
    ],
    terminalSteps: [
      { text: "python -m uvicorn main:app --reload", type: "command" },
      { text: "Loading FAISS index...", type: "output", delay: 40 },
      { text: "Connecting to Neo4j database...", type: "output", delay: 40 },
      { text: "Initializing OpenAI embeddings...", type: "output", delay: 40 },
      { text: "Server running on http://localhost:8000", type: "success", delay: 40 },
    ],
    terminalProgressMessage: "Processing waste classification query...",
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "WasteWise is an AI-powered mobile application that helps users correctly sort their waste by identifying items and providing disposal recommendations. The system uses a combination of computer vision and natural language processing to understand what users want to dispose of.",
          "Built at StormHacks 2024, the application demonstrates how AI can make sustainability more accessible and reduce contamination in recycling streams.",
        ],
      },
      {
        title: "Technical Architecture",
        paragraphs: [
          "The core of WasteWise is a Retrieval-Augmented Generation (RAG) system built on FAISS for vector similarity search and OpenAI embeddings for semantic understanding. This allows the app to match user queries against a database of 20,000+ food and household items.",
          "A Neo4j graph database stores relationships between items, materials, and disposal methods, enabling complex queries like 'what else can be recycled with this item?' or 'what are alternatives to throwing this away?'",
        ],
      },
    ],
    timeline: [{ date: "Oct 2024" }],
    tools: [
      "FastAPI",
      "Python",
      "React Native",
      "FAISS",
      "Neo4j",
      "OpenAI API",
      "Docker",
    ],
    results: [
      "Built complete MVP in 36 hours",
      "20,000+ items in classification database",
      "Sub-100ms query response time with FAISS",
    ],
    takeaways: [
      "RAG systems provide accurate, contextual responses without fine-tuning",
      "Graph databases excel at representing complex relationships",
      "Hackathons are great for rapid prototyping and validation",
    ],
  },
  {
    slug: "retrowatch",
    name: "RetroWatch",
    title: "RetroWatch",
    tagline: "Watch content on a CRT with AI-generated era-relevant ads",
    period: "In Progress",
    year: 2025,
    technologies: [
      "Java",
      "Spring Boot",
      "React",
      "Vite",
      "Google Cloud",
      "Cloud Run",
      "Cloud Tasks",
    ],
    type: "personal",
    featured: true,
    description:
      "Stream content on a virtual CRT television with AI-generated era-appropriate advertisements for an authentic retro viewing experience.",
    cta: "View Project",
    heroImage: "/retrowatch.png",
    gridClassName: "col-span-3 lg:col-span-3",
    href: "https://full-stack-app-467902453710.us-west1.run.app/",
    demo: "https://full-stack-app-467902453710.us-west1.run.app/",
    links: [
      {
        label: "View Live Demo",
        href: "https://retrowatch.malhan.ca/",
        icon: "ExternalLink",
      },
      {
        label: "View on GitHub",
        href: "https://github.com/teddymalhan/RetroWatch",
        icon: "Github",
      },
      {
        label: "API Documentation",
        href: "https://retrowatch.malhan.ca/docs/",
        icon: "FileText",
      },
    ],
    features: [
      { text: "CRT television simulation", dotColor: "#4CAF50" },
      { text: "AI-generated era-relevant ads", dotColor: "#2196F3" },
      { text: "Authentic retro viewing experience", dotColor: "#FF9800" },
      { text: "Serverless cloud architecture", dotColor: "#9C27B0" },
    ],
    terminalSteps: [
      { text: "./mvnw spring-boot:run", type: "command" },
      { text: "Starting Spring Boot application...", type: "output", delay: 40 },
      { text: "Initializing Google Cloud Tasks...", type: "output", delay: 40 },
      { text: "Loading AI ad generator...", type: "output", delay: 40 },
      { text: "Server running on http://localhost:8080", type: "success", delay: 40 },
    ],
    terminalProgressMessage: "Generating retro advertisements...",
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "RetroWatch brings the nostalgic experience of watching television on a CRT to the modern web. The platform simulates the look and feel of vintage television, complete with AI-generated advertisements that match the era of the content being watched.",
          "Using generative AI, RetroWatch creates contextually appropriate ads that would have aired during the time period of your content, creating an immersive and authentic retro viewing experience.",
        ],
      },
      {
        title: "Technical Architecture",
        paragraphs: [
          "The backend is built with Java and Spring Boot, deployed on Google Cloud Run for serverless scalability. Google Cloud Tasks handles the asynchronous generation of AI advertisements.",
          "The frontend uses React with Vite for a fast, responsive CRT simulation complete with scan lines, color bleeding, and authentic analog artifacts.",
        ],
      },
    ],
    timeline: [{ date: "In Progress" }],
    tools: [
      "Java 21",
      "Spring Boot 3",
      "React 18",
      "Vite",
      "Google Cloud Run",
      "Google Cloud Tasks",
      "Generative AI",
    ],
    takeaways: [
      "Generative AI enables creative content generation at scale",
      "Serverless architecture provides cost-effective scalability",
      "Nostalgia-driven experiences create unique user engagement",
    ],
  },
  {
    slug: "kaeru",
    name: "Kaeru",
    title: "Kaeru",
    tagline: "Return, restore, and reclaim your finances with AI-powered automation",
    period: "2024",
    year: 2024,
    technologies: [
      "Next.js",
      "AWS Amplify",
      "TypeScript",
      "AI Agents",
      "Plaid API",
      "VAPI",
    ],
    type: "personal",
    featured: true,
    description:
      "An AI-powered financial operations platform that automates subscription cancellations, detects and disputes fraudulent transactions, and manages all financial operations from a single dashboard.",
    cta: "Learn More",
    heroImage: "/kaeru.png",
    gridClassName: "col-span-3 lg:col-span-2",
    href: "https://kaeru-fawn.vercel.app/",
    github: "https://github.com/teddymalhan/kaeru",
    demo: "https://kaeru-fawn.vercel.app/",
    links: [
      {
        label: "View Live Demo",
        href: "https://kaeru-fawn.vercel.app/",
        icon: "ExternalLink",
      },
      {
        label: "View on GitHub",
        href: "https://github.com/teddymalhan/kaeru",
        icon: "Github",
      },
    ],
    features: [
      { text: "AI Financial Operations automation", dotColor: "#4CAF50" },
      { text: "Real-time fraud detection with risk scoring", dotColor: "#FF9800" },
      { text: "Subscription management and cancellation", dotColor: "#2196F3" },
      { text: "AI phone call and email agents", dotColor: "#9C27B0" },
      { text: "Agent dashboard with live status monitoring", dotColor: "#00BCD4" },
      { text: "Complete activity audit trail", dotColor: "#E91E63" },
    ],
    terminalSteps: [
      { text: "npm run dev", type: "command" },
      { text: "Starting development server...", type: "output", delay: 40 },
      { text: "Initializing Plaid integration...", type: "output", delay: 40 },
      { text: "Loading AI agents...", type: "output", delay: 40 },
      { text: "Server running on http://localhost:3000", type: "success", delay: 40 },
    ],
    terminalProgressMessage: "Launching financial operations platform...",
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "Kaeru (帰る - to return, go back, or restore) is an AI-powered financial operations platform that automates the tedious tasks nobody wants to do: cancelling subscriptions, disputing fraudulent charges, and managing financial workflows. Built at StormHacks 2025.",
          "Built with Next.js and AWS, Kaeru leverages AI agents to handle phone calls and emails, real-time fraud detection to protect your money, and an intuitive dashboard to manage your financial life.",
        ],
      },
      {
        title: "Core Features",
        paragraphs: [
          "Smart Cancellations automate subscription cancellations across multiple providers with AI agents making calls and sending emails. Real-time Fraud Detection uses advanced AI to monitor transactions 24/7, automatically detecting and disputing suspicious charges.",
          "The Agent Dashboard provides live monitoring of AI agent status and workflow progress. Transaction Management gives you a comprehensive view of all financial activities with export capabilities, while Activity Tracking maintains a complete audit trail of all operations.",
        ],
      },
    ],
    timeline: [{ date: "Oct 2025" }],
    tools: [
      "Next.js 14",
      "TypeScript",
      "AWS Amplify",
      "Plaid API",
      "VAPI",
      "TailwindCSS",
      "AI Agents",
    ],
    results: [
      "Built for StormHacks 2025",
      "Automated cancellations across multiple providers",
      "Real-time fraud detection and dispute filing",
      "Complete financial operations dashboard",
    ],
    takeaways: [
      "AI agents can handle complex customer service workflows",
      "Real-time monitoring protects against financial fraud",
      "Automation significantly reduces financial management burden",
    ],
  },
  {
    slug: "gradgains",
    name: "GradGains",
    title: "GradGains",
    tagline: "Financial social platform for students",
    period: "2024",
    year: 2024,
    technologies: ["Drizzle ORM", "React", "Next.js"],
    type: "hackathon",
    featured: true,
    award: "Hackathon Winner",
    description:
      "A financial social media platform designed to help students manage their finances.",
    cta: "View Project",
    heroImage: "/grad-gains.png",
    gridClassName: "col-span-3 lg:col-span-1",
    href: "https://github.com/teddymalhan/grad-gains",
    github: "https://github.com/teddymalhan/grad-gains",
    demo: "#",
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/teddymalhan/grad-gains",
        icon: "Github",
      },
    ],
    features: [
      { text: "Social financial tracking", dotColor: "#4CAF50" },
      { text: "Peer spending comparisons", dotColor: "#2196F3" },
      { text: "Budget recommendations", dotColor: "#FF9800" },
      { text: "Achievement gamification", dotColor: "#9C27B0" },
    ],
    terminalSteps: [
      { text: "pnpm run dev", type: "command" },
      { text: "Running database migrations...", type: "output", delay: 40 },
      { text: "Seeding demo data...", type: "output", delay: 40 },
      { text: "Starting Next.js development server...", type: "output", delay: 40 },
      { text: "Ready on http://localhost:3000", type: "success", delay: 40 },
    ],
    terminalProgressMessage: "Building financial insights...",
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "GradGains is a financial social platform that helps students manage their money by combining personal finance tools with social features. Users can track expenses, set budgets, and see anonymized comparisons with peers in similar situations.",
          "The project won Hack-The-Sem 2024, recognized for its innovative approach to making financial literacy accessible and engaging for students.",
        ],
      },
      {
        title: "Social Finance",
        paragraphs: [
          "The key insight behind GradGains is that financial decisions are often influenced by social context. Students wonder if they're spending too much on food, rent, or entertainment compared to their peers.",
          "By providing anonymized, aggregate comparisons, GradGains helps users understand their spending in context without compromising privacy. Gamification elements like achievements and streaks encourage healthy financial habits.",
        ],
      },
    ],
    timeline: [{ date: "Jan 2024 - Apr 2024" }],
    tools: [
      "Next.js 14",
      "React",
      "Drizzle ORM",
      "PostgreSQL",
      "TailwindCSS",
      "NextAuth.js",
    ],
    results: [
      "Won Hack-The-Sem 2024 Hackathon",
      "Built complete MVP with auth, dashboard, and social features",
      "Demonstrated viable product-market fit with student testers",
    ],
    takeaways: [
      "Gamification can make 'boring' tasks engaging",
      "Privacy-first design enables sensitive data sharing",
      "Social context can motivate positive behavior change",
    ],
  },
];

// Helper functions
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getBentoProjects(): BentoProject[] {
  return projects.map(
    ({
      slug,
      name,
      title,
      period,
      description,
      cta,
      technologies,
      featured,
      award,
      type,
      heroImage,
      gridClassName,
    }) => ({
      slug,
      name,
      title,
      period,
      description,
      cta,
      technologies,
      featured,
      award,
      type,
      heroImage,
      gridClassName,
    })
  );
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
