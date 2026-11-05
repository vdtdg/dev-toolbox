<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';
	import { JSONPath } from 'jsonpath-plus';

	const homeHref = base || '/';

	let inputValue = '';
	let outputValue = '';
	let pathQuery = '$';
	let pathResult = '';
	let errorMessage = '';

	const formatJson = (value, indent = 2) => JSON.stringify(value, null, indent);
	const minifyJson = (value) => JSON.stringify(value);

	const parseJson = () => {
		errorMessage = '';
		outputValue = '';
		pathResult = '';
		if (!inputValue.trim()) return null;
		try {
			const parsed = JSON.parse(inputValue);
			outputValue = formatJson(parsed, 2);
			return parsed;
		} catch (error) {
			errorMessage = 'Invalid JSON input.';
			return null;
		}
	};

	const runJsonPath = (data) => {
		if (!data) return;
		if (!pathQuery.trim()) {
			pathResult = '';
			return;
		}
		try {
			const result = JSONPath({ path: pathQuery, json: data });
			pathResult = formatJson(result, 2);
		} catch (error) {
			pathResult = 'Invalid JSONPath query.';
		}
	};

	const applyMinify = () => {
		const parsed = parseJson();
		if (!parsed) return;
		outputValue = minifyJson(parsed);
	};

	const applyFormat = () => {
		const parsed = parseJson();
		if (!parsed) return;
		outputValue = formatJson(parsed, 2);
	};

	$: (inputValue,
		pathQuery,
		(() => {
			const parsed = parseJson();
			runJsonPath(parsed);
		})());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/json/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/json/`;
	const toolJsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebApplication',
				name: tool.name,
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Any',
				url: canonicalUrl,
				description: tool.seoDescription,
				keywords: tool.keywords.join(', '),
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Dev Toolbox',
						item: 'https://dtdg.fr/dev-toolbox/'
					},
					{ '@type': 'ListItem', position: 2, name: tool.name, item: canonicalUrl }
				]
			}
		]
	};
</script>

<Seo
	title={tool.seoTitle}
	description={tool.seoDescription}
	{canonicalUrl}
	keywords={tool.keywords.join(', ')}
	jsonLd={toolJsonLd}
/>

<section class="panel space-y-3 p-5">
	<h2 class="text-lg font-semibold">About this tool</h2>
	<p class="text-sm text-(--color-muted)">{tool.description}</p>
	<dl class="grid gap-3 text-sm sm:grid-cols-2">
		<div>
			<dt class="font-medium">Input</dt>
			<dd class="text-(--color-muted)">{tool.inputDescription}</dd>
		</div>
		<div>
			<dt class="font-medium">Output</dt>
			<dd class="text-(--color-muted)">{tool.outputDescription}</dd>
		</div>
		<div>
			<dt class="font-medium">Use cases</dt>
			<dd class="text-(--color-muted)">{tool.useCases.join(' ')}</dd>
		</div>
		<div>
			<dt class="font-medium">Privacy</dt>
			<dd class="text-(--color-muted)">{tool.privacyDescription}</dd>
		</div>
	</dl>
</section>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">JSON Formatter + JSONPath</h1>
			<p class="text-sm text-(--color-muted)">Format, minify, and query JSON locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Input JSON</span>
					<textarea
						class="search-input min-h-55 resize-y font-mono"
						placeholder="Paste JSON"
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Output</span>
					<textarea class="search-input min-h-55 resize-y font-mono" readonly value={outputValue}
					></textarea>
				</label>
			</div>

			<div class="flex flex-wrap gap-2">
				<button type="button" class="ghost-button" on:click={applyFormat}>Format</button>
				<button type="button" class="ghost-button" on:click={applyMinify}>Minify</button>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="panel panel-muted space-y-4 p-5">
				<div class="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
					<label class="space-y-2 text-sm">
						<span class="text-(--color-muted)">JSONPath query</span>
						<input
							type="text"
							class="search-input"
							placeholder="$.store.book[*].title"
							bind:value={pathQuery}
						/>
					</label>
					<div class="text-xs text-(--color-muted)">Results update live as you type.</div>
				</div>
				<textarea class="search-input min-h-40 resize-y font-mono" readonly value={pathResult}
				></textarea>
			</div>
		</section>
	</div>
</div>
