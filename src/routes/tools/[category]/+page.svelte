<script>
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();

	const canonicalBaseUrl = 'https://dtdg.fr/dev-toolbox';
	const basePath = base || '';

	let category = $derived(data.category);
	let categoryTools = $derived(data.categoryTools);
	let pageTitle = $derived(`${category.label} Developer Tools`);
	let pageDescription = $derived(
		`Offline ${category.label.toLowerCase()} developer tools that run locally in your browser. ${category.description}.`
	);
	let canonicalUrl = $derived(`${canonicalBaseUrl}/tools/${category.id}/`);
	let categoryJsonLd = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				name: pageTitle,
				url: canonicalUrl,
				description: pageDescription
			},
			{
				'@type': 'ItemList',
				name: `${category.label} tools`,
				itemListElement: categoryTools.map((tool, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: tool.name,
					url: `${canonicalBaseUrl}${tool.canonicalRoute}`
				}))
			}
		]
	});
</script>

<Seo title={pageTitle} description={pageDescription} {canonicalUrl} jsonLd={categoryJsonLd} />

<div class="min-h-screen">
	<div class="mx-auto flex max-w-390 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={basePath || '/'}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<p class="text-xs tracking-[0.32em] text-(--color-muted) uppercase">Tool category</p>
			<h1 class="text-3xl font-semibold">{category.label} Developer Tools</h1>
			<p class="max-w-2xl text-sm text-(--color-muted)">{pageDescription}</p>
		</header>

		<section class="panel space-y-4 p-5">
			<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 class="text-lg font-semibold">{category.label}</h2>
					<p class="text-sm text-(--color-muted)">{category.description}</p>
				</div>
				<span class="tag">{categoryTools.length} tools</span>
			</div>

			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each categoryTools as tool (tool.id)}
					<a
						class="tool-card block"
						href={`${basePath}${tool.route}`}
						aria-label={`Open ${tool.name}`}
					>
						<h3 class="text-lg font-semibold">{tool.name}</h3>
						<p class="mt-2 text-sm text-(--color-muted)">{tool.seoDescription}</p>
						<p class="mt-4 text-xs text-(--color-muted)">{tool.format}</p>
					</a>
				{/each}
			</div>
		</section>
	</div>
</div>
