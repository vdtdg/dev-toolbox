<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';
	import QRCode from 'qrcode';

	const homeHref = base || '/';

	let text = 'https://dtdg.fr';
	let size = 256;
	let errorMessage = '';
	let dataUrl = '';

	const generateQr = async () => {
		errorMessage = '';
		if (!text.trim()) {
			dataUrl = '';
			return;
		}
		try {
			dataUrl = await QRCode.toDataURL(text, {
				width: Number(size) || 256,
				margin: 2,
				color: {
					dark: '#0A0D12',
					light: '#F5F8FB'
				}
			});
		} catch (error) {
			errorMessage = 'Unable to generate QR code.';
			dataUrl = '';
		}
	};

	$: (text, size, generateQr());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/qr/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/qr/`;
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
			<h1 class="text-3xl font-semibold">QR Code Generator</h1>
			<p class="text-sm text-(--color-muted)">Generate QR codes from text or URLs.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-(--color-muted)">Content</span>
				<textarea
					class="search-input min-h-30 resize-y"
					placeholder="Paste text or a URL"
					bind:value={text}
				></textarea>
			</label>

			<div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Size (px)</span>
					<input type="number" min="128" max="512" class="search-input" bind:value={size} />
				</label>
				{#if dataUrl}
					<a class="ghost-button" href={dataUrl} download="qrcode.png">Download PNG</a>
				{/if}
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			{#if dataUrl}
				<div class="panel panel-muted flex items-center justify-center p-6">
					<img src={dataUrl} alt="QR code" class="h-auto max-w-full" />
				</div>
			{:else}
				<div class="panel panel-muted p-6 text-sm text-(--color-muted)">
					Enter text to generate a QR code.
				</div>
			{/if}
		</section>
	</div>
</div>
