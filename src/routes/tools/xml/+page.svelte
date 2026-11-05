<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import formatXml from 'xml-formatter';
	import { base as basePath } from '$app/paths';

	const homeHref = basePath ? `${basePath}/` : '/';

	const minifyXml = (value) => value.replace(/>\s+</g, '><').trim();

	let inputValue = '';
	let outputValue = '';
	let xpathQuery = '';
	let xpathResult = '';
	let errorMessage = '';

	const parseXml = () => {
		errorMessage = '';
		outputValue = '';
		xpathResult = '';
		if (!inputValue.trim()) return null;
		try {
			const parser = new DOMParser();
			const doc = parser.parseFromString(inputValue, 'application/xml');
			const parseError = doc.querySelector('parsererror');
			if (parseError) {
				errorMessage = 'Invalid XML input.';
				return null;
			}
			outputValue = formatXml(inputValue, { indentation: '  ' });
			return doc;
		} catch (error) {
			errorMessage = 'Invalid XML input.';
			return null;
		}
	};

	const runXpath = (doc) => {
		if (!doc) return;
		if (!xpathQuery.trim()) {
			xpathResult = '';
			return;
		}
		try {
			const resolver = doc.createNSResolver(doc.documentElement || doc);
			const results = [];
			const snapshot = doc.evaluate(xpathQuery, doc, resolver, XPathResult.ANY_TYPE, null);
			let node = snapshot.iterateNext();
			while (node) {
				if (node.nodeType === Node.ATTRIBUTE_NODE) {
					results.push(`${node.name}="${node.value}"`);
				} else if (node.nodeType === Node.TEXT_NODE) {
					results.push(node.textContent?.trim() || '');
				} else {
					results.push(node.outerHTML || node.textContent || '');
				}
				node = snapshot.iterateNext();
			}
			xpathResult = results.length ? results.join('\n') : 'No matches.';
		} catch (error) {
			xpathResult = 'Invalid XPath query.';
		}
	};

	const applyMinify = () => {
		const doc = parseXml();
		if (!doc) return;
		outputValue = minifyXml(inputValue);
	};

	const applyFormat = () => {
		const doc = parseXml();
		if (!doc) return;
		outputValue = formatXml(inputValue, { indentation: '  ' });
	};

	$: (inputValue,
		xpathQuery,
		(() => {
			const doc = parseXml();
			runXpath(doc);
		})());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/xml/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/xml/`;
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
			<h1 class="text-3xl font-semibold">XML Formatter + XPath</h1>
			<p class="text-sm text-(--color-muted)">Format, minify, and query XML locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Input XML</span>
					<textarea
						class="search-input min-h-55 resize-y font-mono"
						placeholder="Paste XML"
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
						<span class="text-(--color-muted)">XPath query</span>
						<input
							type="text"
							class="search-input"
							placeholder="/catalog/book[1]/title"
							bind:value={xpathQuery}
						/>
					</label>
					<div class="text-xs text-(--color-muted)">Results update live as you type.</div>
				</div>
				<textarea class="search-input min-h-40 resize-y font-mono" readonly value={xpathResult}
				></textarea>
			</div>
		</section>
	</div>
</div>
