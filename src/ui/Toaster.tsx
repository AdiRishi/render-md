import { Toaster as Sonner } from 'sonner'

/** App-wide toasts, styled as ink slips at the bottom of the page. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      offset={44}
      toastOptions={{
        classNames: {
          toast:
            '!rounded-xl !border-0 !bg-ink !text-paper !shadow-float !font-sans !text-[13px] !gap-2.5 !py-3 !px-4',
          description: '!text-paper/70 !text-[12px]',
          actionButton: '!bg-paper !text-ink !rounded-md !font-medium !text-[12px] !h-7 !px-2.5',
          icon: '!text-proof',
        },
      }}
    />
  )
}
