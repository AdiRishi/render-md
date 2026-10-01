import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'

  return (
    <Tooltip label={`Switch to ${next} mode`}>
      <Button
        size="icon"
        aria-label={`Switch to ${next} mode`}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          setPreference(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        }}
      >
        {resolved === 'dark' ? <Moon /> : <Sun />}
      </Button>
    </Tooltip>
  )
}
