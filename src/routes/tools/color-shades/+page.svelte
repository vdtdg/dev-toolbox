<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';
	let baseColor = '#52D6FF';
	let steps = 10;
	let palette = [];
	let errorMessage = '';

	const hexToRgb = (hex) => {
		const normalized = hex.replace('#', '');
		if (![3, 6].includes(normalized.length)) return null;
		const value =
			normalized.length === 3
				? normalized
						.split('')
						.map((char) => char + char)
						.join('')
				: normalized;
		const int = Number.parseInt(value, 16);
		if (Number.isNaN(int)) return null;
		return {
			r: (int >> 16) & 255,
			g: (int >> 8) & 255,
			b: int & 255
		};
	};

	const rgbToHex = ({ r, g, b }) =>
		`#${[r, g, b]
			.map((val) =>
				Math.max(0, Math.min(255, Math.round(val)))
					.toString(16)
					.padStart(2, '0')
			)
			.join('')}`.toUpperCase();

	const mix = (from, to, ratio) => ({
		r: from.r + (to.r - from.r) * ratio,
		g: from.g + (to.g - from.g) * ratio,
		b: from.b + (to.b - from.b) * ratio
	});

	const buildPalette = () => {
		errorMessage = '';
		palette = [];
		const rgb = hexToRgb(baseColor);
		if (!rgb) {
			errorMessage = 'Invalid hex value.';
			return;
		}
		const totalSteps = Math.max(3, Math.min(20, Number(steps) || 10));
		const midpoint = Math.floor(totalSteps / 2);
		const white = { r: 255, g: 255, b: 255 };
		const black = { r: 0, g: 0, b: 0 };

		palette = Array.from({ length: totalSteps }, (_, index) => {
			if (index === midpoint) return { value: rgbToHex(rgb), label: 'Base' };
			if (index < midpoint) {
				const ratio = (midpoint - index) / midpoint;
				return { value: rgbToHex(mix(rgb, white, ratio)), label: `Tint ${midpoint - index}` };
			}
			const ratio = (index - midpoint) / (totalSteps - midpoint - 1);
			return { value: rgbToHex(mix(rgb, black, ratio)), label: `Shade ${index - midpoint}` };
		});
	};

	$: (baseColor, steps, buildPalette());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/color-shades/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/color-shades/`;
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
			<h1 class="text-3xl font-semibold">Color Shades Generator</h1>
			<p class="text-sm text-(--color-muted)">Create tints and shades from a base color.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1fr_0.6fr]">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Base color</span>
					<input type="text" class="search-input" bind:value={baseColor} placeholder="#52D6FF" />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Steps</span>
					<input type="number" min="3" max="20" class="search-input" bind:value={steps} />
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
				{#each palette as swatch (swatch.label)}
					<div class="panel panel-muted p-4">
						<div
							class="border-(var(--color-border)] h-16 rounded-lg border"
							style={`background:${swatch.value};`}
						></div>
						<p class="mt-2 text-xs text-(--color-muted)">{swatch.label}</p>
						<p class="font-mono text-xs">{swatch.value}</p>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
