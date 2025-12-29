export function AnimatedBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 h-screen"
      style={{
        background: `
          radial-gradient(ellipse 80% 80% at 20% 20%, rgba(34, 211, 238, 0.6) 0%, transparent 50%),
          radial-gradient(ellipse 80% 80% at 80% 70%, rgba(192, 132, 252, 0.6) 0%, transparent 50%),
          radial-gradient(ellipse 60% 60% at 50% 50%, rgba(129, 140, 248, 0.6) 0%, transparent 50%)
        `,
      }}
    />
  );
}
