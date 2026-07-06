export default function Skeleton({
  className = "",
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-ink/10 dark:bg-paper/10 ${className}`}
    />
  );
}