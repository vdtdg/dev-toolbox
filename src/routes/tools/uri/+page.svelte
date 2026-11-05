<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';
	const modes = [
		{ value: 'encode', label: 'Encode' },
		{ value: 'decode', label: 'Decode' }
	];

	let mode = 'encode';
	let inputValue = '';
	let outputValue = '';
	let errorMessage = '';

	const transform = () => {
		errorMessage = '';
		if (!inputValue) {
			outputValue = '';
			return;
		}
		try {
			outputValue =
				mode === 'encode' ? encodeURIComponent(inputValue) : decodeURIComponent(inputValue);
		} catch (error) {
			errorMessage = 'Invalid input for decoding.';
			outputValue = '';
		}
	};

	const swapDirection = () => {
		mode = mode === 'encode' ? 'decode' : 'encode';
		inputValue = outputValue || inputValue;
		transform();
	};

	$: (inputValue, mode, transform());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/uri/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/uri/`;
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
			<h1 class="text-3xl font-semibold">URI Encoder / Decoder</h1>
			<p class="text-sm text-(--color-muted)">Encode or decode URI components locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-(--color-muted)" for="mode-select">Mode</label>
					<select id="mode-select" class="select-input" bind:value={mode}>
						{#each modes as item (item.value)}
							<option value={item.value}>{item.label}</option>
						{/each}
					</select>
				</div>
				<button type="button" class="ghost-button" on:click={swapDirection}>
					Swap direction
				</button>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Input</span>
					<textarea
						class="search-input min-h-45 resize-y"
						placeholder="Paste text to encode or decode"
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Output</span>
					<textarea class="search-input min-h-45 resize-y" readonly value={outputValue}></textarea>
				</label>
			</div>
		</section>
	</div>
</div>
