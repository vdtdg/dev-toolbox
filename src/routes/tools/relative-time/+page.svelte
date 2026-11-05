<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';
	let targetDate = '';
	let baseDate = '';
	let outputValue = '';
	let errorMessage = '';

	const parseDateTime = (value) => {
		if (!value) return null;
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? null : date;
	};

	const formatDuration = (seconds) => {
		const abs = Math.abs(seconds);
		const days = Math.floor(abs / 86400);
		const hours = Math.floor((abs % 86400) / 3600);
		const minutes = Math.floor((abs % 3600) / 60);
		const secs = Math.floor(abs % 60);
		return `${days}d ${hours}h ${minutes}m ${secs}s`;
	};

	const transform = () => {
		errorMessage = '';
		outputValue = '';
		const target = parseDateTime(targetDate);
		const base = baseDate ? parseDateTime(baseDate) : new Date();
		if (!target || !base) {
			if (targetDate) errorMessage = 'Invalid target date.';
			return;
		}
		const deltaSeconds = Math.round((target.getTime() - base.getTime()) / 1000);
		const human = formatDuration(deltaSeconds);
		outputValue =
			deltaSeconds === 0
				? 'now'
				: `${deltaSeconds > 0 ? 'in' : ''} ${human} ${deltaSeconds > 0 ? '' : 'ago'}`;
	};

	$: (targetDate, baseDate, transform());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/relative-time/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/relative-time/`;
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
			<h1 class="text-3xl font-semibold">Relative Time Calculator</h1>
			<p class="text-sm text-(--color-muted)">
				Measure a target date relative to now or a custom base.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Target date</span>
					<input type="datetime-local" class="search-input" bind:value={targetDate} />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Base date (optional)</span>
					<input type="datetime-local" class="search-input" bind:value={baseDate} />
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="panel panel-muted p-5">
				<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Result</p>
				<p class="mt-2 font-mono text-sm">{outputValue || '--'}</p>
			</div>
		</section>
	</div>
</div>
