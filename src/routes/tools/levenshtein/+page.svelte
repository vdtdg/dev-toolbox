<script>
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
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Levenshtein Distance Calculator</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Compute edit distance and similarity between two strings locally.
			</p>
		</header>

		<section class="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
			<div class="panel space-y-4 p-6">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<h2 class="text-lg font-semibold">Input</h2>
					<label class="flex items-center gap-2 text-xs text-[var(--color-muted)]">
						<input type="checkbox" class="rounded" bind:checked={ignoreCase} />
						Ignore case
					</label>
				</div>
				<div class="grid gap-4 lg:grid-cols-2">
					<label class="space-y-2 text-sm">
						<span class="text-[var(--color-muted)]">Left string</span>
						<textarea
							class="search-input min-h-[180px] resize-y"
							placeholder="First string"
							bind:value={leftText}
						></textarea>
						<span class="text-xs text-[var(--color-muted)]">{leftCount} characters</span>
					</label>
					<label class="space-y-2 text-sm">
						<span class="text-[var(--color-muted)]">Right string</span>
						<textarea
							class="search-input min-h-[180px] resize-y"
							placeholder="Second string"
							bind:value={rightText}
						></textarea>
						<span class="text-xs text-[var(--color-muted)]">{rightCount} characters</span>
					</label>
				</div>
			</div>

			<div class="panel space-y-4 p-6">
				<h2 class="text-lg font-semibold">Results</h2>
				<div class="panel panel-muted space-y-4 p-5">
					<div>
						<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Distance</p>
						<p class="mt-2 text-3xl font-semibold">{distance}</p>
					</div>
					<div>
						<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Similarity</p>
						<p class="mt-2 text-2xl font-semibold">{similarity.toFixed(1)}%</p>
					</div>
					<div class="progress-track">
						<div
							class="progress-fill"
							style={`width: ${Math.min(100, Math.max(0, similarity))}%`}
						></div>
					</div>
					<p class="text-xs text-[var(--color-muted)]">
						Based on max length of {maxLength} characters.
					</p>
				</div>
				<div
					class="rounded-xl border border-[var(--color-border)] bg-[rgba(10,14,20,0.6)] p-4 text-xs text-[var(--color-muted)]"
				>
					Levenshtein distance counts insertions, deletions, and substitutions needed to transform
					one string into another.
				</div>
			</div>
		</section>
	</div>
</div>
