export default function LiquidGlassCard({ title, children }) {
  return (
    <div className="relative">
      <div className="absolute -inset-1 hidden rounded-3xl bg-linear-to-r from-primary/40 via-accent/40 to-primary/20 opacity-70 blur-xl animate-liquid dark:block" />

      <div className="relative rounded-3xl border border-border/60 bg-background/40 p-6 shadow-xl backdrop-blur-xl">
        {title && (
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h3>
        )}
        <div className="text-foreground">{children}</div>
      </div>
    </div>
  );
}
