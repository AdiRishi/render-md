import { type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

interface CheatsheetSectionProps {
  id: string
  icon: ReactNode
  iconBgClass: string
  iconColorClass: string
  title: string
  description: string
  syntaxContent: ReactNode
  renderedContent: ReactNode
  defaultOpen?: boolean
}

export function CheatsheetSection({
  id,
  icon,
  iconBgClass,
  iconColorClass,
  title,
  description,
  syntaxContent,
  renderedContent,
  defaultOpen = false,
}: CheatsheetSectionProps) {
  return (
    <Accordion defaultValue={defaultOpen ? [id] : []} className="w-full">
      <AccordionItem
        value={id}
        className="scroll-mt-24 group/section rounded-xl border border-border bg-card shadow-sm transition-all duration-200 data-[open]:ring-2 data-[open]:ring-primary/20"
      >
        <AccordionTrigger className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 select-none hover:bg-muted/50 rounded-xl transition-colors w-full [&>svg]:hidden">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'size-10 rounded-full flex items-center justify-center',
                iconBgClass,
                iconColorClass,
              )}
            >
              {icon}
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-base font-bold">{title}</h3>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>
          </div>
          <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-data-[open]/section:rotate-180 group-data-[open]/section:text-primary" />
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 bg-muted border-b border-border">
              <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Markdown Syntax
              </div>
              <div className="hidden md:block px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-l border-border">
                Rendered Output
              </div>
            </div>

            {/* Syntax column */}
            <div className="bg-card p-4 font-mono text-sm">{syntaxContent}</div>

            {/* Rendered column */}
            <div className="bg-card p-4 border-t md:border-t-0 md:border-l border-border">
              <div className="md:hidden text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Rendered Output
              </div>
              {renderedContent}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
