<script>
	let inputValue = '';
	let errorMessage = '';
	let parsedUrl = null;
	let queryRows = [];

	const parseUrl = () => {
		errorMessage = '';
		parsedUrl = null;
		queryRows = [];
		const raw = inputValue.trim();
		if (!raw) return;
		try {
			const url = raw.match(/^https?:\/\//i) ? new URL(raw) : new URL(`https://${raw}`);
			parsedUrl = {
				href: url.href,
				origin: url.origin,
				protocol: url.protocol.replace(':', ''),
				username: url.username || '--',
				password: url.password ? '••••••' : '--',
				host: url.host,
				hostname: url.hostname,
				port: url.port || (url.protocol === 'https:' ? '443' : '80'),
				pathname: url.pathname,
				search: url.search || '--',
				hash: url.hash || '--'
			};
			queryRows = Array.from(url.searchParams.entries()).map(([key, value]) => ({ key, value }));
		} catch (error) {
			errorMessage = 'Invalid URL.';
		}
	};

	$: (inputValue, parseUrl());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">URL Parser</h1>
			<p class="text-sm text-[var(--color-muted)]">Break URLs into structured components.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">URL</span>
				<input
					type="text"
					class="search-input"
					placeholder="https://user:pass@example.com:8443/path?query=1#section"
					bind:value={inputValue}
				/>
			</label>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Components</p>
					<ul class="mt-3 space-y-2 text-xs">
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Href</span>
							<span class="text-right font-mono break-all">{parsedUrl?.href || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Origin</span>
							<span class="text-right font-mono break-all">{parsedUrl?.origin || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Protocol</span>
							<span class="text-right font-mono break-all">{parsedUrl?.protocol || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Username</span>
							<span class="text-right font-mono break-all">{parsedUrl?.username || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Password</span>
							<span class="text-right font-mono break-all">{parsedUrl?.password || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Host</span>
							<span class="text-right font-mono break-all">{parsedUrl?.host || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Hostname</span>
							<span class="text-right font-mono break-all">{parsedUrl?.hostname || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Port</span>
							<span class="text-right font-mono break-all">{parsedUrl?.port || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Pathname</span>
							<span class="text-right font-mono break-all">{parsedUrl?.pathname || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Search</span>
							<span class="text-right font-mono break-all">{parsedUrl?.search || '--'}</span>
						</li>
						<li class="flex items-start justify-between gap-4">
							<span class="text-[var(--color-muted)]">Hash</span>
							<span class="text-right font-mono break-all">{parsedUrl?.hash || '--'}</span>
						</li>
					</ul>
				</div>

				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Query Params</p>
					{#if queryRows.length}
						<ul class="mt-3 space-y-2 text-xs">
							{#each queryRows as row}
								<li class="flex items-start justify-between gap-4">
									<span class="text-[var(--color-muted)]">{row.key}</span>
									<span class="text-right font-mono break-all">{row.value || '--'}</span>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="mt-2 text-xs text-[var(--color-muted)]">No query parameters.</p>
					{/if}
				</div>
			</div>
		</section>
	</div>
</div>
