import { useEffect } from 'react'
import { flushSync } from 'react-dom'

import { useUiStore } from '../state/ui-store'

/**
 * The print in progress, if any. Printing from the browser's own menu starts a
 * job too, synchronously, so the print sheet is in the page before the
 * browser lays it out. Either kind ends when the print dialog closes.
 */
export function usePrintJob() {
  const job = useUiStore((state) => state.printJob)

  useEffect(() => {
    const onBeforePrint = () => {
      const { printJob, startPrint } = useUiStore.getState()
      if (!printJob) flushSync(() => startPrint('browser'))
    }
    const onAfterPrint = () => useUiStore.getState().endPrint()
    window.addEventListener('beforeprint', onBeforePrint)
    window.addEventListener('afterprint', onAfterPrint)
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint)
      window.removeEventListener('afterprint', onAfterPrint)
    }
  }, [])

  return job
}
