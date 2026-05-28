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

const localPrivacyDescription =
	'All processing happens locally in your browser. No input is uploaded or sent to a server.';

const normalizeRoute = (route) => `${route.split('?')[0].replace(/\/$/, '')}/`;

const descriptionWithPrivacy = (description) =>
	`${description} Works offline with local browser processing.`;

const parseFormatPart = (format, label) => {
	const match = format.match(new RegExp(`${label}:\\s*([^|]+)`, 'i'));
	return match?.[1]?.trim() || '';
};

const formatInputDescription = (tool) => {
	const input = parseFormatPart(tool.format, 'Input');
	if (!input) return `${tool.name} can be used directly in your browser.`;
	return `Provide ${input.toLowerCase()} to use ${tool.name}.`;
};

const formatOutputDescription = (tool) => {
	const output = parseFormatPart(tool.format, 'Output');
	if (!output) return `${tool.name} displays results immediately in the browser.`;
	return `${tool.name} returns ${output.toLowerCase()} immediately in the browser.`;
};

const formatUseCases = (tool) => {
	const primaryTags = tool.tags.slice(0, 3).join(', ');
	return [
		`Use ${tool.name} for ${tool.description.toLowerCase()}`,
		primaryTags ? `Find it when searching for ${primaryTags}.` : `Run this utility offline.`
	];
};

const enrichToolSeo = (tool) => ({
	...tool,
	canonicalRoute: normalizeRoute(tool.route),
	seoTitle: `${tool.name} - Dev Toolbox`,
	seoDescription: descriptionWithPrivacy(tool.description),
	keywords: tool.tags,
	inputDescription: formatInputDescription(tool),
	outputDescription: formatOutputDescription(tool),
	useCases: formatUseCases(tool),
	privacyDescription: localPrivacyDescription
});

