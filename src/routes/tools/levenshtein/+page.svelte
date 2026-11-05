<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';
	const computeDistance = (source, target) => {
		const sourceLength = source.length;
		const targetLength = target.length;
		if (sourceLength === 0) return targetLength;
		if (targetLength === 0) return sourceLength;

		const prevRow = new Array(targetLength + 1).fill(0);
		const currRow = new Array(targetLength + 1).fill(0);

		for (let j = 0; j <= targetLength; j += 1) {
			prevRow[j] = j;
		}

		for (let i = 1; i <= sourceLength; i += 1) {
			currRow[0] = i;
			const sourceChar = source[i - 1];
			for (let j = 1; j <= targetLength; j += 1) {
				const cost = sourceChar === target[j - 1] ? 0 : 1;
				currRow[j] = Math.min(prevRow[j] + 1, currRow[j - 1] + 1, prevRow[j - 1] + cost);
			}
			for (let j = 0; j <= targetLength; j += 1) {
				prevRow[j] = currRow[j];
			}
		}

		return prevRow[targetLength];
	};

	let leftText = '';
	let rightText = '';
	let ignoreCase = true;

	$: normalizedLeft = ignoreCase ? leftText.toLowerCase() : leftText;
	$: normalizedRight = ignoreCase ? rightText.toLowerCase() : rightText;
	$: distance = computeDistance(normalizedLeft, normalizedRight);
	$: maxLength = Math.max(normalizedLeft.length, normalizedRight.length);
	$: similarity = maxLength === 0 ? 100 : Math.max(0, (1 - distance / maxLength) * 100);
	$: leftCount = leftText.length;
	$: rightCount = rightText.length;

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/levenshtein/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/levenshtein/`;
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
			<h1 class="text-3xl font-semibold">Levenshtein Distance Calculator</h1>
			<p class="text-sm text-(--color-muted)">
				Compute edit distance and similarity between two strings locally.
			</p>
		</header>

		<section class="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
			<div class="panel space-y-4 p-6">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<h2 class="text-lg font-semibold">Input</h2>
					<label class="flex items-center gap-2 text-xs text-(--color-muted)">
						<input type="checkbox" class="rounded" bind:checked={ignoreCase} />
						Ignore case
					</label>
				</div>
				<div class="grid gap-4 lg:grid-cols-2">
					<label class="space-y-2 text-sm">
						<span class="text-(--color-muted)">Left string</span>
						<textarea
							class="search-input min-h-45 resize-y"
							placeholder="First string"
							bind:value={leftText}
						></textarea>
						<span class="text-xs text-(--color-muted)">{leftCount} characters</span>
					</label>
					<label class="space-y-2 text-sm">
						<span class="text-(--color-muted)">Right string</span>
						<textarea
							class="search-input min-h-45 resize-y"
							placeholder="Second string"
							bind:value={rightText}
						></textarea>
						<span class="text-xs text-(--color-muted)">{rightCount} characters</span>
					</label>
				</div>
			</div>

			<div class="panel space-y-4 p-6">
				<h2 class="text-lg font-semibold">Results</h2>
				<div class="panel panel-muted space-y-4 p-5">
					<div>
						<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Distance</p>
						<p class="mt-2 text-3xl font-semibold">{distance}</p>
					</div>
					<div>
						<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Similarity</p>
						<p class="mt-2 text-2xl font-semibold">{similarity.toFixed(1)}%</p>
					</div>
					<div class="progress-track">
						<div
							class="progress-fill"
							style={`width: ${Math.min(100, Math.max(0, similarity))}%`}
						></div>
					</div>
					<p class="text-xs text-(--color-muted)">
						Based on max length of {maxLength} characters.
					</p>
				</div>
				<div
					class="border-(var(--color-border)] rounded-xl border bg-[rgba(10,14,20,0.6)] p-4 text-xs text-(--color-muted)"
				>
					Levenshtein distance counts insertions, deletions, and substitutions needed to transform
					one string into another.
				</div>
			</div>
		</section>
	</div>
</div>
