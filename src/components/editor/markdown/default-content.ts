export const defaultContent = `# RenderMD

![Aurora borealis dancing over snow-capped mountains](https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&h=400&fit=crop&q=80)

Write. Preview. *Breathe.* This is your space for **beautiful documents**.

---

## Typography & Flow

Mix **bold**, *italic*, and ~~struck~~ text naturally. Use \`inline code\` for technical terms like \`useState\` or \`git rebase\`. Go ***bold italic*** when you mean it.

> "The universe is made of stories, not of atoms."
>
> — Muriel Rukeyser

### Lists

Things that spark joy:

- The smell of rain on concrete
- Code that works on the first try
- A perfectly brewed cup of coffee

How to get there:

1. Start with curiosity
2. Add persistence
3. Ship it

### Progress

- [x] Build something beautiful
- [x] Support GFM markdown
- [ ] Change the world
- [ ] Take a nap

---

## Code

150+ languages with syntax highlighting:

\`\`\`rust
fn main() {
    let stars: Vec<_> = (0..1000)
        .map(|_| Star::new_random())
        .filter(|s| s.brightness > 0.7)
        .collect();

    for star in &stars {
        star.shine();
    }
}
\`\`\`

\`\`\`sql
SELECT dreams.name, COUNT(*) as frequency
FROM consciousness.dreams
WHERE dreamer = 'you'
  AND lucid = true
GROUP BY dreams.name
ORDER BY frequency DESC
LIMIT 5;
\`\`\`

---

## Mathematics

Inline math: $E = mc^2$ · $\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$

The wave function of possibility:

$$\\Psi(x,t) = A e^{i(kx - \\omega t)}$$

Euler's identity—the most beautiful equation:

$$e^{i\\pi} + 1 = 0$$

---

## Data

| Shortcut | Action | Magic Level |
|:---------|:------:|------------:|
| \`⌘ + B\` | **Bold** | ★☆☆ |
| \`⌘ + I\` | *Italic* | ★☆☆ |
| \`⌘ + K\` | [Link]() | ★★☆ |
| \`⌘ + E\` | \`Code\` | ★★★ |

---

## Images & Links

Explore the [GitHub Flavored Markdown](https://github.github.com/gfm/) spec or the [KaTeX docs](https://katex.org/docs/supported.html) for math.

![Milky Way over desert landscape](https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&h=400&fit=crop&q=80)

*We are all made of star stuff.*

---

### Heading Scale

# h1 — Titles
## h2 — Sections
### h3 — Subsections
#### h4 — Details
##### h5 — Notes
###### h6 — Whispers

---

*Clear this canvas and make it yours.*
`
