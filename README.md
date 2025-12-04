# Portfolio Website

A modern, responsive personal portfolio website built with Next.js 16, React 19, and Tailwind CSS. Features stunning animations, interactive UI components, and a beautiful design system powered by Radix UI and Framer Motion.

![Portfolio Preview](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🎨 **Modern Design** - Clean, professional interface with smooth animations
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🌗 **Dark/Light Mode** - Theme switching with `next-themes`
- ⚡ **High Performance** - Built on Next.js 16 with App Router and Turbopack
- 🎭 **Rich Animations** - Powered by Framer Motion and GSAP
- 🎯 **Type-Safe** - Full TypeScript support
- 📝 **Form Validation** - Contact forms with `react-hook-form` and Zod
- 🎨 **Shadcn/ui Components** - Beautiful, accessible UI components
- 📊 **Analytics Ready** - Integrated with Vercel Analytics
- 🎉 **Interactive Elements** - Animated backgrounds, floating shapes, and tech mascots

## 🚀 Tech Stack

### Core

- **Framework:** [Next.js 16](https://nextjs.org/) - React framework with App Router and Turbopack
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework

### UI Components & Animations

- **UI Library:** [Radix UI](https://www.radix-ui.com/) - Headless UI components
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & [Font Awesome](https://fontawesome.com/)
- **Component Variants:** [Class Variance Authority](https://cva.style/)

### Forms & Validation

- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Resolvers:** [@hookform/resolvers](https://github.com/react-hook-form/resolvers)

### Additional Libraries

- **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Confetti Effects:** [react-canvas-confetti](https://github.com/ulrichstark/react-canvas-confetti)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or later ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm
  ```bash
  # Install pnpm globally
  npm install -g pnpm
  ```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/teddymalhan/teddy-portfolio-rebuild.git
   cd teddy-portfolio-rebuild
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables** (if needed)
   ```bash
   cp .env.example .env.local
   ```
   Add any required environment variables for contact forms, analytics, etc.

## 🚀 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

Build the application for production:

```bash
pnpm build
# or
npm run build
```

### Start Production Server

Run the production build locally:

```bash
pnpm start
# or
npm run start
```

### Linting

Check code quality with ESLint:

```bash
pnpm lint
# or
npm run lint
```

## 📁 Project Structure

```
teddy-portfolio-rebuild/
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── about.tsx            # About section
│   ├── animated-background.tsx
│   ├── contact.tsx          # Contact form
│   ├── experience.tsx       # Experience timeline
│   ├── floating-elements.tsx
│   ├── floating-shapes.tsx
│   ├── hero.tsx             # Hero section
│   ├── navigation.tsx       # Navigation bar
│   ├── projects-bento.tsx   # Projects bento grid
│   ├── projects.tsx         # Projects section
│   ├── tech-mascots.tsx     # Animated tech icons
│   ├── fancy/               # Advanced components
│   │   └── text/
│   └── ui/                  # Shadcn/ui components
├── lib/                     # Utility functions
│   └── utils.ts
├── public/                  # Static assets
│   ├── *.jpg, *.png        # Project images
│   └── Teddy_Malhan_Resume.pdf
├── styles/                  # Additional styles
└── package.json            # Dependencies
```

## 🎨 Customization

### Personal Information

Update the content in the following components:

- `components/hero.tsx` - Your name, title, and introduction
- `components/about.tsx` - About me section
- `components/experience.tsx` - Work experience
- `components/projects-bento.tsx` - Portfolio projects
- `components/contact.tsx` - Contact information

### Theme & Colors

Customize the design system in:

- `app/globals.css` - CSS variables and global styles
- `tailwind.config.js` - Tailwind configuration (if exists)
- `components/theme-provider.tsx` - Theme settings

### Add New Components

Place new components in the `components/` directory and import them in `app/page.tsx`.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy your Next.js app:

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
pnpm build
netlify deploy --prod
```

### Deploy to GitHub Pages

Update `next.config.mjs` for static export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## 📝 Available Scripts

| Command      | Description                                |
| ------------ | ------------------------------------------ |
| `pnpm dev`   | Start development server at localhost:3000 |
| `pnpm build` | Create optimized production build          |
| `pnpm start` | Start production server                    |
| `pnpm lint`  | Run ESLint for code quality checks         |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/teddymalhan/v0-portfolio-rebuild/issues).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Teddy Malhan**

- GitHub: [@teddymalhan](https://github.com/teddymalhan)
- Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

⭐ Star this repo if you find it helpful!
