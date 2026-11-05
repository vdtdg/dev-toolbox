<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';
	const timeZones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC'];
	const defaultZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

	let sourceZone = defaultZone;
	let targetZone = 'UTC';
	let dateTime = '';
	let outputValue = '';
	let errorMessage = '';

	const isValidZone = (zone) => timeZones.includes(zone);

	const getTimeZoneOffset = (date, timeZone) => {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).formatToParts(date);
		const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
		const asUTC = Date.UTC(
			Number(values.year),
			Number(values.month) - 1,
			Number(values.day),
			Number(values.hour),
			Number(values.minute),
			Number(values.second)
		);
		return (asUTC - date.getTime()) / 60000;
	};

	const getDateFromZone = (value, timeZone) => {
		const [datePart, timePart] = value.split('T');
		if (!datePart || !timePart) return null;
		const [year, month, day] = datePart.split('-').map(Number);
		const [hour, minute] = timePart.split(':').map(Number);
		if ([year, month, day, hour, minute].some((num) => Number.isNaN(num))) return null;
		const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
		const offset = getTimeZoneOffset(utcDate, timeZone);
		return new Date(utcDate.getTime() - offset * 60000);
	};

	const formatDateTime = (date, timeZone) =>
		new Intl.DateTimeFormat(undefined, {
			timeZone,
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);

	const transform = () => {
		errorMessage = '';
		outputValue = '';
		if (!dateTime) return;
		if (!isValidZone(sourceZone) || !isValidZone(targetZone)) {
			errorMessage = 'Select a valid timezone from the list.';
			return;
		}
		const date = getDateFromZone(dateTime, sourceZone);
		if (!date) {
			errorMessage = 'Invalid date/time value.';
			return;
		}
		outputValue = formatDateTime(date, targetZone);
	};

	$: (dateTime, sourceZone, targetZone, transform());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/timezone/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/timezone/`;
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
			<h1 class="text-3xl font-semibold">Timezone Converter</h1>
			<p class="text-sm text-(--color-muted)">Convert a local time from one timezone to another.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-3">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Date and time</span>
					<input type="datetime-local" class="search-input" bind:value={dateTime} />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">From</span>
					<input
						class="search-input"
						list="timezone-options"
						placeholder="Start typing a timezone"
						bind:value={sourceZone}
					/>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">To</span>
					<input
						class="search-input"
						list="timezone-options"
						placeholder="Start typing a timezone"
						bind:value={targetZone}
					/>
				</label>
			</div>

			<datalist id="timezone-options">
				{#each timeZones as zone (zone)}
					<option value={zone}></option>
				{/each}
			</datalist>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="panel panel-muted p-5">
				<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Converted</p>
				<p class="mt-2 font-mono text-sm">{outputValue || '--'}</p>
			</div>
		</section>
	</div>
</div>
