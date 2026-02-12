<script>
	import { base as basePath } from '$app/paths';

	const homeHref = basePath ? `${basePath}/` : '/';

	const modes = [
		{ id: 'paragraphs', label: 'Paragraphs' },
		{ id: 'sentences', label: 'Sentences' },
		{ id: 'words', label: 'Words' },
		{ id: 'characters', label: 'Characters' }
	];

	const baseSentences = [
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
		'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
		'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
		'Nam libero justo, laoreet sit amet cursus sed, dictum euismod urna.',
		'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.',
		'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
		'Integer ac leo. Pellentesque in ipsum id orci porta dapibus.',
		'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.'
	];

	const baseWords = baseSentences
		.join(' ')
		.replace(/[^a-zA-Z\s]/g, '')
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean);

	let mode = 'paragraphs';
	let count = 3;
	let sentencesPerParagraph = 3;
	let outputValue = '';
	let copyStatus = '';
	let copyTimeout;
	let countMax = 99;
	let countLabel = 'Count';

	const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

	const takeWords = (wordCount) => {
		const words = [];
		for (let i = 0; i < wordCount; i += 1) {
			words.push(baseWords[i % baseWords.length]);
		}
		return words;
	};

	const buildSentences = (sentenceCount) => {
		const sentences = [];
		for (let i = 0; i < sentenceCount; i += 1) {
			sentences.push(baseSentences[i % baseSentences.length]);
		}
		return sentences;
	};

	const buildCharacters = (characterCount) => {
		const baseText = baseSentences.join(' ');
		let result = '';
		while (result.length < characterCount) {
			result = result ? `${result} ${baseText}` : baseText;
		}
		return result.slice(0, characterCount);
	};

	const generateOutput = () => {
		const safeCount = clamp(Number(count) || 1, 1, countMax);
		const safeSentences = clamp(Number(sentencesPerParagraph) || 1, 1, 10);
		if (mode === 'words') {
			const words = takeWords(safeCount);
			outputValue = words.join(' ');
			return;
		}
		if (mode === 'characters') {
			outputValue = buildCharacters(safeCount);
			return;
		}
		if (mode === 'sentences') {
			const sentences = buildSentences(safeCount);
			outputValue = sentences.join(' ');
			return;
		}
		const paragraphs = [];
		const totalSentences = safeCount * safeSentences;
		const paragraphSentences = buildSentences(totalSentences);
		for (let i = 0; i < safeCount; i += 1) {
			const start = i * safeSentences;
			const sentences = paragraphSentences.slice(start, start + safeSentences);
			paragraphs.push(sentences.join(' '));
		}
		outputValue = paragraphs.join('\n\n');
	};

	const copyOutput = async () => {
		if (!outputValue) return;
		try {
			await navigator.clipboard.writeText(outputValue);
			copyStatus = 'Copied.';
			clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copyStatus = '';
			}, 1600);
		} catch (error) {
			copyStatus = 'Copy failed.';
			clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copyStatus = '';
			}, 1600);
		}
	};

	$: countMax = mode === 'characters' ? 2000 : 99;
	$: countLabel = mode === 'characters' ? 'Characters' : 'Count';
	$: (mode, count, sentencesPerParagraph, generateOutput());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Lorem Ipsum Generator</h1>
			<p class="text-sm text-(--color-muted)">Generate placeholder text blocks locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Mode</span>
					<select class="select-input" bind:value={mode}>
						{#each modes as option (option.id)}
							<option value={option.id}>{option.label}</option>
						{/each}
					</select>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">{countLabel}</span>
					<input type="number" min="1" max={countMax} class="search-input" bind:value={count} />
				</label>
			</div>

			{#if mode === 'paragraphs'}
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Sentences per paragraph</span>
					<input
						type="number"
						min="1"
						max="10"
						class="search-input"
						bind:value={sentencesPerParagraph}
					/>
				</label>
			{/if}

			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="text-xs text-(--color-muted)">
					{mode === 'words'
						? 'Generated as a single line of words.'
						: mode === 'characters'
							? 'Generated as a single character-limited block.'
							: mode === 'sentences'
								? 'Generated as a single paragraph.'
								: 'Generated as multiple paragraphs.'}
				</p>
				<div class="flex items-center gap-3">
					<button type="button" class="ghost-button" on:click={copyOutput}>Copy</button>
					<span class="text-xs text-(--color-muted)">{copyStatus}</span>
				</div>
			</div>

			<label class="space-y-2 text-sm">
				<span class="text-(--color-muted)">Output</span>
				<textarea class="search-input min-h-55 resize-y" readonly value={outputValue}></textarea>
			</label>
		</section>
	</div>
</div>
