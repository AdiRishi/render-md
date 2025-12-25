import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Bold,
  Code,
  Download,
  GraduationCap,
  Heading1,
  Link as LinkIcon,
  List,
  Minus,
  PenSquare,
  Quote,
  Sigma,
  Table,
} from 'lucide-react'

import { SiteHeader } from '@/components/cheatsheet/SiteHeader'
import { SiteFooter } from '@/components/cheatsheet/SiteFooter'
import { CheatsheetSection } from '@/components/cheatsheet/CheatsheetSection'
import { Button } from '@/components/ui/button'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/cheatsheet')({
  head: () => ({
    meta: [
      ...seo({
        title: 'Markdown Cheatsheet - Complete Syntax Reference | RenderMD',
        description:
          'The ultimate markdown cheatsheet with syntax examples and live previews. Learn headers, emphasis, lists, links, images, code blocks, tables, LaTeX math, and more.',
        keywords:
          'markdown cheatsheet, markdown syntax, markdown guide, markdown reference, GFM, GitHub Flavored Markdown, markdown tutorial, markdown examples, LaTeX markdown, code blocks markdown',
        url: 'https://www.render-md.com/cheatsheet',
      }),
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://www.render-md.com/cheatsheet',
      },
    ],
  }),
  component: CheatsheetPage,
})

function CheatsheetPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/30">
      <SiteHeader />

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Hero Section */}
            <div className="flex flex-col gap-6 py-8 md:py-12">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase bg-primary/10 px-3 py-1.5 rounded-full w-fit">
                <GraduationCap className="size-4" />
                Documentation
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight max-w-4xl">
                The Ultimate{' '}
                <span className="text-primary relative inline-block">
                  Markdown
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded-sm" />
                </span>{' '}
                Cheatsheet
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
                Your go-to reference for styling text on the web. Browse the syntax below, copy
                examples, and instantly preview your formatting.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Button
                  render={<Link to="/" />}
                  nativeButton={false}
                  size="lg"
                  className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20"
                >
                  <PenSquare className="size-5" />
                  Try the Editor
                </Button>
                <Button
                  render={<a href="#" />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 rounded-xl"
                >
                  <Download className="size-5" />
                  PDF Guide
                </Button>
              </div>
            </div>

            {/* Cheatsheet Sections */}
            <div className="flex flex-col gap-4">
              {/* Headers */}
              <CheatsheetSection
                id="headers"
                icon={<Heading1 className="size-5" />}
                iconBgClass="bg-blue-50 dark:bg-blue-900/20"
                iconColorClass="text-blue-600 dark:text-blue-400"
                title="Headers"
                description="H1 through H6 titles"
                defaultOpen
                syntaxContent={
                  <div className="flex flex-col gap-1">
                    <p>
                      <span className="text-primary">#</span> Heading 1
                    </p>
                    <p>
                      <span className="text-primary">##</span> Heading 2
                    </p>
                    <p>
                      <span className="text-primary">###</span> Heading 3
                    </p>
                    <p>
                      <span className="text-primary">####</span> Heading 4
                    </p>
                    <p>
                      <span className="text-primary">#####</span> Heading 5
                    </p>
                    <p>
                      <span className="text-primary">######</span> Heading 6
                    </p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold border-b pb-1 border-border">Heading 1</h1>
                    <h2 className="text-xl font-bold border-b pb-1 border-border">Heading 2</h2>
                    <h3 className="text-lg font-bold">Heading 3</h3>
                    <h4 className="text-base font-bold">Heading 4</h4>
                    <h5 className="text-sm font-bold">Heading 5</h5>
                    <h6 className="text-xs font-bold">Heading 6</h6>
                  </div>
                }
              />

              {/* Emphasis */}
              <CheatsheetSection
                id="emphasis"
                icon={<Bold className="size-5" />}
                iconBgClass="bg-purple-50 dark:bg-purple-900/20"
                iconColorClass="text-purple-600 dark:text-purple-400"
                title="Emphasis"
                description="Bold, Italic, Strikethrough"
                syntaxContent={
                  <div className="flex flex-col gap-2">
                    <p>**Bold text**</p>
                    <p>*Italic text*</p>
                    <p>***Bold and italic***</p>
                    <p>~~Strikethrough~~</p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-2">
                    <p>
                      <strong>Bold text</strong>
                    </p>
                    <p>
                      <em>Italic text</em>
                    </p>
                    <p>
                      <strong>
                        <em>Bold and italic</em>
                      </strong>
                    </p>
                    <p>
                      <del className="text-muted-foreground">Strikethrough</del>
                    </p>
                  </div>
                }
              />

              {/* Lists */}
              <CheatsheetSection
                id="lists"
                icon={<List className="size-5" />}
                iconBgClass="bg-green-50 dark:bg-green-900/20"
                iconColorClass="text-green-600 dark:text-green-400"
                title="Lists"
                description="Ordered, Unordered, Tasks"
                syntaxContent={
                  <div className="flex flex-col gap-1">
                    <p>1. First item</p>
                    <p>2. Second item</p>
                    <p>3. Third item</p>
                    <br />
                    <p>- Bullet item</p>
                    <p>- Another bullet</p>
                    <p>&nbsp;&nbsp;- Nested item</p>
                    <br />
                    <p>- [x] Completed task</p>
                    <p>- [ ] Todo task</p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-4 text-sm">
                    <ol className="list-decimal list-inside pl-1 space-y-1">
                      <li>First item</li>
                      <li>Second item</li>
                      <li>Third item</li>
                    </ol>
                    <ul className="list-disc list-inside pl-1 space-y-1">
                      <li>Bullet item</li>
                      <li>
                        Another bullet
                        <ul className="list-disc list-inside pl-4 mt-1">
                          <li>Nested item</li>
                        </ul>
                      </li>
                    </ul>
                    <ul className="list-none pl-0 space-y-1">
                      <li className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="rounded text-primary size-4"
                        />
                        <span>Completed task</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" readOnly className="rounded text-primary size-4" />
                        <span>Todo task</span>
                      </li>
                    </ul>
                  </div>
                }
              />

              {/* Links & Images */}
              <CheatsheetSection
                id="links"
                icon={<LinkIcon className="size-5" />}
                iconBgClass="bg-orange-50 dark:bg-orange-900/20"
                iconColorClass="text-orange-600 dark:text-orange-400"
                title="Links & Images"
                description="Hyperlinks and image embedding"
                syntaxContent={
                  <div className="flex flex-col gap-2">
                    <p>[Link Text](https://example.com)</p>
                    <p>[Link with title](https://example.com &quot;Title&quot;)</p>
                    <br />
                    <p>![Alt text](image.jpg)</p>
                    <p>![Alt text](image.jpg &quot;Image title&quot;)</p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-4">
                    <div>
                      <a href="#" className="text-primary hover:underline font-medium">
                        Link Text
                      </a>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="text-primary hover:underline font-medium"
                        title="Title"
                      >
                        Link with title
                      </a>
                    </div>
                    <div className="h-20 w-full bg-muted rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-xs text-muted-foreground">
                      <LinkIcon className="size-4 mb-1" />
                      <span>Image Preview</span>
                    </div>
                  </div>
                }
              />

              {/* Code */}
              <CheatsheetSection
                id="code"
                icon={<Code className="size-5" />}
                iconBgClass="bg-slate-100 dark:bg-slate-700"
                iconColorClass="text-slate-600 dark:text-slate-300"
                title="Code"
                description="Inline code and code blocks"
                syntaxContent={
                  <div className="flex flex-col gap-2">
                    <p>`Inline code`</p>
                    <br />
                    <p>```javascript</p>
                    <p>const greeting = &quot;Hello&quot;;</p>
                    <p>console.log(greeting);</p>
                    <p>```</p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-4 text-sm">
                    <p>
                      This is{' '}
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border">
                        Inline code
                      </code>{' '}
                      example.
                    </p>
                    <div className="bg-[#282c34] text-[#abb2bf] p-3 rounded-lg font-mono text-xs overflow-x-auto shadow-inner">
                      <span className="text-[#c678dd]">const</span>{' '}
                      <span className="text-[#e06c75]">greeting</span>{' '}
                      <span className="text-[#56b6c2]">=</span>{' '}
                      <span className="text-[#98c379]">&quot;Hello&quot;</span>;
                      <br />
                      <span className="text-[#61afef]">console</span>.
                      <span className="text-[#e5c07b]">log</span>(
                      <span className="text-[#e06c75]">greeting</span>);
                    </div>
                  </div>
                }
              />

              {/* Blockquotes */}
              <CheatsheetSection
                id="blockquotes"
                icon={<Quote className="size-5" />}
                iconBgClass="bg-yellow-50 dark:bg-yellow-900/20"
                iconColorClass="text-yellow-600 dark:text-yellow-400"
                title="Blockquotes"
                description="Highlighting quotes"
                syntaxContent={
                  <div className="flex flex-col gap-1">
                    <p>&gt; This is a blockquote.</p>
                    <p>&gt; It can span multiple lines.</p>
                    <br />
                    <p>&gt; Nested blockquotes:</p>
                    <p>&gt;&gt; Are also supported.</p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-4">
                    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 py-1 italic text-muted-foreground bg-muted/30 rounded-r-lg">
                      This is a blockquote.
                      <br />
                      It can span multiple lines.
                    </blockquote>
                    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 py-1 italic text-muted-foreground bg-muted/30 rounded-r-lg">
                      Nested blockquotes:
                      <blockquote className="border-l-4 border-muted-foreground/30 pl-4 py-1 mt-2">
                        Are also supported.
                      </blockquote>
                    </blockquote>
                  </div>
                }
              />

              {/* Tables */}
              <CheatsheetSection
                id="tables"
                icon={<Table className="size-5" />}
                iconBgClass="bg-cyan-50 dark:bg-cyan-900/20"
                iconColorClass="text-cyan-600 dark:text-cyan-400"
                title="Tables"
                description="GFM tables with alignment"
                syntaxContent={
                  <div className="flex flex-col gap-1 text-xs">
                    <p>| Header 1 | Header 2 | Header 3 |</p>
                    <p>|:---------|:--------:|---------:|</p>
                    <p>| Left | Center | Right |</p>
                    <p>| aligned | aligned | aligned |</p>
                  </div>
                }
                renderedContent={
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-2 font-semibold">Header 1</th>
                          <th className="text-center p-2 font-semibold">Header 2</th>
                          <th className="text-right p-2 font-semibold">Header 3</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="text-left p-2">Left</td>
                          <td className="text-center p-2">Center</td>
                          <td className="text-right p-2">Right</td>
                        </tr>
                        <tr>
                          <td className="text-left p-2">aligned</td>
                          <td className="text-center p-2">aligned</td>
                          <td className="text-right p-2">aligned</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                }
              />

              {/* Math / LaTeX */}
              <CheatsheetSection
                id="math"
                icon={<Sigma className="size-5" />}
                iconBgClass="bg-pink-50 dark:bg-pink-900/20"
                iconColorClass="text-pink-600 dark:text-pink-400"
                title="Math (LaTeX)"
                description="Inline and block equations via KaTeX"
                syntaxContent={
                  <div className="flex flex-col gap-2">
                    <p>Inline: $E = mc^2$</p>
                    <br />
                    <p>Block equation:</p>
                    <p>$$</p>
                    <p>
                      \int_0^\infty e^{'{-x^2}'} dx = \frac{'{\\sqrt{\\pi}}{2}'}
                    </p>
                    <p>$$</p>
                    <br />
                    <p>Euler&apos;s identity:</p>
                    <p>$$e^{'{i\\pi}'} + 1 = 0$$</p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-4">
                    <p>
                      Inline:{' '}
                      <span className="font-serif italic">
                        E = mc<sup>2</sup>
                      </span>
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg text-center font-serif text-lg">
                      <span className="italic">
                        ∫<sub>0</sub>
                        <sup>∞</sup> e<sup>-x²</sup> dx = √π/2
                      </span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center font-serif text-lg">
                      <span className="italic">
                        e<sup>iπ</sup> + 1 = 0
                      </span>
                    </div>
                  </div>
                }
              />

              {/* Horizontal Rules */}
              <CheatsheetSection
                id="horizontal-rules"
                icon={<Minus className="size-5" />}
                iconBgClass="bg-gray-100 dark:bg-gray-700"
                iconColorClass="text-gray-600 dark:text-gray-400"
                title="Horizontal Rules"
                description="Section dividers"
                syntaxContent={
                  <div className="flex flex-col gap-2">
                    <p>Three or more:</p>
                    <br />
                    <p>---</p>
                    <p>***</p>
                    <p>___</p>
                  </div>
                }
                renderedContent={
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">All render the same:</p>
                    <hr className="border-t border-border" />
                    <p className="text-xs text-muted-foreground">
                      (Use to separate content sections)
                    </p>
                  </div>
                }
              />
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden mt-8 rounded-2xl bg-linear-to-br from-primary to-blue-600 p-6 md:p-10 text-center text-white relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl" />
              <div className="relative z-10 flex flex-col gap-4 items-center">
                <h2 className="text-2xl font-bold">Ready to practice?</h2>
                <p className="text-white/90 max-w-md text-sm md:text-base">
                  Try our advanced editor with live preview, syntax highlighting, and export
                  features.
                </p>
                <Button
                  render={<Link to="/" />}
                  nativeButton={false}
                  variant="secondary"
                  className="mt-2 bg-white text-primary hover:bg-gray-50 px-8 py-3 rounded-xl font-bold text-sm shadow-xl"
                >
                  Launch Editor
                </Button>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
            <div className="sticky top-28 flex flex-col gap-6">
              {/* CTA Card */}
              <div className="rounded-xl border border-primary/20 bg-linear-to-br from-card to-primary/5 p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primary/10 to-primary/20 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="size-12 rounded-xl bg-card shadow-sm border border-primary/20 flex items-center justify-center text-primary mb-1">
                    <PenSquare className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Try the Editor</h3>
                    <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                      Don&apos;t just read about it. Practice your markdown skills in our real-time
                      editor.
                    </p>
                  </div>
                  <Button
                    render={<Link to="/" />}
                    nativeButton={false}
                    className="w-full rounded-lg shadow-md shadow-primary/20"
                  >
                    Open Live Editor
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Nav */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-muted-foreground">
                  <List className="size-4" />
                  Quick Nav
                </h4>
                <nav className="flex flex-col gap-1">
                  {[
                    { id: 'headers', label: 'Headers' },
                    { id: 'emphasis', label: 'Emphasis' },
                    { id: 'lists', label: 'Lists' },
                    { id: 'links', label: 'Links & Images' },
                    { id: 'code', label: 'Code' },
                    { id: 'blockquotes', label: 'Blockquotes' },
                    { id: 'tables', label: 'Tables' },
                    { id: 'math', label: 'Math (LaTeX)' },
                    { id: 'horizontal-rules', label: 'Horizontal Rules' },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary pl-3 -ml-3 group/nav"
                    >
                      <span className="group-hover/nav:translate-x-1 transition-transform">
                        {item.label}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
