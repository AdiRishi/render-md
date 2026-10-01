import { Moon, Sun } from 'lucide-react'

import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Switch to ${next} mode`}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              setPreference(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
            }}
          />
        }
      >
        {resolved === 'dark' ? <Moon /> : <Sun />}
      </TooltipTrigger>
      <TooltipContent side="bottom">Switch to {next} mode</TooltipContent>
    </Tooltip>
  )
}
