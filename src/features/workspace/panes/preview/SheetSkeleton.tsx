export function SheetSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Rendering…">
      <div className="h-10 w-2/3 rounded bg-paper-3" />
      <div className="h-4 w-full rounded bg-paper-3/70" />
      <div className="h-4 w-11/12 rounded bg-paper-3/70" />
      <div className="h-4 w-4/5 rounded bg-paper-3/70" />
      <div className="mt-8 h-48 w-full rounded-lg bg-paper-3/60" />
    </div>
  )
}
