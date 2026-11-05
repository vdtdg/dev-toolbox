import { categories, tools } from '$lib/tools/catalog.js';

export const prerender = true;

const canonicalBaseUrl = 'https://dtdg.fr/dev-toolbox';
const uniqueRoutes = [
	'/',
	...categories
		.filter((category) => category.id !== 'all')
		.map((category) => `/tools/${category.id}/`),
	...new Set(tools.map((tool) => tool.canonicalRoute))
];

export function GET() {
	const urls = uniqueRoutes
		.map((route) => `${canonicalBaseUrl}${route}`)
		.map((url) => `\t<url><loc>${url}</loc></url>`)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
	);
}
