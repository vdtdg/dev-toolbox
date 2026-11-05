<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';
	let originalText = '';
	let modifiedText = '';
	let diffLines = [];
	let patchText = '';
	let stats = { added: 0, removed: 0, unchanged: 0 };

	const buildDiff = (oldText, newText) => {
		const oldLines = oldText.split(/\n/);
		const newLines = newText.split(/\n/);
		const rows = oldLines.length + 1;
		const cols = newLines.length + 1;
		const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

		for (let i = rows - 2; i >= 0; i -= 1) {
			for (let j = cols - 2; j >= 0; j -= 1) {
				if (oldLines[i] === newLines[j]) {
					dp[i][j] = dp[i + 1][j + 1] + 1;
				} else {
					dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
				}
			}
		}

		const result = [];
		let i = 0;
		let j = 0;
		while (i < oldLines.length && j < newLines.length) {
			if (oldLines[i] === newLines[j]) {
				result.push({ type: 'context', value: oldLines[i] });
				i += 1;
				j += 1;
			} else if (dp[i + 1][j] >= dp[i][j + 1]) {
				result.push({ type: 'remove', value: oldLines[i] });
				i += 1;
			} else {
				result.push({ type: 'add', value: newLines[j] });
				j += 1;
			}
		}
		while (i < oldLines.length) {
			result.push({ type: 'remove', value: oldLines[i] });
			i += 1;
		}
		while (j < newLines.length) {
			result.push({ type: 'add', value: newLines[j] });
			j += 1;
		}

		return result;
	};

	const buildPatch = (diff) => {
		const header = ['--- original', '+++ modified'];
		const body = diff
			.filter((line) => line.type === 'add' || line.type === 'remove')
			.map((line) => (line.type === 'add' ? `+${line.value}` : `-${line.value}`));
		return [...header, ...body].join('\n');
	};

	const updateDiff = () => {
		const diff = buildDiff(originalText, modifiedText);
		diffLines = diff.map((line, index) => ({
			...line,
			lineNumber: index + 1
		}));
		patchText = buildPatch(diff);
		stats = diff.reduce(
			(acc, line) => {
				if (line.type === 'add') acc.added += 1;
				else if (line.type === 'remove') acc.removed += 1;
				else acc.unchanged += 1;
				return acc;
			},
			{ added: 0, removed: 0, unchanged: 0 }
		);
	};

	$: (originalText, modifiedText, updateDiff());

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/diff-viewer/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/diff-viewer/`;
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
			<h1 class="text-3xl font-semibold">File Diff + Patch Viewer</h1>
			<p class="text-sm text-(--color-muted)">
				Paste two versions to see a unified diff and patch preview.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Original</span>
					<textarea
						class="search-input min-h-50 resize-y"
						placeholder="Paste original file"
						bind:value={originalText}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Modified</span>
					<textarea
						class="search-input min-h-50 resize-y"
						placeholder="Paste modified file"
						bind:value={modifiedText}
					></textarea>
				</label>
			</div>

			<div class="flex flex-wrap items-center gap-3 text-xs text-(--color-muted)">
				<span>+{stats.added} added</span>
				<span>-{stats.removed} removed</span>
				<span>{stats.unchanged} unchanged</span>
			</div>

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Diff</p>
					<ul class="mt-3 space-y-1 font-mono text-xs">
						{#each diffLines as line (line.type + ':' + line.lineNumber)}
							<li
								class={line.type === 'add'
									? 'text-(var(--color-accent)]'
									: line.type === 'remove'
										? 'text-(var(--color-danger)]'
										: 'text-(var(--color-text)]'}
							>
								<span class="text-(--color-muted)">{line.lineNumber}</span>
								<span class="px-2"
									>{line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}</span
								>
								<span>{line.value}</span>
							</li>
						{/each}
					</ul>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Patch</p>
					<textarea class="search-input mt-3 min-h-60 resize-y font-mono" readonly value={patchText}
					></textarea>
				</div>
			</div>
		</section>
	</div>
</div>
