# Implementation Plan: Homepage Redesign

## Overview

Add the silhouette image to the Hero section and the logo image to the Navbar, using Next.js `<Image>` for optimization. Both tasks modify existing components with minimal, focused changes — no new files or logic changes needed.

## Tasks

- [x] 1. Add silueta.png to Hero section
  - [x] 1.1 Modify `src/components/Hero.tsx` to render silhouette image
    - Add `import Image from "next/image"` at the top of the file
    - Convert the self-closing hero figure `<div className="... hero-figure ..." />` to an open `<div>...</div>`
    - Add an `<Image>` child inside the figure div with:
      - `src="/assets/silueta.png"`
      - `alt="Person wearing AuralEdge headphones with ambient glow"`
      - `fill` prop (image fills relative container)
      - `className="object-cover object-top z-[1]"` (below pseudo-elements, above gradient)
      - `priority` (hero is LCP)
      - `sizes="(max-width: 1024px) 100vw, 760px"`
    - Ensure existing pseudo-element decorations (`:before` ring at z-2, `:after` overlay) remain layered above the image
    - _Requirements: 2.2, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2. Add logo.jpg to Navbar
  - [x] 2.1 Modify `src/components/Navbar.tsx` to render logo image
    - Add `import Image from "next/image"` at the top of the file
    - Replace `<span className="text-xl text-brand">◎</span>` with:
      ```tsx
      <Image src="/assets/logo.jpg" alt="AURALEDGE logo" width={30} height={30} className="rounded-full" />
      ```
    - The parent `<a>` already has `flex items-center gap-2` providing proper spacing
    - Verify the "AURALEDGE" text remains after the image
    - _Requirements: 1.1, 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 3. Checkpoint — Verify build passes
  - Run `next build` to confirm no TypeScript or compilation errors
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP — none in this plan since all tasks are core implementation
- No property-based tests apply — this feature is purely presentational with no data transformations or business logic
- Both images are static assets already present in `/public/assets/`
- Existing cart, navigation, and CMS functionality is not modified
- The `priority` prop on the hero image ensures it is preloaded (LCP element)
- Fallback behavior is handled naturally: container gradients remain visible if images fail to load

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] }
  ]
}
```
