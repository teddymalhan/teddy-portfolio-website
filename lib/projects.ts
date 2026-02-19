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
  emoji?: string;
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
type BentoProject = Pick<
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
const projects: Project[] = [
  {
    slug: "digital-scorecards",
    name: "Digital Scorecards",
    title: "Digital Scorecards",
    tagline:
      "Real-time performance tracking that cut manual review time by 60% for 1000+ agents",
    period: "January 2025 - April 2025 (Internship)",
    year: 2024,
    technologies: ["Vue.js", "Django", "Python", "Google Cloud Platform"],
    type: "internship",
    description:
      "Built a performance tracking system at Dialpad that serves 1000+ contact center agents. Full-stack Vue.js and Django app deployed on GCP with 99.9% uptime.",
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
        emoji: "📋",
        paragraphs: [
          "Contact center managers at Dialpad needed a way to measure agent performance without spending hours manually reviewing calls. I built Digital Scorecards to automate this. Real-time performance tracking with customizable scoring criteria.",
          "I designed and built the full-stack solution as a Software Engineering Intern. From architecting the scoring system to shipping to production. The feature now serves 1000+ agents and reduced manual review time by 60%.",
        ],
      },
      {
        title: "The Problem",
        emoji: "📚",
        paragraphs: [
          "Traditional performance reviews in contact centers were broken. Managers spent hours listening to call recordings and filling out subjective evaluation forms. Agents received delayed, inconsistent feedback. At scale, this couldn't work.",
          "Dialpad needed an automated system that could score interactions based on configurable criteria. Give managers instant insights and give agents clear feedback on their performance.",
        ],
      },
      {
        title: "Technical Implementation",
        emoji: "⚙️",
        paragraphs: [
          "Built the frontend with Vue.js. Real-time dashboard updated via WebSocket connections. Managers can define custom evaluation criteria with weighted scoring, drill down into individual agent performance or view team-level trends.",
          "The Django backend handles score calculation, aggregation, and automated report generation. Deployed on Google Cloud Platform with PostgreSQL and Memcached. The system handles high query volumes with sub-200ms response times and 99.9% uptime.",
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
    slug: "retrowatch",
    name: "RetroWatch",
    title: "RetroWatch",
    tagline: "Watch content on a CRT with AI-generated era-relevant ads",
    period: "December 2025 - January 2026",
    year: 2025,
    technologies: [
      "Java",
      "Spring Boot",
      "React",
      "Vite",
      "Google Cloud",
    ],
    type: "personal",
    description:
      "Streaming platform that simulates watching TV on a vintage CRT. Complete with scan lines, color bleeding, and AI-generated period-appropriate ads. Built with Spring Boot and React, deployed serverless on Google Cloud.",
    cta: "View Project",
    heroImage: "/retrowatch.png",
    gridClassName: "col-span-3 lg:col-span-1",
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
        emoji: "📺",
        paragraphs: [
          "Remember watching Saturday morning cartoons on a chunky CRT TV? RetroWatch recreates that experience for the modern web. Vintage television aesthetics with generative AI creating period-accurate advertisements.",
          "Watch your favorite content with authentic CRT effects. Scan lines, color bleeding, screen curvature, and analog artifacts. The AI analyzes your content and generates ads that would've actually aired during that era.",
        ],
      },
      {
        title: "Technical Architecture",
        emoji: "🏗️",
        paragraphs: [
          "Backend runs on Java and Spring Boot, deployed to Google Cloud Run for serverless auto-scaling. Google Cloud Tasks handles asynchronous ad generation. It processes video content through generative AI to create vintage advertisements that match the era.",
          "Frontend built with React and Vite delivers smooth 60fps CRT simulation. CSS shaders and filters recreate authentic analog TV artifacts. Phosphor glow, chromatic aberration, and frame persistence. All while maintaining responsive performance across devices.",
        ],
      },
    ],
    timeline: [{ date: "December 2025 - January 2026" }],
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
    slug: "argus",
    name: "Argus",
    title: "Argus",
    tagline: "Version control for quantitative research experiments. Git, but for models and datasets",
    period: "nwHacks 2026 Winner",
    year: 2026,
    technologies: [
      "Rust",
      "Python",
      "Textual",
      "Gemini AI",
      "Vultr",
    ],
    type: "hackathon",
    featured: true,
    description:
      "Won nwHacks 2026 building a version control system for quant researchers. Track model runs, datasets, and performance metrics (IC, Rank IC, t-stats) with hash-based versioning. Built with Rust and Python TUI.",
    cta: "View Project",
    heroImage: "/argus.png",
    gridClassName: "col-span-3 lg:col-span-3",
    href: "https://github.com/teddymalhan/argus",
    github: "https://github.com/teddymalhan/argus",
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/teddymalhan/argus",
        icon: "Github",
      },
    ],
    features: [
      { text: "Secure hash-based versioning", dotColor: "#14F195" },
      { text: "IC, Rank IC & t-stat tracking", dotColor: "#9945FF" },
      { text: "Gemini AI run summaries", dotColor: "#4285F4" },
      { text: "Terminal UI with Textual", dotColor: "#FF9800" },
      { text: "Vultr cloud storage integration", dotColor: "#00BCD4" },
    ],
    terminalSteps: [
      { text: "argus init", type: "command" },
      { text: "Initializing Argus project...", type: "output", delay: 40 },
      { text: "Setting up local database...", type: "output", delay: 40 },
      { text: "Argus initialized", type: "success", delay: 40 },
      { text: "argus commit --model rf_v2 --dataset signals_q4", type: "command" },
      { text: "Hashing artifacts...", type: "output", delay: 40 },
      { text: "Recording IC: 0.042, Rank IC: 0.038, t-stat: 2.31", type: "output", delay: 40 },
      { text: "Run committed: hash_8x7f...", type: "success", delay: 40 },
    ],
    terminalProgressMessage: "Committing run to Argus...",
    sections: [
      {
        title: "The Problem",
        emoji: "💡",
        paragraphs: [
          "After attending a Connor, Clark & Lunn Investment Management panel, we learned that quant researchers run hundreds of model iterations across different datasets to validate trading signals. Each run generates critical metrics (Information Coefficient, Rank IC, t-statistics) that need to be tracked and compared.",
          "Git doesn't work for this workflow. It tracks code changes, but not the actual models, datasets, or performance metrics. Researchers were juggling spreadsheets, notebooks, and manual documentation just to remember which model and dataset combination produced which IC scores. There was no bird's-eye view of experiments.",
        ],
      },
      {
        title: "The Solution",
        emoji: "🎯",
        paragraphs: [
          "Argus brings Git-style version control to quantitative research. Every model run gets a unique hash, storing the exact model, dataset, and performance metrics (IC, Rank IC, t-stat) in an immutable record. Query past experiments, compare results, and replay any run deterministically.",
          "Think git commit but for your trading models. Argus integrates directly into research workflows via a terminal UI. Makes experiment tracking as natural as version controlling code.",
        ],
      },
      {
        title: "Technical Architecture",
        emoji: "🏗️",
        paragraphs: [
          "Core hashing and versioning engine written in Rust for performance and immutability guarantees. Python middleware connects Rust to the Textual-based terminal UI. Provides a native command-line experience that fits into existing workflows.",
          "Gemini AI automatically generates summaries of model runs, extracting insights from metrics. SQLite provides fast local storage while Vultr handles long-term cloud backup of models and datasets. This enables collaboration and remote experiment access.",
        ],
      },
      {
        title: "Winning nwHacks",
        emoji: "🏆",
        paragraphs: [
          "Built the entire system in 36 hours. From learning quantitative finance concepts to shipping a working terminal UI. The biggest technical challenge was integrating Rust with Python while maintaining a smooth command-line interface.",
          "Judges recognized Argus for solving a real problem in quantitative finance with technical depth. The hash-based versioning system provides immutable audit trails, which is critical for reproducible research in financial modeling.",
        ],
      },
      {
        title: "What's Next",
        emoji: "🚀",
        paragraphs: [
          "Native Jupyter Notebook integration is next. Most quant researchers live in notebooks, so we're building a seamless plugin that lets them commit runs without leaving their research environment.",
        ],
      },
    ],
    timeline: [{ date: "January 2026" }],
    tools: [
      "Rust",
      "Python",
      "Textual",
      "Gemini AI",
      "SQLite",
      "Vultr",
    ],
    results: [
      "Built complete hash-based versioning system for quant workflows",
      "Rust core with Python/Textual TUI integration",
      "Terminal UI for seamless workflow integration",
    ],
    takeaways: [
      "Hash-based versioning provides immutable audit trails for experiments",
      "Terminal UIs can provide powerful developer experiences",
      "Quantitative research requires specialized tooling beyond traditional version control",
    ],
  },
  {
    slug: "kaeru",
    name: "Kaeru",
    title: "Kaeru",
    tagline: "AI agents that cancel subscriptions and dispute fraud charges so you don't have to",
    period: "SFU Surge StormHacks 2025",
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
      "Financial operations platform with AI agents that make phone calls and send emails to cancel subscriptions. Real-time fraud detection monitors transactions 24/7 and automatically files disputes. Built at StormHacks 2025.",
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
        emoji: "📋",
        paragraphs: [
          "Ever spent an hour on hold trying to cancel a gym membership? Or discovered a fraudulent charge and dreaded the dispute process? Kaeru automates these painful financial tasks using AI agents that make calls and send emails on your behalf.",
          "Built at StormHacks 2025 with Next.js and AWS. Kaeru connects to your bank accounts via Plaid, monitors transactions in real-time for fraud, and dispatches AI agents to handle cancellations and disputes. No more dealing with customer service hell.",
        ],
      },
      {
        title: "How It Works",
        emoji: "✨",
        paragraphs: [
          "Smart Cancellations: Select a subscription to cancel, and Kaeru's AI agents automatically call the company, navigate phone trees, speak to representatives, and handle the cancellation. You get notified when it's done. No hold music, no scripted retention offers.",
          "Real-Time Fraud Detection: Kaeru monitors all transactions 24/7 using AI risk scoring. Suspicious charges trigger automatic alerts. With your approval, AI agents file disputes with your bank. Complete with documentation and follow-up calls if needed.",
        ],
      },
    ],
    timeline: [{ date: "October 2025" }],
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
    tagline: "Am I spending too much on food? Financial social platform with peer comparisons",
    period: "Google DSC Hack-The-Sem Winner (January 2024 - April 2024)",
    year: 2024,
    technologies: ["Drizzle ORM", "React", "Next.js"],
    type: "hackathon",
    featured: true,
    description:
      "Won Hack-The-Sem 2024 building a financial platform for students. Track spending, set budgets, and see how your expenses compare to peers (anonymized). Gamification makes budgeting engaging.",
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
        emoji: "📋",
        paragraphs: [
          "Students constantly wonder: Am I spending too much on food? Is my rent reasonable? Are my entertainment expenses out of control? GradGains answers these questions by combining personal finance tracking with anonymized peer comparisons.",
          "Won Hack-The-Sem 2024 for making financial literacy engaging. Track expenses, set budgets, and see how you compare to students in similar situations. Gamification (achievements, streaks, challenges) makes budgeting fun.",
        ],
      },
      {
        title: "Why Social Context Matters",
        emoji: "👥",
        paragraphs: [
          "Financial decisions are heavily influenced by social context. A student spending $400/month on food might feel anxious about it. But if their peers with similar meal plans spend $450, suddenly that number makes sense.",
          "GradGains provides anonymized comparisons by category (food, rent, entertainment, etc.). This helps students understand their spending without compromising anyone's privacy. No judgment, just context. Gamification elements (achievements for hitting savings goals, streaks for tracking expenses) make personal finance engaging.",
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

