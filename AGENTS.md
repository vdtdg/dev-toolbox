# AGENTS.md

## Goal

Dev Toolbox is an open-source, airgapped-friendly developer toolbox.

All tools run fully client-side for privacy and offline usability.

## Technologies

- SvelteKit
- Svelte
- Vite
- JavaScript (no TypeScript)
- Tailwind CSS
- Node.js (for build tooling)
- Docker and Docker Compose

## Design Theme

- Dark, utilitarian developer dashboard theme
- Dark mode, high-contrast: charcoal/near-black background with light gray text; easy on the eyes
- Muted accent colors: soft cyan/blue for headings and highlights
- Flat UI, system-ish typography
- Thin, high-contrast borders (1px to 1.5px)
- Monochrome base plus one accent color
  - Cyan/electric blue: default
  - Amber: warning or investigative
  - Red: danger, use sparingly
- Dense information layout
- Striped down UI. No fluff, no useless thing.
- Utilitarian.
- Widescreen.

## Repository Structure

- `src/routes/` - SvelteKit routes and pages
- `src/lib/` - Shared UI components, tool logic, and helpers
- `src/lib/tools/` - Individual toolbox tools
- `src/lib/styles/` - Global styles and Tailwind setup
- `static/` - Static assets (icons, images, robots, etc.)
- `svelte.config.js` - SvelteKit configuration
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `Dockerfile` - Container build
- `docker-compose.yml` - Local container orchestration

## Toolbox Tools

Find the full toolbox tool in the README.md file.

## External dependencies

External libraries can be used, the goal is not to reimplement tools, but they should be installed and shipped with the project, which is meant to be run in airgapped environments.
