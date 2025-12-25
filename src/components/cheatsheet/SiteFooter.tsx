import { Code, Mail } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>&copy; {new Date().getFullYear()} RenderMD.</span>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy
          </a>
          <span>&bull;</span>
          <a href="#" className="hover:text-primary transition-colors">
            Terms
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="mailto:contact@render-md.com"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Email"
          >
            <Mail className="size-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Code className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
