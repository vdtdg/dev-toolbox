# SEO and LLM Discoverability Plan

Canonical production domain: `https://dtdg.fr/dev-toolbox`

## Goal

Improve how Dev Toolbox is described, indexed, and understood by Google, other search engines, and LLM crawlers while keeping the app fully client-side, airgapped-friendly, and privacy-preserving.

## Current Gaps

- Only the homepage currently defines a page title and meta description.
- Individual tool pages do not have tool-specific SEO metadata.
- There are no canonical URLs, Open Graph tags, Twitter card tags, sitemap, JSON-LD structured data, or `llms.txt`.
- Tool pages are useful but often too sparse for crawlers because the body text does not consistently explain the tool, its inputs, outputs, and privacy model.
- `site.webmanifest` is mostly empty and does not match the dark application theme.

## Implementation Steps

### 1. Centralize Tool SEO Metadata

Extend `src/lib/tools/catalog.js` with SEO-oriented fields for every tool.

Recommended fields:

- `seoTitle`: concise search title for the tool page.
- `seoDescription`: natural-language page description under roughly 155 characters when possible.
- `keywords`: relevant search terms without keyword stuffing.
- `inputDescription`: what users can paste, type, upload, or configure.
- `outputDescription`: what the tool returns or displays.
- `useCases`: practical reasons someone would use the tool.
- `privacyDescription`: short explanation that processing happens locally in the browser.

Keep this metadata in the catalog so it can be reused by the homepage, tool pages, sitemap, structured data, and `llms.txt` generation if desired.

### 2. Add a Reusable SEO Component

Create a reusable component, for example `src/lib/components/Seo.svelte`, that renders common metadata.

It should support:

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`
- Twitter card tags: `twitter:card`, `twitter:title`, `twitter:description`
- Optional JSON-LD structured data via `<script type="application/ld+json">`

Canonical URL rules:

- Homepage canonical: `https://dtdg.fr/dev-toolbox/`
- Tool canonical: `https://dtdg.fr/dev-toolbox/tools/<tool-slug>/`
- Preserve trailing slash because the SvelteKit layout sets `trailingSlash = 'always'`.

### 3. Add Homepage SEO

Update `src/routes/+page.svelte` to use the SEO component.

Homepage metadata should describe the full product:

- Offline-first developer toolbox.
- Fully client-side processing.
- No tracking, no ads, no cookies.
- Includes encoders, hashers, formatters, time tools, network helpers, image tools, and other utilities.

Recommended structured data:

- `WebSite`
- `SoftwareApplication`
- Optional `ItemList` for the tool catalog.

### 4. Add Tool-Specific SEO to Every Tool Page

Update every `src/routes/tools/*/+page.svelte` file to use the SEO component with metadata from `catalog.js`.

Each tool page should have:

- Unique title.
- Unique meta description.
- Canonical URL.
- Open Graph and Twitter metadata.
- Tool-specific JSON-LD.

Recommended structured data for tool pages:

- `SoftwareApplication` or `WebApplication`
- `BreadcrumbList`

Example title:

```text
Base64 Encoder / Decoder - Dev Toolbox
```

Example description:

```text
Encode and decode Base64 text locally in your browser. No upload, no tracking, works offline.
```

### 5. Add Visible Tool Descriptions

Add a compact explanatory section to each tool page so crawlers and LLMs can understand the page from visible content, not only metadata.

Recommended section title:

```text
About this tool
```

Recommended content blocks:

- `What it does`
- `Input`
- `Output`
- `Privacy`

Keep the language concise and utilitarian. Avoid marketing fluff.

Example:

```text
This Base64 tool encodes UTF-8 text to Base64 and decodes Base64 back to readable text. All processing happens locally in your browser.
```

### 6. Add a Sitemap

Create `src/routes/sitemap.xml/+server.js`.

The sitemap should:

- Include `https://dtdg.fr/dev-toolbox/`.
- Include every route from `src/lib/tools/catalog.js`.
- Normalize query-based routes to their canonical page route when appropriate.
- Emit trailing slashes.
- Use `application/xml` content type.

Example URLs:

```text
https://dtdg.fr/dev-toolbox/
https://dtdg.fr/dev-toolbox/tools/base64/
https://dtdg.fr/dev-toolbox/tools/json/
```

For catalog entries like `/tools/hashers?algo=sha256`, decide whether to:

- Use one canonical URL for `/tools/hashers/`, or
- Create separate canonical URLs only if the UI supports meaningful static state per algorithm.

The minimal recommended first pass is to canonicalize query-based hash routes to `/tools/hashers/`.

### 7. Improve `robots.txt`

Update `static/robots.txt` to keep crawling allowed and add the sitemap location.

Recommended content:

```text
User-agent: *
Allow: /

Sitemap: https://dtdg.fr/dev-toolbox/sitemap.xml
```

### 8. Add `llms.txt`

Create `static/llms.txt`.

It should include:

- Project name and short description.
- Canonical site URL.
- Privacy/offline statement.
- Tool categories.
- Links to all canonical tool pages.

This file should be concise and machine-readable enough for LLM crawlers while remaining useful to humans.

Recommended URL:

```text
https://dtdg.fr/dev-toolbox/llms.txt
```

### 9. Improve Web App Manifest

Update `static/site.webmanifest`.

Recommended values:

- `name`: `Dev Toolbox`
- `short_name`: `Dev Toolbox`
- `description`: `Offline-first developer utilities that run locally in your browser.`
- `theme_color`: `#0a0d12`
- `background_color`: `#0a0d12`
- `display`: `standalone`
- Ensure icon paths work correctly under the configured base path.

### 10. Optional Category Landing Pages

Consider adding category pages later for broader SEO coverage.

Potential routes:

- `/tools/productivity/`
- `/tools/cryptography/`
- `/tools/time/`
- `/tools/number/`
- `/tools/graphics/`
- `/tools/network/`
- `/tools/misc/`

These pages can target broader searches such as:

- Offline cryptography tools.
- Browser-based developer utilities.
- Local JSON and YAML tools.
- Image and color tools for developers.

This should be a later step, not the first implementation pass.

## Validation Checklist

After implementation, verify:

- `pnpm run lint` passes.
- `pnpm run build` passes.
- Generated pages include correct `<title>` and meta descriptions.
- Canonical URLs use `https://dtdg.fr/dev-toolbox` and trailing slashes.
- Sitemap is reachable at `/sitemap.xml` in the production base path.
- `robots.txt` references the production sitemap.
- `llms.txt` is available as a static asset.
- Tool pages contain visible explanatory content, not only hidden metadata.
