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
