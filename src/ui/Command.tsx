import { Command as CommandPrimitive } from 'cmdk'
import { type ReactNode } from 'react'

/**
 * Styled cmdk primitives for the command palette. The palette itself (which
 * commands exist) lives with the feature that owns them.
 */

export const Command = CommandPrimitive

export function CommandInput(props: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <CommandPrimitive.Input
      className="h-13 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-4"
      {...props}
    />
  )
}

export function CommandList({ children }: { children: ReactNode }) {
  return (
    <CommandPrimitive.List className="min-h-0 flex-1 scrollbar-quiet overflow-y-auto py-1">
      {children}
    </CommandPrimitive.List>
  )
}

export function CommandEmpty({ children }: { children: ReactNode }) {
  return (
    <CommandPrimitive.Empty className="px-4 py-10 text-center text-sm text-ink-3">
      {children}
    </CommandPrimitive.Empty>
  )
}

export function CommandGroup({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <CommandPrimitive.Group
      heading={heading}
      className="px-1.5 pb-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:label-caps [&_[cmdk-group-heading]]:text-ink-3"
    >
      {children}
    </CommandPrimitive.Group>
  )
}

export function CommandItem({
  icon,
  children,
  hint,
  onSelect,
  keywords,
}: {
  icon: ReactNode
  children: ReactNode
  hint?: ReactNode
  onSelect: () => void
  keywords?: string[]
}) {
  return (
    <CommandPrimitive.Item
      onSelect={onSelect}
      keywords={keywords}
      className="flex h-9 cursor-default items-center gap-3 rounded-lg px-2.5 text-[13.5px] text-ink-2 select-none data-[selected=true]:bg-desk-2 data-[selected=true]:text-ink [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-3"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint ? <span className="font-mono text-[11px] text-ink-3">{hint}</span> : null}
    </CommandPrimitive.Item>
  )
}
