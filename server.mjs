import http from 'node:http';

import { handler } from './build/handler.js';

const normalizeBasePath = (value) => {
	if (!value) return '';
	const trimmed = value.trim();
	if (!trimmed || trimmed === '/') return '';
	const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
	return withLeading.replace(/\/+$/, '');
};

const basePath = normalizeBasePath(process.env.BASE_PATH);
const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
	if (!req.url) {
		res.statusCode = 400;
		res.end('Bad Request');
		return;
	}

	if (!basePath) {
		handler(req, res);
		return;
	}

	if (req.url === '/' || req.url === basePath) {
		res.statusCode = 302;
		res.setHeader('location', `${basePath}/`);
		res.end();
		return;
	}

	if (!req.url.startsWith(`${basePath}/`)) {
		res.statusCode = 404;
		res.end('Not Found');
		return;
	}

	// Strip the base prefix before handing to SvelteKit.
	req.url = req.url.slice(basePath.length) || '/';
	handler(req, res);
});

server.listen(port, '0.0.0.0', () => {
	console.log(`listening on 0.0.0.0:${port} (BASE_PATH=${basePath || '/'})`);
});
