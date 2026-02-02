<script>
	import { base } from '$app/paths';
	import { categories, tools } from '$lib/tools/catalog.js';

	const basePath = base || '';
	let query = '';
	let activeCategory = 'all';

	const categoryCounts = tools.reduce((accumulator, tool) => {
		accumulator[tool.category] = (accumulator[tool.category] || 0) + 1;
		return accumulator;
	}, {});

	$: normalizedQuery = query.trim().toLowerCase();
	$: filteredTools = tools.filter((tool) => {
		const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
		const matchesQuery =
			!normalizedQuery ||
			tool.name.toLowerCase().includes(normalizedQuery) ||
			tool.description.toLowerCase().includes(normalizedQuery) ||
			tool.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
		return matchesCategory && matchesQuery;
	});
</script>

<svelte:head>
	<title>Dev Toolbox</title>
	<meta name="description" content="Offline-first developer utilities." />
</svelte:head>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-390 flex-col gap-8 px-6 py-8">
		<main class="space-y-6">
			<header class="space-y-5">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p class="text-xs tracking-[0.32em] text-[var(--color-muted)] uppercase">
							Offline developer utilities
						</p>
						<h1 class="mt-2 text-3xl font-semibold md:text-4xl">Dev Toolbox</h1>
						<p class="mt-2 max-w-xl text-sm text-[var(--color-muted)]">
							Fast, local tools for encoding, security, and daily engineering workflows.
						</p>
					</div>
				</div>
			</header>

			<section class="panel space-y-3 p-5">
				<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
					<div>
						<h2 class="text-lg font-semibold">Tool Registry</h2>
						<p class="text-sm text-[var(--color-muted)]">Search by name, capability, or tag.</p>
					</div>
					<div class="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
						<div class="w-full sm:w-55 sm:flex-none">
							<label class="sr-only" for="category-select">Category</label>
							<select
								id="category-select"
								class="select-input"
								bind:value={activeCategory}
								aria-label="Filter by category"
							>
								{#each categories as category}
									<option value={category.id}>
										{category.label}
										({category.id === 'all' ? tools.length : categoryCounts[category.id] || 0})
									</option>
								{/each}
							</select>
						</div>
						<div class="w-full sm:min-w-75 sm:flex-1 xl:min-w-105">
							<input
								type="search"
								class="search-input"
								placeholder="Search tools..."
								bind:value={query}
								aria-label="Search tools"
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
					<span>
						{filteredTools.length} result{filteredTools.length === 1 ? '' : 's'}
					</span>
					<span class="tag">Total tools: {tools.length}</span>
					<span class="tag"
						>Category: {categories.find((category) => category.id === activeCategory)?.label}</span
					>
				</div>
			</section>

			<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each filteredTools as tool}
					{#if tool.route}
						<a
							class="tool-card block"
							href={`${basePath}${tool.route}`}
							aria-label={`Open ${tool.name}`}
						>
							<div>
								<h3 class="text-lg font-semibold">{tool.name}</h3>
								<p class="mt-2 text-sm text-[var(--color-muted)]">{tool.description}</p>
							</div>
							<p class="mt-4 text-xs text-[var(--color-muted)]">{tool.format}</p>
						</a>
					{:else}
						<article class="tool-card">
							<div>
								<h3 class="text-lg font-semibold">{tool.name}</h3>
								<p class="mt-2 text-sm text-[var(--color-muted)]">{tool.description}</p>
							</div>
							<p class="mt-4 text-xs text-[var(--color-muted)]">{tool.format}</p>
						</article>
					{/if}
				{/each}
			</section>

			{#if filteredTools.length === 0}
				<section class="panel p-6 text-sm text-[var(--color-muted)]">
					No tools match this filter yet. Clear the query or switch categories.
				</section>
			{/if}

			<footer class="panel panel-muted px-5 py-4 text-xs text-[var(--color-muted)]">
				<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<span>All tools run locally in your browser. No data is sent to a server.</span>
					<span>
						Made by
						<a class="text-[var(--color-accent)] hover:underline" href="https://dtdg.fr">
							Valérian de Thézan de Gaussan
						</a>. Code is open-sourced on
						<a
							class="text-[var(--color-accent)] hover:underline"
							href="https://github.com/vdtdg/dev-toolbox"
						>
							GitHub
						</a>; contributions welcome.
					</span>
				</div>
			</footer>
		</main>
	</div>
</div>
