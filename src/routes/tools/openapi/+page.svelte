<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';
	import { parse as parseYaml } from 'yaml';

	const homeHref = base || '/';

	let specValue = '';
	let specError = '';
	let specInfo = null;
	let specPaths = [];
	let search = '';
	let fileName = '';

	const normalizeSpec = (spec) => {
		const isSwagger2 = Boolean(spec.swagger);
		const info = spec.info || {};
		let servers = spec.servers || [];
		if (isSwagger2) {
			const schemes = spec.schemes || ['https'];
			const host = spec.host || '';
			const basePath = spec.basePath || '';
			servers = schemes.map((scheme) => ({
				url: host ? `${scheme}://${host}${basePath}` : basePath
			}));
		}

		const paths = spec.paths || {};
		const items = Object.entries(paths).flatMap(([path, ops]) => {
			if (!ops || typeof ops !== 'object') return [];
			return Object.entries(ops)
				.filter(([method]) =>
					['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)
				)
				.map(([method, details]) => ({
					path,
					method: method.toUpperCase(),
					summary: details?.summary || details?.operationId || '',
					description: details?.description || '',
					tags: details?.tags || []
				}));
		});

		return {
			title: info.title || 'Untitled API',
			version: info.version || '--',
			description: info.description || '',
			servers,
			items
		};
	};

	const parseSpec = () => {
		specError = '';
		specInfo = null;
		specPaths = [];
		if (!specValue.trim()) return;
		try {
			const raw = specValue.trim();
			let spec;
			try {
				spec = JSON.parse(raw);
			} catch (jsonError) {
				spec = parseYaml(raw);
			}
			const normalized = normalizeSpec(spec);
			specInfo = normalized;
			specPaths = normalized.items;
			if (!normalized.items.length) {
				specError = 'Parsed spec, but no paths were found.';
			}
		} catch (error) {
			specError = `Unable to parse OpenAPI/Swagger spec: ${error.message}`;
		}
	};

	const handleFile = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		fileName = file.name;
		specValue = await file.text();
	};

	const matchesSearch = (item, query) => {
		if (!query) return true;
		const normalized = query.toLowerCase();
		return (
			item.path.toLowerCase().includes(normalized) ||
			item.method.toLowerCase().includes(normalized) ||
			item.summary.toLowerCase().includes(normalized) ||
			item.tags.join(' ').toLowerCase().includes(normalized)
		);
	};

	$: (specValue, parseSpec());
	$: filteredPaths = specPaths.filter((item) => matchesSearch(item, search.trim()));

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/openapi/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/openapi/`;
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
			<h1 class="text-3xl font-semibold">OpenAPI / Swagger Viewer</h1>
			<p class="text-sm text-(--color-muted)">
				Paste a spec or upload a JSON/YAML file to preview endpoints.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Upload spec</span>
					<input
						type="file"
						accept=".json,.yaml,.yml"
						class="search-input"
						on:change={handleFile}
					/>
				</label>
				<div class="text-xs text-(--color-muted)">{fileName || 'No file selected'}</div>
			</div>

			<label class="space-y-2 text-sm">
				<span class="text-(--color-muted)">OpenAPI / Swagger</span>
				<textarea
					class="search-input min-h-45 resize-y font-mono"
					placeholder="Paste OpenAPI JSON or YAML"
					bind:value={specValue}
				></textarea>
			</label>

			{#if specError}
				<div class="alert alert-danger">{specError}</div>
			{/if}

			{#if specInfo}
				<div class="panel panel-muted space-y-4 p-5">
					<div>
						<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">API</p>
						<p class="mt-2 text-lg font-semibold">{specInfo.title}</p>
						<p class="text-xs text-(--color-muted)">Version: {specInfo.version}</p>
					</div>
					{#if specInfo.description}
						<p class="text-xs text-(--color-muted)">{specInfo.description}</p>
					{/if}
					{#if specInfo.servers.length}
						<div>
							<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Servers</p>
							<ul class="mt-2 space-y-1 font-mono text-xs">
								{#each specInfo.servers as server (server.url)}
									<li>{server.url}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>

				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p class="text-xs text-(--color-muted)">
						{filteredPaths.length} endpoint{filteredPaths.length === 1 ? '' : 's'}
					</p>
					<div class="w-full sm:w-80">
						<input
							type="search"
							class="search-input"
							placeholder="Filter by path, method, tag"
							bind:value={search}
						/>
					</div>
				</div>

				<div class="space-y-3">
					{#each filteredPaths as item (item.method + ' ' + item.path)}
						<div class="panel panel-muted p-4">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<p class="text-(var(--color-accent)] font-mono text-xs">{item.method}</p>
								<p class="font-mono text-xs">{item.path}</p>
							</div>
							{#if item.summary}
								<p class="mt-2 text-xs text-(--color-muted)">{item.summary}</p>
							{/if}
							{#if item.tags.length}
								<p class="mt-2 text-xs text-(--color-muted)">
									Tags: {item.tags.join(', ')}
								</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>
