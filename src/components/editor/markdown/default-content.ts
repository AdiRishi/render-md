export const defaultContent = `# Welcome to MDViewer

A calm space for your thoughts. Start typing on the left—watch your words come to life on the right.

## The Basics

Write naturally. Use **bold** for emphasis, *italics* for nuance, or ~~strikethrough~~ when you change your mind. Combine them for ***bold italic*** when you really mean it.

Inline \`code\` fits right into your sentences, perfect for mentioning \`variables\` or \`commands\`.

> "The art of writing is the art of discovering what you believe."
>
> — Gustave Flaubert

## Structure Your Thoughts

### Lists

Unordered, for when order doesn't matter:

- Morning coffee
- A good book
- Quiet moments

Ordered, for when it does:

1. Breathe in
2. Breathe out
3. Repeat

### Task Lists

Track your progress:

- [x] Learn markdown basics
- [x] Explore the preview pane
- [ ] Write something meaningful
- [ ] Share it with the world

## Code That Speaks

Syntax highlighting makes code readable and beautiful:

\`\`\`typescript
interface Moment {
  time: Date
  thought: string
  feeling: 'peaceful' | 'inspired' | 'curious'
}

const now: Moment = {
  time: new Date(),
  thought: "This is rather nice.",
  feeling: 'peaceful'
}
\`\`\`

\`\`\`python
def haiku():
    """A poem in code."""
    lines = [
        "Code flows like water",
        "Markdown renders thoughts to form",
        "Peace in every line"
    ]
    return "\\n".join(lines)
\`\`\`

## Tables

Organize information clearly:

| What | Why | How |
|:-----|:---:|----:|
| Markdown | Simplicity | Just write |
| Tables | Clarity | Pipes and dashes |
| Alignment | Polish | Colons |

## Mathematics

For the curious mind, we support $\\LaTeX$ math.

The beauty of Euler's identity: $e^{i\\pi} + 1 = 0$

The sum of an arithmetic series:

$$\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$$

The Gaussian integral:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

## Links & Images

Visit [Markdown Guide](https://www.markdownguide.org) to learn more, or explore the [CommonMark Spec](https://commonmark.org) for the technical details.

![A peaceful landscape](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop)

*Mountains remind us that some things take time.*

## Heading Levels

# h1 — The Main Title
## h2 — Major Sections
### h3 — Subsections
#### h4 — Details
##### h5 — Fine Points
###### h6 — The Smallest

---

That's the canvas. Now it's yours.

Start fresh—select all and begin writing. The preview will follow, word by word, thought by thought.

*Happy writing.*
`
