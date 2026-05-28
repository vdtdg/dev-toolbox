import { tools } from '$lib/tools/catalog.js';

export const prerender = true;

const canonicalBaseUrl = 'https://dtdg.fr/dev-toolbox';

const escapeXml = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const uniqueUrls = [
	`${canonicalBaseUrl}/`,
	...new Set(tools.map((tool) => `${canonicalBaseUrl}${tool.canonicalRoute}`))
];

export const GET = () => {
	const urls = uniqueUrls
		.map(
			(url) => `
	<url>
		<loc>${escapeXml(url)}</loc>
	</url>`
		)
		.join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`,
		{
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		}
	);
};
