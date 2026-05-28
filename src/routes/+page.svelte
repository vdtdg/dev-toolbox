<script>
	import { base } from '$app/paths';
	import {
		AlarmClock,
		ArrowLeftRight,
		BadgeCheck,
		Binary,
		BookOpenText,
		Calculator,
		CalendarClock,
		CaseSensitive,
		Clock3,
		CodeXml,
		Contrast,
		FileImage,
		FileText,
		FingerprintPattern,
		GitCompare,
		Globe,
		Hash,
		Hourglass,
		IdCard,
		Image,
		KeyRound,
		Link,
		Network,
		Palette,
		PenLine,
		Pipette,
		QrCode,
		Regex,
		ScrollText,
		Search,
		Shield,
		Table,
		Terminal,
		Wrench
	} from 'lucide-svelte';
	import { categories, tools } from '$lib/tools/catalog.js';

	const basePath = base || '';
	let query = '';
	let activeCategory = 'all';
	const toolCategories = categories.filter((category) => category.id !== 'all');
	const toolIcons = {
		pomodoro: AlarmClock,
		'cron-visualizer': CalendarClock,
		levenshtein: ArrowLeftRight,
		'uri-encoder': Link,
		'html-encoder': CodeXml,
		'base64-encoder': Binary,
		'md5-hasher': Hash,
		'sha1-hasher': Hash,
		'sha256-hasher': Hash,
		'sha512-hasher': Hash,
		'ripemd160-hasher': Hash,
		'jwt-helper': KeyRound,
		'hash-verifier': BadgeCheck,
		'hmac-generator': PenLine,
		'ssh-key-fingerprint': FingerprintPattern,
		'tls-cert-decoder': ScrollText,
		'timestamp-to-time': Clock3,
		'timezone-converter': Globe,
		'relative-time': Hourglass,
		'base-converter': Calculator,
		'ipv4-helper': Network,
		'binary-helper': Binary,
		'unix-permissions': Shield,
		'image-helper': Image,
		'color-picker': Pipette,
		'color-shades': Palette,
		'qr-code': QrCode,
		'color-contrast': Contrast,
		'image-metadata': FileImage,
		'url-parser': Search,
		'openapi-viewer': BookOpenText,
		'ascii-table': Table,
		'vim-help': Terminal,
		'diff-viewer': GitCompare,
		'lorem-ipsum': FileText,
		'json-formatter': Binary,
		'yaml-json-converter': ArrowLeftRight,
		'csv-json-converter': ArrowLeftRight,
		'xml-formatter': CodeXml,
		'id-generator': IdCard,
		'regex-tester': Regex,
		'text-case': CaseSensitive,
		'base-n-encoders': Binary
	};

	const categoryCounts = tools.reduce((accumulator, tool) => {
		accumulator[tool.category] = (accumulator[tool.category] || 0) + 1;
		return accumulator;
	}, {});

	$: normalizedQuery = query.trim().toLowerCase();
	$: filteredByQuery = tools.filter((tool) => {
		const matchesQuery =
			!normalizedQuery ||
			tool.name.toLowerCase().includes(normalizedQuery) ||
			tool.description.toLowerCase().includes(normalizedQuery) ||
			tool.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
		return matchesQuery;
	});
	$: visibleCategories = toolCategories.filter(
		(category) => activeCategory === 'all' || category.id === activeCategory
	);
	$: groupedTools = visibleCategories
		.map((category) => ({
			category,
			tools: filteredByQuery.filter((tool) => tool.category === category.id)
		}))
		.filter((group) => group.tools.length > 0);
	$: filteredCount = groupedTools.reduce((count, group) => count + group.tools.length, 0);
	const toolIcon = (toolId) => toolIcons[toolId] || Wrench;
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
						<p class="text-xs tracking-[0.32em] text-(--color-muted) uppercase">
							Offline developer utilities
						</p>
						<h1 class="mt-2 text-3xl font-semibold md:text-4xl">Dev Toolbox</h1>
						<p class="mt-2 max-w-xl text-sm text-(--color-muted)">
							Fast, local tools for encoding, security, and daily workflows.
						</p>
					</div>
				</div>
			</header>

			<section class="panel space-y-3 p-5">
				<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
					<div>
						<h2 class="text-lg font-semibold">Tool Registry</h2>
						<p class="text-sm text-(--color-muted)">Search by name, capability, or tag.</p>
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
								{#each categories as category (category.id)}
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
				<div class="flex flex-wrap items-center gap-2 text-xs text-(--color-muted)">
					<span>
						{filteredCount} result{filteredCount === 1 ? '' : 's'}
					</span>
					<span class="tag">Total tools: {tools.length}</span>
					<span class="tag"
						>Category: {categories.find((category) => category.id === activeCategory)?.label}</span
					>
				</div>
			</section>

			{#if groupedTools.length === 0}
				<section class="panel p-6 text-sm text-(--color-muted)">
					No tools match this filter yet. Clear the query or switch categories.
				</section>
			{:else}
				{#each groupedTools as group (group.category.id)}
					<section class="space-y-3">
						<div class="flex items-center justify-between gap-3">
							<div>
								<h3 class="text-base font-semibold">{group.category.label}</h3>
								<p class="text-xs text-(--color-muted)">{group.category.description}</p>
							</div>
							<span class="tag">{group.tools.length}</span>
						</div>
						<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
							{#each group.tools as tool (tool.id)}
								{#if tool.route}
									<a
										class="tool-card block"
										href={`${basePath}${tool.route}`}
										aria-label={`Open ${tool.name}`}
									>
										<div>
											<div class="flex items-center gap-2">
												<span
													class="inline-flex h-7 min-w-7 items-center justify-center rounded border border-(--color-border) bg-(--color-elevated) px-1 text-xs font-semibold text-(--color-accent)"
													aria-hidden="true"
												>
													<svelte:component this={toolIcon(tool.id)} class="h-4 w-4" />
												</span>
												<h4 class="text-lg font-semibold">{tool.name}</h4>
											</div>
											<p class="mt-2 text-sm text-(--color-muted)">{tool.description}</p>
										</div>
										<p class="mt-4 text-xs text-(--color-muted)">{tool.format}</p>
									</a>
								{:else}
									<article class="tool-card">
										<div>
											<div class="flex items-center gap-2">
												<span
													class="inline-flex h-7 min-w-7 items-center justify-center rounded border border-(--color-border) bg-(--color-elevated) px-1 text-xs font-semibold text-(--color-accent)"
													aria-hidden="true"
												>
													<svelte:component this={toolIcon(tool.id)} class="h-4 w-4" />
												</span>
												<h4 class="text-lg font-semibold">{tool.name}</h4>
											</div>
											<p class="mt-2 text-sm text-(--color-muted)">{tool.description}</p>
										</div>
										<p class="mt-4 text-xs text-(--color-muted)">{tool.format}</p>
									</article>
								{/if}
							{/each}
						</div>
					</section>
				{/each}
			{/if}

			<footer class="panel panel-muted px-5 py-4 text-xs text-(--color-muted)">
				<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<span>All tools run locally in your browser. No data is sent to a server.</span>
					<span>
						Made by
						<a class="text-(var(--color-accent)] hover:underline" href="https://dtdg.fr">
							Valérian de Thézan de Gaussan
						</a>. Code is open-sourced on
						<a
							class="text-(var(--color-accent)] hover:underline"
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
