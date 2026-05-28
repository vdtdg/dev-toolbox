<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
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

	let currentRoute = $derived(normalizePath(page.url.pathname));
	let currentTool = $derived(toolsByRoute.get(currentRoute));
	let currentToolJsonLd = $derived(currentTool ? toolJsonLd(currentTool) : null);
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

{#if currentTool}
	<section class="mx-auto flex max-w-300 flex-col gap-4 px-6 pb-10">
		<div class="panel panel-muted space-y-4 p-5">
			<div>
				<p class="text-xs tracking-[0.24em] text-(--color-muted) uppercase">About this tool</p>
				<h2 class="mt-1 text-xl font-semibold">{currentTool.name}</h2>
			</div>

			<div class="grid gap-4 text-sm md:grid-cols-2">
				<div class="space-y-1">
					<h3 class="text-xs tracking-[0.18em] text-(--color-accent) uppercase">What it does</h3>
					<p class="text-(--color-muted)">{currentTool.description}</p>
				</div>
				<div class="space-y-1">
					<h3 class="text-xs tracking-[0.18em] text-(--color-accent) uppercase">Input</h3>
					<p class="text-(--color-muted)">{currentTool.inputDescription}</p>
				</div>
				<div class="space-y-1">
					<h3 class="text-xs tracking-[0.18em] text-(--color-accent) uppercase">Output</h3>
					<p class="text-(--color-muted)">{currentTool.outputDescription}</p>
				</div>
				<div class="space-y-1">
					<h3 class="text-xs tracking-[0.18em] text-(--color-accent) uppercase">Privacy</h3>
					<p class="text-(--color-muted)">{currentTool.privacyDescription}</p>
				</div>
			</div>

			<div class="flex flex-wrap gap-2">
				{#each currentTool.useCases as useCase}
					<span class="tag">{useCase}</span>
				{/each}
			</div>
		</div>
	</section>
{/if}
