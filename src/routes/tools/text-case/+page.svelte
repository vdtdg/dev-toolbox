<script>
	const caseOptions = [
		{ id: 'uppercase', label: 'UPPERCASE' },
		{ id: 'lowercase', label: 'lowercase' },
		{ id: 'title', label: 'Title Case' },
		{ id: 'sentence', label: 'Sentence case' },
		{ id: 'camel', label: 'camelCase' },
		{ id: 'pascal', label: 'PascalCase' },
		{ id: 'kebab', label: 'kebab-case' },
		{ id: 'snake', label: 'snake_case' },
		{ id: 'constant', label: 'CONSTANT_CASE' },
		{ id: 'dot', label: 'dot.case' },
		{ id: 'path', label: 'path/case' }
	];

	let inputValue = '';
	let outputValues = [];
	let slugSeparator = '-';
	let slugLowercase = true;
	let slugStripDiacritics = true;
	let slugValue = '';

	const stripDiacritics = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	const splitWords = (value) => {
		const normalized = value
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
			.replace(/([a-zA-Z])([0-9])/g, '$1 $2')
			.replace(/([0-9])([a-zA-Z])/g, '$1 $2')
			.replace(/[_\-./]+/g, ' ')
			.replace(/[^a-zA-Z0-9\s]/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
		return normalized ? normalized.split(' ') : [];
	};

	const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

	const toSentenceCase = (value) => {
		const lower = value.toLowerCase();
		return lower.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
	};

	const buildCases = () => {
		const raw = inputValue;
		if (!raw.trim()) {
			outputValues = [];
			slugValue = '';
			return;
		}

		const words = splitWords(raw);
		const title = words.map(capitalize).join(' ');
		const lowerWords = words.map((word) => word.toLowerCase());
		const upperWords = words.map((word) => word.toUpperCase());
		const camel = words.length
			? [words[0].toLowerCase(), ...words.slice(1).map(capitalize)].join('')
			: '';
		const pascal = words.map(capitalize).join('');
		const kebab = lowerWords.join('-');
		const snake = lowerWords.join('_');
		const constantCase = upperWords.join('_');
		const dotCase = lowerWords.join('.');
		const pathCase = lowerWords.join('/');

		outputValues = [
			{ id: 'uppercase', value: raw.toUpperCase() },
			{ id: 'lowercase', value: raw.toLowerCase() },
			{ id: 'title', value: title },
			{ id: 'sentence', value: toSentenceCase(raw) },
			{ id: 'camel', value: camel },
			{ id: 'pascal', value: pascal },
			{ id: 'kebab', value: kebab },
			{ id: 'snake', value: snake },
			{ id: 'constant', value: constantCase },
			{ id: 'dot', value: dotCase },
			{ id: 'path', value: pathCase }
		];

		let slugBase = raw;
		if (slugStripDiacritics) {
			slugBase = stripDiacritics(slugBase);
		}
		const slugWords = splitWords(slugBase);
		const slugJoined = slugWords.join(slugSeparator);
		slugValue = slugLowercase ? slugJoined.toLowerCase() : slugJoined;
	};

	$: (inputValue, slugSeparator, slugLowercase, slugStripDiacritics, buildCases());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Text Case Converter + Slugify</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Convert text casing and generate URL-safe slugs locally.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">Input</span>
				<textarea
					class="search-input min-h-40 resize-y"
					placeholder="Paste text to transform"
					bind:value={inputValue}
				></textarea>
			</label>

			<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Slugify</p>
					<p class="mt-2 font-mono text-xs break-all">{slugValue || '--'}</p>
				</div>
				<div class="space-y-3">
					<label class="space-y-2 text-sm">
						<span class="text-[var(--color-muted)]">Separator</span>
						<select class="select-input" bind:value={slugSeparator}>
							<option value="-">Hyphen (-)</option>
							<option value="_">Underscore (_)</option>
							<option value=".">Dot (.)</option>
						</select>
					</label>
					<label class="flex items-center gap-2 text-sm text-[var(--color-muted)]">
						<input type="checkbox" bind:checked={slugLowercase} />
						Lowercase output
					</label>
					<label class="flex items-center gap-2 text-sm text-[var(--color-muted)]">
						<input type="checkbox" bind:checked={slugStripDiacritics} />
						Strip diacritics
					</label>
				</div>
			</div>

			<div class="grid gap-4 lg:grid-cols-3">
				{#if outputValues.length === 0}
					<div class="panel panel-muted p-5 text-sm text-[var(--color-muted)]">
						No transformations yet.
					</div>
				{:else}
					{#each caseOptions as option}
						<div class="panel panel-muted p-5">
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">
								{option.label}
							</p>
							<p class="mt-2 font-mono text-xs break-all">
								{outputValues.find((item) => item.id === option.id)?.value || '--'}
							</p>
						</div>
					{/each}
				{/if}
			</div>
		</section>
	</div>
</div>
