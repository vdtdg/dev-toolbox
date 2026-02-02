<script>
	import { parse as parseYaml } from 'yaml';

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
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">OpenAPI / Swagger Viewer</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Paste a spec or upload a JSON/YAML file to preview endpoints.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Upload spec</span>
					<input
						type="file"
						accept=".json,.yaml,.yml"
						class="search-input"
						on:change={handleFile}
					/>
				</label>
				<div class="text-xs text-[var(--color-muted)]">{fileName || 'No file selected'}</div>
			</div>

			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">OpenAPI / Swagger</span>
				<textarea
					class="search-input min-h-[180px] resize-y font-mono"
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
						<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">API</p>
						<p class="mt-2 text-lg font-semibold">{specInfo.title}</p>
						<p class="text-xs text-[var(--color-muted)]">Version: {specInfo.version}</p>
					</div>
					{#if specInfo.description}
						<p class="text-xs text-[var(--color-muted)]">{specInfo.description}</p>
					{/if}
					{#if specInfo.servers.length}
						<div>
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Servers</p>
							<ul class="mt-2 space-y-1 font-mono text-xs">
								{#each specInfo.servers as server}
									<li>{server.url}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>

				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p class="text-xs text-[var(--color-muted)]">
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
					{#each filteredPaths as item}
						<div class="panel panel-muted p-4">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<p class="font-mono text-xs text-[var(--color-accent)]">{item.method}</p>
								<p class="font-mono text-xs">{item.path}</p>
							</div>
							{#if item.summary}
								<p class="mt-2 text-xs text-[var(--color-muted)]">{item.summary}</p>
							{/if}
							{#if item.tags.length}
								<p class="mt-2 text-xs text-[var(--color-muted)]">
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
