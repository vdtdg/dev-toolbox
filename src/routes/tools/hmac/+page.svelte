<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';
	const algorithms = [
		{ id: 'SHA-256', label: 'SHA-256' },
		{ id: 'SHA-512', label: 'SHA-512' }
	];

	let algorithm = 'SHA-256';
	let message = '';
	let secret = '';
	let outputValue = '';
	let errorMessage = '';

	const toHex = (bytes) =>
		Array.from(bytes)
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

	const computeHmac = async () => {
		errorMessage = '';
		outputValue = '';
		if (!message || !secret) return;
		try {
			const encoder = new TextEncoder();
			const keyData = encoder.encode(secret);
			const key = await crypto.subtle.importKey(
				'raw',
				keyData,
				{ name: 'HMAC', hash: algorithm },
				false,
				['sign']
			);
			const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
			outputValue = toHex(new Uint8Array(signature));
		} catch (error) {
			errorMessage = 'Unable to compute HMAC in this browser.';
		}
	};

	$: (message, secret, algorithm, computeHmac());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/hmac/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/hmac/`;
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
			<h1 class="text-3xl font-semibold">HMAC Generator</h1>
			<p class="text-sm text-(--color-muted)">Generate HMAC signatures using SHA-256 or SHA-512.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-(--color-muted)" for="algorithm-select">Algorithm</label>
					<select id="algorithm-select" class="select-input" bind:value={algorithm}>
						{#each algorithms as item (item.id)}
							<option value={item.id}>{item.label}</option>
						{/each}
					</select>
				</div>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Message</span>
					<textarea
						class="search-input min-h-40 resize-y"
						placeholder="Message to sign"
						bind:value={message}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Secret</span>
					<input type="text" class="search-input" placeholder="Shared secret" bind:value={secret} />
				</label>
			</div>

			<div class="panel panel-muted p-5">
				<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Signature</p>
				<p class="mt-2 font-mono text-xs break-all">{outputValue || '--'}</p>
			</div>
		</section>
	</div>
</div>