const rawTools = [
	{
		id: 'pomodoro',
		name: 'Pomodoro',
		category: 'productivity',
		status: 'ready',
		description: 'Focus timer with configurable work and break cycles.',
		format: 'Output: timers',
		tags: ['focus', 'timer', 'productivity', 'countdown', 'breaks', 'work-session'],
		route: '/tools/pomodoro'
	},
	{
		id: 'cron-visualizer',
		name: 'Cron Tab Helper + Visualizer',
		category: 'productivity',
		status: 'ready',
		description: 'Build cron expressions and preview upcoming runs.',
		format: 'Input: cron | Output: schedule',
		tags: ['cron', 'crontab', 'schedule', 'planner', 'expression', 'automation'],
		route: '/tools/cron'
	},
	{
		id: 'levenshtein',
		name: 'Levenshtein Distance Calculator',
		category: 'cryptography',
		status: 'ready',
		description: 'Compare strings and compute edit distance.',
		format: 'Input: text pair | Output: distance',
		tags: ['string', 'distance', 'compare', 'similarity', 'typo', 'fuzzy-match'],
		route: '/tools/levenshtein'
	},
	{
		id: 'uri-encoder',
		name: 'URI Encoder / Decoder',
		category: 'cryptography',
		status: 'ready',
		description: 'Encode or decode URI components safely.',
		format: 'Input: text | Output: URI',
		tags: ['uri', 'url', 'encode', 'decode', 'percent-encoding', 'percent-encode'],
		route: '/tools/uri'
	},
	{
		id: 'html-encoder',
		name: 'HTML Encoder / Decoder',
		category: 'cryptography',
		status: 'ready',
		description: 'Escape or decode HTML entities.',
		format: 'Input: text | Output: encoded HTML',
		tags: ['html', 'entities', 'escape', 'unescape', 'decode', 'xss'],
		route: '/tools/html'
	},
	{
		id: 'base64-encoder',
		name: 'Base64 Encoder / Decoder',
		category: 'cryptography',
		status: 'ready',
		description: 'Convert text or binary to base64 and back.',
		format: 'Input: text/file | Output: base64',
		tags: ['base64', 'b64', 'encode', 'decode', 'text-to-base64', 'file-to-base64'],
		route: '/tools/base64'
	},
	{
		id: 'md5-hasher',
		name: 'MD5 Hasher',
		category: 'cryptography',
		status: 'ready',
		description: 'Generate MD5 hashes for strings or files.',
		format: 'Input: text/file | Output: hash',
		tags: ['md5', 'hash', 'digest', 'checksum'],
		route: '/tools/hashers?algo=md5'
	},
	{
		id: 'sha1-hasher',
		name: 'SHA1 Hasher',
		category: 'cryptography',
		status: 'ready',
		description: 'Compute SHA-1 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['sha1', 'hash', 'digest', 'checksum'],
		route: '/tools/hashers?algo=sha1'
	},
	{
		id: 'sha256-hasher',
		name: 'SHA256 Hasher',
		category: 'cryptography',
		status: 'ready',
		description: 'Compute SHA-256 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['sha256', 'hash', 'digest', 'checksum'],
		route: '/tools/hashers?algo=sha256'
	},
	{
		id: 'sha512-hasher',
		name: 'SHA512 Hasher',
		category: 'cryptography',
		status: 'ready',
		description: 'Compute SHA-512 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['sha512', 'hash', 'digest', 'checksum'],
		route: '/tools/hashers?algo=sha512'
	},
	{
		id: 'ripemd160-hasher',
		name: 'RIPEMD-160 Hasher',
		category: 'cryptography',
		status: 'ready',
		description: 'Compute RIPEMD-160 digests.',
		format: 'Input: text/file | Output: hash',
		tags: ['ripemd160', 'hash', 'digest', 'checksum'],
		route: '/tools/hashers?algo=ripemd160'
	},
	{
		id: 'jwt-helper',
		name: 'JWT Helper',
		category: 'cryptography',
		status: 'ready',
		description: 'Validate tokens, import JWKs, and manage clock skew.',
		format: 'Input: JWT | Output: claims',
		tags: ['jwt', 'jwk', 'auth', 'token', 'bearer', 'claims'],
		route: '/tools/jwt'
	},
	{
		id: 'hash-verifier',
		name: 'Hash Verifier',
		category: 'cryptography',
		status: 'ready',
		description: 'Check hashes against known values.',
		format: 'Input: text/hash | Output: match',
		tags: ['hash', 'verify', 'checksum', 'integrity', 'compare'],
		route: '/tools/hash-verifier'
	},
	{
		id: 'hmac-generator',
		name: 'HMAC Generator',
		category: 'cryptography',
		status: 'ready',
		description: 'Generate HMAC signatures with SHA-256/SHA-512.',
		format: 'Input: text/key | Output: signature',
		tags: ['hmac', 'sha256', 'sha512', 'signature', 'signing', 'webhook'],
		route: '/tools/hmac'
	},
	{
		id: 'ssh-key-fingerprint',
		name: 'SSH Key Fingerprint',
		category: 'cryptography',
		status: 'ready',
		description: 'Compute MD5 or SHA-256 fingerprints for SSH keys.',
		format: 'Input: public key | Output: fingerprint',
		tags: ['ssh', 'key', 'public-key', 'fingerprint', 'md5', 'sha256'],
		route: '/tools/ssh-fingerprint'
	},
	{
		id: 'tls-cert-decoder',
		name: 'TLS Certificate Decoder',
		category: 'cryptography',
		status: 'ready',
		description: 'Decode PEM certificates locally.',
		format: 'Input: PEM | Output: certificate data',
		tags: ['tls', 'ssl', 'pem', 'crt', 'x509', 'certificate'],
		route: '/tools/tls-cert'
	},
	{
		id: 'timestamp-to-time',
		name: 'Timestamp to Time',
		category: 'time',
		status: 'ready',
		description: 'Convert Unix timestamps to readable dates.',
		format: 'Input: timestamp | Output: date',
		tags: ['timestamp', 'unix', 'epoch', 'date', 'time'],
		route: '/tools/timestamp'
	},
	{
		id: 'timezone-converter',
		name: 'Timezone Converter',
		category: 'time',
		status: 'ready',
		description: 'Convert times across timezones.',
		format: 'Input: date/time | Output: converted time',
		tags: ['timezone', 'time-zone', 'utc', 'dst', 'convert'],
		route: '/tools/timezone'
	},
	{
		id: 'relative-time',
		name: 'Relative Time Calculator',
		category: 'time',
		status: 'ready',
		description: 'Compute relative durations and offsets.',
		format: 'Input: date/time | Output: relative time',
		tags: ['relative', 'duration', 'offset', 'ago', 'from-now'],
		route: '/tools/relative-time'
	},
	{
		id: 'base-converter',
		name: 'Change Base Helper',
		category: 'number',
		status: 'ready',
		description: 'Convert numbers between bases.',
		format: 'Input: number/base | Output: converted',
		tags: ['base', 'convert', 'hex', 'hexadecimal', 'decimal', 'octal', 'binary'],
		route: '/tools/base'
	},
	{
		id: 'ipv4-helper',
		name: 'IPv4 Helper',
		category: 'number',
		status: 'ready',
		description: 'Work with IPv4 addresses and CIDR.',
		format: 'Input: IPv4 | Output: analysis',
		tags: ['ipv4', 'ip', 'cidr', 'subnet', 'netmask', 'network'],
		route: '/tools/ipv4'
	},
	{
		id: 'binary-helper',
		name: 'Binary Helper',
		category: 'number',
		status: 'ready',
		description: 'Convert and inspect binary values.',
		format: 'Input: number | Output: binary',
		tags: ['binary', 'bits', 'bitwise', 'hex', 'hexa', 'hexadecimal', 'decimal', 'octal'],
		route: '/tools/binary'
	},
	{
		id: 'unix-permissions',
		name: 'Unix Permission Calculator',
		category: 'number',
		status: 'ready',
		description: 'Translate chmod values to symbolic permissions.',
		format: 'Input: octal | Output: rwx',
		tags: ['chmod', 'permissions', 'rwx', 'octal', 'file-mode', 'unix'],
		route: '/tools/unix-permissions'
	},
	{
		id: 'image-helper',
		name: 'Image Helper',
		category: 'graphics',
		status: 'ready',
		description: 'Resize, compress, and convert images.',
		format: 'Input: image | Output: transformed image',
		tags: ['image', 'convert', 'resize', 'crop', 'compress', 'optimize', 'png', 'jpg', 'webp'],
		route: '/tools/image-helper'
	},
	{
		id: 'color-picker',
		name: 'Color Picker',
		category: 'graphics',
		status: 'ready',
		description: 'Pick colors and copy values.',
		format: 'Output: color values',
		tags: ['color', 'picker', 'eyedropper', 'hex', 'rgb', 'hsl'],
		route: '/tools/color-picker'
	},
	{
		id: 'color-shades',
		name: 'Color Shades Generator',
		category: 'graphics',
		status: 'ready',
		description: 'Generate tints and shades for a palette.',
		format: 'Output: color scale',
		tags: ['color', 'palette', 'shades', 'tints', 'tone', 'gradient'],
		route: '/tools/color-shades'
	},
	{
		id: 'qr-code',
		name: 'QR Code Generator + Reader',
		category: 'graphics',
		status: 'ready',
		description: 'Create or scan QR codes.',
		format: 'Input: text/image | Output: QR',
		tags: ['qr', 'qrcode', 'scan', 'reader', 'generator'],
		route: '/tools/qr'
	},
	{
		id: 'color-contrast',
		name: 'Color Contrast Checker',
		category: 'graphics',
		status: 'ready',
		description: 'Check WCAG contrast ratios.',
		format: 'Input: colors | Output: contrast',
		tags: ['wcag', 'a11y', 'accessibility', 'contrast', 'ratio'],
		route: '/tools/color-contrast'
	},
	{
		id: 'image-metadata',
		name: 'Image Metadata Viewer',
		category: 'graphics',
		status: 'ready',
		description: 'Read EXIF/IPTC metadata from images.',
		format: 'Input: image | Output: metadata',
		tags: ['exif', 'iptc', 'metadata', 'gps', 'camera', 'image-info'],
		route: '/tools/image-metadata'
	},
	{
		id: 'url-parser',
		name: 'URL Parser',
		category: 'network',
		status: 'ready',
		description: 'Parse URLs into structured components.',
		format: 'Input: URL | Output: parts',
		tags: ['url', 'uri', 'parse', 'query', 'hostname', 'scheme'],
		route: '/tools/url-parser'
	},
	{
		id: 'openapi-viewer',
		name: 'OpenAPI/Swagger Viewer',
		category: 'network',
		status: 'ready',
		description: 'Preview OpenAPI specs with a local viewer.',
		format: 'Input: OpenAPI | Output: docs',
		tags: ['openapi', 'swagger', 'api', 'spec', 'json', 'yaml', 'documentation'],
		route: '/tools/openapi'
	},
	{
		id: 'ascii-table',
		name: 'ASCII Reference Table',
		category: 'misc',
		status: 'ready',
		description: 'Lookup ASCII codes and characters.',
		format: 'Output: table',
		tags: ['ascii', 'table', 'characters', 'char-code', 'decimal', 'hex'],
		route: '/tools/ascii-table'
	},
	{
		id: 'vim-help',
		name: "Help me I'm stuck in Vim!",
		category: 'misc',
		status: 'ready',
		description: 'Quick exit cheatsheet for Vim.',
		format: 'Output: instructions',
		tags: ['vim', 'help', 'quit', 'exit', 'cheatsheet', 'editor'],
		route: '/tools/vim-help'
	},
	{
		id: 'diff-viewer',
		name: 'File Diff + Patch Viewer',
		category: 'misc',
		status: 'ready',
		description: 'Compare files and preview patch application.',
		format: 'Input: files | Output: diff',
		tags: ['diff', 'patch', 'compare', 'unified-diff', 'git-diff'],
		route: '/tools/diff-viewer'
	},
	{
		id: 'lorem-ipsum',
		name: 'Lorem Ipsum Generator',
		category: 'misc',
		status: 'ready',
		description: 'Generate placeholder text blocks.',
		format: 'Output: text',
		tags: ['lorem', 'ipsum', 'placeholder', 'dummy-text', 'latin', 'content'],
		route: '/tools/lorem-ipsum'
	},
	{
		id: 'json-formatter',
		name: 'JSON Formatter/Minifier + JSONPath',
		category: 'misc',
		status: 'ready',
		description: 'Format JSON, minify, and query with JSONPath.',
		format: 'Input: JSON | Output: formatted JSON',
		tags: ['json', 'jsonpath', 'format', 'formatter', 'prettify', 'minify', 'beautify'],
		route: '/tools/json'
	},
	{
		id: 'yaml-json-converter',
		name: 'YAML ↔ JSON Converter',
		category: 'misc',
		status: 'ready',
		description: 'Convert YAML to JSON and back.',
		format: 'Input: YAML/JSON | Output: converted',
		tags: ['yaml', 'yml', 'json', 'convert', 'serialize', 'deserialize'],
		route: '/tools/yaml-json'
	},
	{
		id: 'csv-json-converter',
		name: 'CSV ↔ JSON Converter',
		category: 'misc',
		status: 'ready',
		description: 'Convert CSV to JSON and back.',
		format: 'Input: CSV/JSON | Output: converted',
		tags: ['csv', 'json', 'convert', 'delimiter', 'tabular', 'records'],
		route: '/tools/csv-json'
	},
	{
		id: 'xml-formatter',
		name: 'XML Formatter + XPath Tester',
		category: 'misc',
		status: 'ready',
		description: 'Format XML and evaluate XPath queries.',
		format: 'Input: XML | Output: formatted XML',
		tags: ['xml', 'xpath', 'format', 'formatter', 'pretty-print', 'minify'],
		route: '/tools/xml'
	},
	{
		id: 'id-generator',
		name: 'UUID/ULID/KSUID Generator',
		category: 'misc',
		status: 'ready',
		description: 'Generate sortable and random IDs.',
		format: 'Output: identifiers',
		tags: ['uuid', 'guid', 'ulid', 'ksuid', 'id', 'identifier', 'generator'],
		route: '/tools/id-generator'
	},
	{
		id: 'regex-tester',
		name: 'Regex Tester + Explainer',
		category: 'misc',
		status: 'ready',
		description: 'Test regex patterns and explain matches.',
		format: 'Input: regex/text | Output: matches',
		tags: ['regex', 'regexp', 'pattern', 'test', 'match', 'pcre'],
		route: '/tools/regex'
	},
	{
		id: 'text-case',
		name: 'Text Case Converter + Slugify',
		category: 'misc',
		status: 'ready',
		description: 'Convert text case and generate slugs.',
		format: 'Input: text | Output: transformed text',
		tags: ['case', 'slug', 'text', 'camel', 'snake', 'kebab', 'pascal'],
		route: '/tools/text-case'
	},
	{
		id: 'base-n-encoders',
		name: 'Base-N Encoders',
		category: 'misc',
		status: 'ready',
		description: 'Encode data in Base32, Base58, or Base85.',
		format: 'Input: text | Output: encoded',
		tags: ['base32', 'base58', 'base85', 'ascii85', 'encoding', 'radix'],
		route: '/tools/base-n-encoders'
	}
];

export const tools = rawTools.map(enrichToolSeo);
