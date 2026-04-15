const SectionDivider = ({ label }: { label?: string }) => (
  <div className="container">
    <div className="flex items-center gap-6 py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      {label && (
        <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/15 shrink-0">{label}</span>
      )}
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/30 to-transparent" />
    </div>
  </div>
);

export default SectionDivider;
