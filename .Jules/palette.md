## 2024-05-23 - [Icon Button Accessibility & Tooltips]

**Learning:** Icon-only buttons (like view toggles or theme switches) are often implemented with just `title` attributes. This provides poor UX (delayed, unstyled) and varying accessibility support. Wrapping them in a proper `Tooltip` component provides a consistent visual label. Additionally, buttons that act as toggles or part of a group (radio behavior) MUST communicate their state (active/inactive) via `aria-pressed` or `aria-current` to screen readers, as visual cues (colors, shadows) are insufficient.
**Action:** Always wrap icon-only buttons in `Tooltip` components and ensure their active state is programmatically communicated via ARIA attributes.
