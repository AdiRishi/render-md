export function RenderError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-8 rounded-lg bg-[color-mix(in_oklch,var(--alert-caution)_9%,var(--paper))] px-4 py-3 text-[13px] leading-relaxed text-ink-2 shadow-[inset_3px_0_0_var(--alert-caution)] print:hidden"
    >
      <p className="mb-1 label-caps text-[color:var(--alert-caution)]">Couldn’t render this</p>
      The latest changes couldn’t be rendered{message ? ` (${message})` : ''}. Very deeply nested
      lists, quotes or HTML are the usual cause.
    </div>
  )
}
