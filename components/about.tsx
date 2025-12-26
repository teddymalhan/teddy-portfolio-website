import Image from "next/image";
import Link from "next/link";

export function About() {
  return (
    <section id="about" className="pt-24 pb-24">
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Ambient glow (no card) */}
        <div className="pointer-events-none absolute -inset-x-12 -top-8 -bottom-8 opacity-60">
          <div className="mx-auto h-full max-w-3xl rounded-[28px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-2xl" />
        </div>

        <div className="relative z-10 text-center">
          {/* Avatar with gradient ring */}
          <div
            className="mx-auto mb-8 size-36 rounded-full p-[2px] md:mb-10 md:size-44"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--muted-foreground)) 100%)",
            }}
          >
            <div className="size-full overflow-hidden rounded-full bg-background ring-1 ring-border">
              <Image
                src="/ted-aboutme.jpg"
                alt="Portrait of Ted"
                width={176}
                height={176}
                className="size-full object-cover object-[center_top]"
                style={{ objectPosition: '50% 30%' }}
                priority
                sizes="(max-width: 768px) 144px, 176px"
              />
            </div>
          </div>

          {/* Highlighted heading */}
          <div className="mx-auto mb-6 max-w-prose md:mb-8">
            <h2 className="font-semibold tracking-tight text-2xl text-foreground md:text-3xl">
              Hi, I&apos;m Teddy and I build thoughtful software.
            </h2>
          </div>

          {/* Copy */}
          <div className="mx-auto max-w-prose space-y-5 text-left text-muted-foreground leading-relaxed md:space-y-6">
            <p className="text-foreground">
              I&apos;m a Computer Science student and software engineer focused
              on backend and system engineering, with an emphasis on developer tooling, 
              infrastructure-adjacent services, and data-driven applications.
            </p>
            <p>
              I care about shipping fast without sacrificing polish. From 
              system design and APIs to reliability and performance, I enjoy 
              building software that scales cleanly and feels intentional 
              to both users and developers.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll find me on a tennis court,
              at the gym, or studying well-designed systems and developer experiences. If you&apos;re building
              something interesting, I&apos;d love to chat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
