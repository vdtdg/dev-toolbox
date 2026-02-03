# Dev Toolbox

Open-source, airgapped-friendly developer toolbox with a fast, lightweight UI.
All tools run fully client-side for privacy and offline usability.

## Features

- Free and open-source
- No ads, no tracking, no cookies
- Fully client-side processing
- Mobile friendly
- Easy Docker deployment
- Can run air-gapped

## Tech Stack

- SvelteKit + Svelte
- Vite
- JavaScript (no TypeScript)
- Tailwind CSS
- Node.js (build tooling)
- Docker and Docker Compose

## Toolbox Tools

### Productivity

- Pomodoro
- Cron Tab Helper + Visualizer (next runs)

### Cryptography

- Levenshtein Distance Calculator
- URI Encoder / Decoder
- HTML Encoder / Decoder
- Base64 Encoder / Decoder
- MD5 Hasher
- SHA1 Hasher
- SHA256 Hasher
- SHA512 Hasher
- RIPEMD-160 Hasher
- JWT Helper (validate, JWK import, clock skew)
- Hash Verifier
- HMAC Generator (SHA256/SHA512)
- SSH Key Fingerprint (MD5/SHA256)
- TLS Certificate Decoder (PEM)

### Time

- Timestamp to Time
- Timezone Converter
- Relative Time Calculator

### Number

- Change Base Helper
- IPv4 Helper
- Binary Helper
- Unix Permission Calculator

### Graphics

- Image Helper
- Color Picker
- Color Shades Generator
- QR Code Generator + Reader
- Color Contrast Checker (WCAG)
- Image Metadata Viewer (EXIF/IPTC)

### Network

- HTTP Request
- URL Parser
- OpenAPI/Swagger Viewer

### Misc

- ASCII Reference Table
- Help me I'm stuck in Vim!
- File Diff + Patch Viewer (apply preview)
- Lorem Ipsum Generator
- JSON Formatter/Minifier + JSONPath
- YAML ↔ JSON Converter
- CSV ↔ JSON Converter
- XML Formatter + XPath Tester
- UUID/ULID/KSUID Generator
- Regex Tester + Explainer
- Text Case Converter + Slugify
- Base-N Encoders (Base32/Base58/Base85)

## Run Locally

### Dev Server

```bash
corepack enable
pnpm install
pnpm run dev
```

Open http://localhost:5173 to access the toolbox.

## Build & Deploy

This repo supports two build targets:

- `static` (default): fully static site output in `build/`
- `node`: Node server build (useful for Docker with a runtime-configurable `BASE_PATH`)

You can select the adapter via `SVELTEKIT_ADAPTER`.

### Static Build (Airgapped-Friendly)

Build a fully static site:

```bash
pnpm run build
```

Build for a subpath (base URL) like `/dev-toolbox`:

```bash
BASE_PATH=/dev-toolbox pnpm run build
```

Output is written to `build/`.

Preview the production build locally:

```bash
pnpm run preview
```

### Docker (Node Server + Runtime BASE_PATH)

The Docker image uses the Node adapter so you can set the URL prefix at runtime.

Prebuilt images are published on Docker Hub:

- https://hub.docker.com/r/vdtdg/dev-toolbox

Build:

```bash
docker build -t dev-toolbox:latest .
```

Run (prebuilt image):

```bash
docker run --rm -p 8080:3000 -e BASE_PATH=/dev-toolbox vdtdg/dev-toolbox:latest
```

Run at a subpath (example: `/dev-toolbox`):

```bash
docker run --rm -p 8080:3000 -e BASE_PATH=/dev-toolbox dev-toolbox:latest
```

Then open: http://localhost:8080/dev-toolbox/

Run at the root (no prefix):

```bash
docker run --rm -p 8080:3000 dev-toolbox:latest
```

### Docker Compose

`docker-compose.yml` is configured to run the Node server and pass a `BASE_PATH`.

```bash
docker compose up --build
```

## Contributing

Contributions are welcome. Please open an issue or pull request with your
proposal.

## License

Distributed under the GNU GPLv3 License. See `LICENSE` for details.
