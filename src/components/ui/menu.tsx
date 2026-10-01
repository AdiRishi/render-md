import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { Check, ChevronRight } from 'lucide-react'
import { type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const Menu = MenuPrimitive.Root
export const MenuTrigger = MenuPrimitive.Trigger
export const MenuGroup = MenuPrimitive.Group
export const MenuRadioGroup = MenuPrimitive.RadioGroup
export const MenuSubmenu = MenuPrimitive.SubmenuRoot

const popupClass =
  'min-w-56 origin-(--transform-origin) rounded-xl bg-paper p-1.5 text-ink shadow-float outline-none transition-[opacity,scale] duration-150 data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0'

export function MenuContent({
  className,
  align = 'end',
  side = 'bottom',
  sideOffset = 6,
  children,
}: {
  className?: string
  align?: MenuPrimitive.Positioner.Props['align']
  side?: MenuPrimitive.Positioner.Props['side']
  sideOffset?: number
  children: ReactNode
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner align={align} side={side} sideOffset={sideOffset} className="z-50">
        <MenuPrimitive.Popup className={cn(popupClass, className)}>{children}</MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

const itemClass =
  'group/item flex h-8 cursor-default items-center gap-2.5 rounded-md px-2 text-[13px] outline-none select-none data-[disabled]:opacity-40 data-[highlighted]:bg-desk-2 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-3 data-[highlighted]:[&_svg]:text-ink'

export function MenuItem({
  className,
  hint,
  children,
  ...props
}: MenuPrimitive.Item.Props & { hint?: ReactNode }) {
  return (
    <MenuPrimitive.Item className={cn(itemClass, className)} {...props}>
      {children}
      {hint ? <span className="ms-auto ps-4 font-mono text-[11px] text-ink-3">{hint}</span> : null}
    </MenuPrimitive.Item>
  )
}

export function MenuRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem className={cn(itemClass, 'pe-8', className)} {...props}>
      {children}
      <MenuPrimitive.RadioItemIndicator className="ms-auto -me-6">
        <Check className="text-proof!" />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  )
}

export function MenuSubmenuTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      className={cn(itemClass, 'data-[popup-open]:bg-desk-2', className)}
      {...props}
    >
      {children}
      <ChevronRight className="ms-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

export function MenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      className={cn('px-2 pt-2 pb-1.5 label-caps text-ink-3', className)}
      {...props}
    />
  )
}

export function MenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator className={cn('mx-1 my-1.5 h-px bg-rule', className)} {...props} />
  )
}
