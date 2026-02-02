<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	let pattern = '';
	let flags = 'g';
	let testText = '';
	let errorMessage = '';
	let matches = [];
	let highlighted = '';

	const escapeHtml = (value) =>
		value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

	const buildRegex = () => {
		if (!pattern) return null;
		return new RegExp(pattern, flags);
	};

	const updateMatches = () => {
		errorMessage = '';
		matches = [];
		highlighted = '';
		if (!pattern || !testText) {
			highlighted = escapeHtml(testText);
			return;
		}
		try {
			const regex = buildRegex();
			if (!regex) return;
			let match;
			const ranges = [];
			const text = testText;
			if (!regex.global) {
				match = regex.exec(text);
				if (match) {
					matches.push({
						index: match.index,
						match: match[0],
						groups: match.slice(1)
					});
					ranges.push([match.index, match.index + match[0].length]);
				}
			} else {
				while ((match = regex.exec(text)) !== null) {
					matches.push({
						index: match.index,
						match: match[0],
						groups: match.slice(1)
					});
					ranges.push([match.index, match.index + match[0].length]);
					if (match[0].length === 0) {
						regex.lastIndex += 1;
					}
				}
			}

			let result = '';
			let lastIndex = 0;
			for (const [start, end] of ranges) {
				result += escapeHtml(text.slice(lastIndex, start));
				result += `<mark>${escapeHtml(text.slice(start, end))}</mark>`;
				lastIndex = end;
			}
			result += escapeHtml(text.slice(lastIndex));
			highlighted = result;
		} catch (error) {
			errorMessage = error.message;
			highlighted = escapeHtml(testText);
		}
	};

	$: (pattern, flags, testText, updateMatches());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Regex Tester</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Test patterns, highlight matches, and inspect capture groups.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Pattern</span>
					<input type="text" class="search-input" placeholder="[A-Z]+" bind:value={pattern} />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Flags</span>
					<input type="text" class="search-input" placeholder="gim" bind:value={flags} />
					<p class="text-xs text-[var(--color-muted)]">Common: g i m s u y</p>
				</label>
			</div>

			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">Test text</span>
				<textarea
					class="search-input min-h-[180px] resize-y"
					placeholder="Paste text to match"
					bind:value={testText}
				></textarea>
			</label>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Highlighted</p>
					<div class="mt-2 text-sm leading-6">
						{@html highlighted}
					</div>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Matches</p>
					{#if matches.length === 0}
						<p class="mt-2 text-sm text-[var(--color-muted)]">No matches yet.</p>
					{:else}
						<ul class="mt-2 space-y-3 text-xs">
							{#each matches as match, index}
								<li class="space-y-1">
									<p class="font-mono">#{index + 1} @ {match.index}</p>
									<p class="font-mono">{match.match}</p>
									{#if match.groups.length}
										<p class="text-[var(--color-muted)]">Groups: {match.groups.join(', ')}</p>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</section>
	</div>
</div>
