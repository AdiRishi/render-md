import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('RenderMD crashed:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="grid min-h-screen place-items-center bg-desk p-6 text-ink">
        <div className="max-w-md">
          <p className="label-caps text-proof">Erratum</p>
          <h1 className="mt-3 font-display text-5xl leading-none">Something went wrong.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            Your document is safe — it’s stored in this browser. Reloading usually fixes this.
          </p>
          <pre className="mt-5 max-h-40 overflow-auto rounded-lg bg-paper-2 p-3 font-mono text-xs text-ink-2">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 h-10 rounded-lg bg-ink px-4 text-sm font-medium text-paper"
          >
            Reload RenderMD
          </button>
        </div>
      </div>
    )
  }
}
