export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-center">
        <span className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} RenderMD.
        </span>
      </div>
    </footer>
  )
}
