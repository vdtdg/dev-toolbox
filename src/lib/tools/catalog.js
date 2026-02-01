export const categories = [
	{
		id: 'all',
		label: 'All Tools',
		description: 'Every available utility'
	},
	{
		id: 'text',
		label: 'Text',
		description: 'Transform and lint text'
	},
	{
		id: 'encoding',
		label: 'Encoding',
		description: 'Convert data formats'
	},
	{
		id: 'security',
		label: 'Security',
		description: 'Hashes and secrets'
	},
	{
		id: 'web',
		label: 'Web',
		description: 'HTTP and headers'
	},
	{
		id: 'dev',
		label: 'Dev Utilities',
		description: 'Developer essentials'
	}
];

export const tools = [
	{
		id: 'json-formatter',
		name: 'JSON Formatter',
		category: 'text',
		status: 'ready',
		description: 'Prettify, minify, and validate JSON payloads.',
		format: 'Input: JSON | Output: formatted JSON',
		tags: ['json', 'format', 'validate']
	},
	{
		id: 'yaml-converter',
		name: 'YAML Converter',
		category: 'text',
		status: 'planned',
		description: 'Convert YAML to JSON without network calls.',
		format: 'Input: YAML | Output: JSON',
		tags: ['yaml', 'json']
	},
	{
		id: 'base64',
		name: 'Base64 Encode/Decode',
		category: 'encoding',
		status: 'ready',
		description: 'Encode strings or files to base64 and back.',
		format: 'Input: text/file | Output: base64',
		tags: ['binary', 'text']
	},
	{
		id: 'url-encode',
		name: 'URL Encode/Decode',
		category: 'encoding',
		status: 'ready',
		description: 'Safe URL encoding with space and unicode handling.',
		format: 'Input: text | Output: encoded URL',
		tags: ['url', 'percent']
	},
	{
		id: 'hash',
		name: 'Hash Generator',
		category: 'security',
		status: 'beta',
		description: 'Compute SHA-256, SHA-512, and BLAKE3 digests.',
		format: 'Input: text/file | Output: digest',
		tags: ['sha', 'blake3', 'checksum']
	},
	{
		id: 'hmac',
		name: 'HMAC Signer',
		category: 'security',
		status: 'planned',
		description: 'Sign payloads with shared secret keys.',
		format: 'Input: text/key | Output: signature',
		tags: ['hmac', 'auth']
	},
	{
		id: 'jwt',
		name: 'JWT Inspector',
		category: 'security',
		status: 'ready',
		description: 'Decode and verify JWT claims locally.',
		format: 'Input: JWT | Output: decoded claims',
		tags: ['jwt', 'auth']
	},
	{
		id: 'http-builder',
		name: 'HTTP Request Builder',
		category: 'web',
		status: 'planned',
		description: 'Compose requests and export curl snippets.',
		format: 'Output: curl, fetch',
		tags: ['http', 'curl']
	},
	{
		id: 'user-agent',
		name: 'User Agent Parser',
		category: 'web',
		status: 'planned',
		description: 'Analyze UA strings for device and browser data.',
		format: 'Input: UA string | Output: parsed fields',
		tags: ['browser', 'device']
	},
	{
		id: 'uuid',
		name: 'UUID Generator',
		category: 'dev',
		status: 'ready',
		description: 'Generate UUID v4 and v7 in bulk.',
		format: 'Output: UUID list',
		tags: ['id', 'uuid']
	},
	{
		id: 'cron',
		name: 'Cron Helper',
		category: 'dev',
		status: 'planned',
		description: 'Translate cron expressions into human readable schedules.',
		format: 'Input: cron | Output: schedule',
		tags: ['cron', 'schedule']
	},
	{
		id: 'diff-viewer',
		name: 'Diff Viewer',
		category: 'dev',
		status: 'planned',
		description: 'Compare two files with unified diff output.',
		format: 'Input: text/file | Output: diff',
		tags: ['diff', 'review']
	}
];

export const statusLabels = {
	ready: 'Ready',
	beta: 'Beta',
	planned: 'Planned'
};
