<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Seo from '$lib/components/Seo.svelte';
	import { categories, tools } from '$lib/tools/catalog.js';

	let { children } = $props();

	const canonicalBaseUrl = 'https://dtdg.fr/dev-toolbox';
	const toolsByRoute = new Map(tools.map((tool) => [tool.canonicalRoute, tool]));
	const categoriesById = new Map(categories.map((category) => [category.id, category]));

	const normalizePath = (pathname) => {
		const withoutBase =
			base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
		return `${withoutBase.replace(/\/$/, '')}/`;
	};

	const toolJsonLd = (tool) => ({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebApplication',
				name: tool.name,
				applicationCategory: categoriesById.get(tool.category)?.label || 'DeveloperApplication',
				operatingSystem: 'Any',
				url: `${canonicalBaseUrl}${tool.canonicalRoute}`,
				description: tool.seoDescription,
				keywords: tool.keywords.join(', '),
				offers: {
					'@type': 'Offer',
					price: '0',
					priceCurrency: 'USD'
				}
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Dev Toolbox',
						item: `${canonicalBaseUrl}/`
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: tool.name,
						item: `${canonicalBaseUrl}${tool.canonicalRoute}`
					}
				]
			}
		]
	});

	$: currentRoute = normalizePath($page.url.pathname);
	$: currentTool = toolsByRoute.get(currentRoute);
	$: currentToolJsonLd = currentTool ? toolJsonLd(currentTool) : null;
</script>

{#if currentTool}
	<Seo
		title={currentTool.seoTitle}
		description={currentTool.seoDescription}
		canonicalUrl={`${canonicalBaseUrl}${currentTool.canonicalRoute}`}
		type="website"
		jsonLd={currentToolJsonLd}
	/>
{/if}

{@render children()}
