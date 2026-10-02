export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      lang="ja"
      aria-label="Timotius Theodearson"
      className={`font-heading text-xl font-semibold tracking-[0.25em] text-washi ${className}`}
    >
      提摩太
    </span>
  );
}