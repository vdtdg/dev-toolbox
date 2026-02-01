export const categories = [
	{
		id: 'all',
		label: 'All Tools',
		description: 'Every available utility'
	},
	{
		id: 'productivity',
		label: 'Productivity',
		description: 'Time management and focus'
	},
	{
		id: 'cryptography',
		label: 'Cryptography',
		description: 'Encoding, hashing, and verification'
	},
	{
		id: 'time',
		label: 'Time',
		description: 'Dates, timestamps, and zones'
	},
	{
		id: 'number',
		label: 'Number',
		description: 'Bases, bits, and permissions'
	},
	{
		id: 'graphics',
		label: 'Graphics',
		description: 'Images, colors, and QR'
	},
	{
		id: 'network',
		label: 'Network',
		description: 'Requests and API tooling'
	},
	{
		id: 'misc',
		label: 'Misc',
		description: 'Grab bag utilities'
	}
];

export const tools = [
	{
		id: 'pomodoro',
		name: 'Pomodoro',
		category: 'productivity',
		status: 'planned',
		description: 'Focus timer with configurable work and break cycles.',
		format: 'Output: timers',
		tags: ['focus', 'timer', 'productivity'],
		route: '/tools/pomodoro'
	},
	{
		id: 'cron-visualizer',
		name: 'Cron Tab Helper + Visualizer',
		category: 'productivity',
		status: 'planned',
		description: 'Build cron expressions and preview upcoming runs.',
		format: 'Input: cron | Output: schedule',
		tags: ['cron', 'schedule', 'planner'],
		route: '/tools/cron'
	},
	{
		id: 'levenshtein',
		name: 'Levenshtein Distance Calculator',
		category: 'cryptography',
		status: 'planned',
		description: 'Compare strings and compute edit distance.',
		format: 'Input: text pair | Output: distance',
		tags: ['string', 'distance', 'compare'],
		route: '/tools/levenshtein'
	},
	{
		id: 'uri-encoder',
		name: 'URI Encoder / Decoder',
		category: 'cryptography',
		status: 'planned',
		description: 'Encode or decode URI components safely.',
		format: 'Input: text | Output: URI',
		tags: ['uri', 'encode', 'decode'],
		route: '/tools/uri'
	},
	{
		id: 'html-encoder',
		name: 'HTML Encoder / Decoder',
		category: 'cryptography',
		status: 'planned',
		description: 'Escape or decode HTML entities.',
		format: 'Input: text | Output: encoded HTML',
		tags: ['html', 'entities', 'escape'],
		route: '/tools/html'
	},
	{
		id: 'base64-encoder',
		name: 'Base64 Encoder / Decoder',
		category: 'cryptography',
		status: 'planned',
		description: 'Convert text or binary to base64 and back.',
		format: 'Input: text/file | Output: base64',
		tags: ['base64', 'encode', 'decode'],
		route: '/tools/base64'
	},
	{
		id: 'md5-hasher',
		name: 'MD5 Hasher',
		category: 'cryptography',
		status: 'planned',
		description: 'Generate MD5 hashes for strings or files.',
		format: 'Input: text/file | Output: hash',
		tags: ['md5', 'hash']
	},
	{
		id: 'sha1-hasher',
		name: 'SHA1 Hasher',
		category: 'cryptography',
		status: 'planned',
		description: 'Compute SHA-1 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['sha1', 'hash']
	},
	{
		id: 'sha256-hasher',
		name: 'SHA256 Hasher',
		category: 'cryptography',
		status: 'planned',
		description: 'Compute SHA-256 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['sha256', 'hash']
	},
	{
		id: 'sha512-hasher',
		name: 'SHA512 Hasher',
		category: 'cryptography',
		status: 'planned',
		description: 'Compute SHA-512 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['sha512', 'hash']
	},
	{
		id: 'ripemd160-hasher',
		name: 'RIPEMD-160 Hasher',
		category: 'cryptography',
		status: 'planned',
		description: 'Compute RIPEMD-160 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['ripemd160', 'hash']
	},
	{
		id: 'jwt-helper',
		name: 'JWT Helper',
		category: 'cryptography',
		status: 'planned',
		description: 'Validate tokens, import JWKs, and manage clock skew.',
		format: 'Input: JWT | Output: claims',
		tags: ['jwt', 'jwk', 'auth']
	},
	{
		id: 'hash-verifier',
		name: 'Hash Verifier',
		category: 'cryptography',
		status: 'planned',
		description: 'Check hashes against known values.',
		format: 'Input: text/hash | Output: match',
		tags: ['hash', 'verify']
	},
	{
		id: 'hmac-generator',
		name: 'HMAC Generator',
		category: 'cryptography',
		status: 'planned',
		description: 'Generate HMAC signatures with SHA-256/SHA-512.',
		format: 'Input: text/key | Output: signature',
		tags: ['hmac', 'sha256', 'sha512']
	},
	{
		id: 'ssh-key-fingerprint',
		name: 'SSH Key Fingerprint',
		category: 'cryptography',
		status: 'planned',
		description: 'Compute MD5 or SHA-256 fingerprints for SSH keys.',
		format: 'Input: public key | Output: fingerprint',
		tags: ['ssh', 'fingerprint', 'md5']
	},
	{
		id: 'tls-cert-decoder',
		name: 'TLS Certificate Decoder',
		category: 'cryptography',
		status: 'planned',
		description: 'Decode PEM certificates locally.',
		format: 'Input: PEM | Output: certificate data',
		tags: ['tls', 'pem', 'certificate']
	},
	{
		id: 'timestamp-to-time',
		name: 'Timestamp to Time',
		category: 'time',
		status: 'planned',
		description: 'Convert Unix timestamps to readable dates.',
		format: 'Input: timestamp | Output: date',
		tags: ['timestamp', 'unix', 'date']
	},
	{
		id: 'linkedin-post-parser',
		name: 'LinkedIn Post Date Parser',
		category: 'time',
		status: 'planned',
		description: 'Parse LinkedIn post times to absolute dates.',
		format: 'Input: LinkedIn timestamp | Output: date',
		tags: ['linkedin', 'date', 'parser']
	},
	{
		id: 'timezone-converter',
		name: 'Timezone Converter',
		category: 'time',
		status: 'planned',
		description: 'Convert times across timezones.',
		format: 'Input: date/time | Output: converted time',
		tags: ['timezone', 'convert']
	},
	{
		id: 'relative-time',
		name: 'Relative Time Calculator',
		category: 'time',
		status: 'planned',
		description: 'Compute relative durations and offsets.',
		format: 'Input: date/time | Output: relative time',
		tags: ['relative', 'duration']
	},
	{
		id: 'base-converter',
		name: 'Change Base Helper',
		category: 'number',
		status: 'planned',
		description: 'Convert numbers between bases.',
		format: 'Input: number/base | Output: converted',
		tags: ['base', 'convert']
	},
	{
		id: 'ipv4-helper',
		name: 'IPv4 Helper',
		category: 'number',
		status: 'planned',
		description: 'Work with IPv4 addresses and CIDR.',
		format: 'Input: IPv4 | Output: analysis',
		tags: ['ipv4', 'cidr', 'network']
	},
	{
		id: 'binary-helper',
		name: 'Binary Helper',
		category: 'number',
		status: 'planned',
		description: 'Convert and inspect binary values.',
		format: 'Input: number | Output: binary',
		tags: ['binary', 'bits']
	},
	{
		id: 'unix-permissions',
		name: 'Unix Permission Calculator',
		category: 'number',
		status: 'planned',
		description: 'Translate chmod values to symbolic permissions.',
		format: 'Input: octal | Output: rwx',
		tags: ['chmod', 'permissions']
	},
	{
		id: 'image-helper',
		name: 'Image Helper',
		category: 'graphics',
		status: 'planned',
		description: 'Resize, compress, and convert images.',
		format: 'Input: image | Output: transformed image',
		tags: ['image', 'convert', 'resize']
	},
	{
		id: 'color-picker',
		name: 'Color Picker',
		category: 'graphics',
		status: 'planned',
		description: 'Pick colors and copy values.',
		format: 'Output: color values',
		tags: ['color', 'picker']
	},
	{
		id: 'color-shades',
		name: 'Color Shades Generator',
		category: 'graphics',
		status: 'planned',
		description: 'Generate tints and shades for a palette.',
		format: 'Output: color scale',
		tags: ['color', 'palette']
	},
	{
		id: 'qr-code',
		name: 'QR Code Generator + Reader',
		category: 'graphics',
		status: 'planned',
		description: 'Create or scan QR codes.',
		format: 'Input: text/image | Output: QR',
		tags: ['qr', 'scan']
	},
	{
		id: 'color-contrast',
		name: 'Color Contrast Checker',
		category: 'graphics',
		status: 'planned',
		description: 'Check WCAG contrast ratios.',
		format: 'Input: colors | Output: contrast',
		tags: ['wcag', 'accessibility']
	},
	{
		id: 'image-metadata',
		name: 'Image Metadata Viewer',
		category: 'graphics',
		status: 'planned',
		description: 'Read EXIF/IPTC metadata from images.',
		format: 'Input: image | Output: metadata',
		tags: ['exif', 'iptc', 'metadata']
	},
	{
		id: 'http-request',
		name: 'HTTP Request',
		category: 'network',
		status: 'planned',
		description: 'Compose and send HTTP requests locally.',
		format: 'Output: response',
		tags: ['http', 'request']
	},
	{
		id: 'url-parser',
		name: 'URL Parser',
		category: 'network',
		status: 'planned',
		description: 'Parse URLs into structured components.',
		format: 'Input: URL | Output: parts',
		tags: ['url', 'parse']
	},
	{
		id: 'openapi-viewer',
		name: 'OpenAPI/Swagger Viewer',
		category: 'network',
		status: 'planned',
		description: 'Preview OpenAPI specs with a local viewer.',
		format: 'Input: OpenAPI | Output: docs',
		tags: ['openapi', 'swagger', 'api']
	},
	{
		id: 'ascii-table',
		name: 'ASCII Reference Table',
		category: 'misc',
		status: 'planned',
		description: 'Lookup ASCII codes and characters.',
		format: 'Output: table',
		tags: ['ascii', 'table']
	},
	{
		id: 'vim-help',
		name: "Help me I'm stuck in Vim!",
		category: 'misc',
		status: 'planned',
		description: 'Quick exit cheatsheet for Vim.',
		format: 'Output: instructions',
		tags: ['vim', 'help']
	},
	{
		id: 'diff-viewer',
		name: 'File Diff + Patch Viewer',
		category: 'misc',
		status: 'planned',
		description: 'Compare files and preview patch application.',
		format: 'Input: files | Output: diff',
		tags: ['diff', 'patch']
	},
	{
		id: 'emoji-picker',
		name: 'Emoji Picker',
		category: 'misc',
		status: 'planned',
		description: 'Browse and copy emoji symbols.',
		format: 'Output: emoji',
		tags: ['emoji', 'picker']
	},
	{
		id: 'lorem-ipsum',
		name: 'Lorem Ipsum Generator',
		category: 'misc',
		status: 'planned',
		description: 'Generate placeholder text blocks.',
		format: 'Output: text',
		tags: ['lorem', 'placeholder']
	},
	{
		id: 'json-formatter',
		name: 'JSON Formatter/Minifier + JSONPath',
		category: 'misc',
		status: 'planned',
		description: 'Format JSON, minify, and query with JSONPath.',
		format: 'Input: JSON | Output: formatted JSON',
		tags: ['json', 'jsonpath', 'format']
	},
	{
		id: 'yaml-json-converter',
		name: 'YAML ↔ JSON Converter',
		category: 'misc',
		status: 'planned',
		description: 'Convert YAML to JSON and back.',
		format: 'Input: YAML/JSON | Output: converted',
		tags: ['yaml', 'json', 'convert']
	},
	{
		id: 'csv-json-converter',
		name: 'CSV ↔ JSON Converter',
		category: 'misc',
		status: 'planned',
		description: 'Convert CSV to JSON and back.',
		format: 'Input: CSV/JSON | Output: converted',
		tags: ['csv', 'json', 'convert']
	},
	{
		id: 'xml-formatter',
		name: 'XML Formatter + XPath Tester',
		category: 'misc',
		status: 'planned',
		description: 'Format XML and evaluate XPath queries.',
		format: 'Input: XML | Output: formatted XML',
		tags: ['xml', 'xpath']
	},
	{
		id: 'id-generator',
		name: 'UUID/ULID/KSUID Generator',
		category: 'misc',
		status: 'planned',
		description: 'Generate sortable and random IDs.',
		format: 'Output: identifiers',
		tags: ['uuid', 'ulid', 'ksuid']
	},
	{
		id: 'regex-tester',
		name: 'Regex Tester + Explainer',
		category: 'misc',
		status: 'planned',
		description: 'Test regex patterns and explain matches.',
		format: 'Input: regex/text | Output: matches',
		tags: ['regex', 'test']
	},
	{
		id: 'text-case',
		name: 'Text Case Converter + Slugify',
		category: 'misc',
		status: 'planned',
		description: 'Convert text case and generate slugs.',
		format: 'Input: text | Output: transformed text',
		tags: ['case', 'slug', 'text']
	},
	{
		id: 'base-n-encoders',
		name: 'Base-N Encoders',
		category: 'misc',
		status: 'planned',
		description: 'Encode data in Base32, Base58, or Base85.',
		format: 'Input: text | Output: encoded',
		tags: ['base32', 'base58', 'base85']
	}
];

export const statusLabels = {
	ready: 'Ready',
	beta: 'Beta',
	planned: 'Planned'
};
