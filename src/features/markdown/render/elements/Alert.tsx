import { CircleAlert, Info, Lightbulb, MessageSquareWarning, OctagonAlert } from 'lucide-react'
import { type ReactNode } from 'react'

import { type AlertType } from '../../engine/plugins/alerts'
import { type ElementProps } from './element-props'

const ALERTS: Record<AlertType, { label: string; icon: ReactNode }> = {
  note: { label: 'Note', icon: <Info /> },
  tip: { label: 'Tip', icon: <Lightbulb /> },
  important: { label: 'Important', icon: <MessageSquareWarning /> },
  warning: { label: 'Warning', icon: <CircleAlert /> },
  caution: { label: 'Caution', icon: <OctagonAlert /> },
}

/** Renders `<div>`s: those marked `data-alert` by the alerts plugin become titled callouts. */
export function Alert({ node: _node, children, ...props }: ElementProps<'div'>) {
  const type = (props as Record<string, unknown>)['data-alert']
  const alert = typeof type === 'string' ? ALERTS[type as AlertType] : undefined
  if (!alert) return <div {...props}>{children}</div>

  return (
    <div {...props} role="note">
      <p className="markdown-alert-title">
        {alert.icon}
        {alert.label}
      </p>
      {children}
    </div>
  )
}
