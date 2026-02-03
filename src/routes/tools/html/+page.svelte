<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	const modes = [
		{ value: 'encode', label: 'Encode' },
		{ value: 'decode', label: 'Decode' }
	];

	let mode = 'encode';
	let inputValue = '';
	let outputValue = '';

	const encodeHtml = (value) =>
		value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

	const decodeHtml = (value) => {
		const textarea = document.createElement('textarea');
		textarea.innerHTML = value;
		return textarea.value;
	};

	const transform = () => {
		if (!inputValue) {
			outputValue = '';
			return;
		}
		outputValue = mode === 'encode' ? encodeHtml(inputValue) : decodeHtml(inputValue);
	};

	const swapDirection = () => {
		mode = mode === 'encode' ? 'decode' : 'encode';
		inputValue = outputValue || inputValue;
		transform();
	};

	$: (inputValue, mode, transform());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">HTML Encoder / Decoder</h1>
			<p class="text-sm text-[var(--color-muted)]">Escape or decode HTML entities locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-[var(--color-muted)]" for="mode-select">Mode</label>
					<select id="mode-select" class="select-input" bind:value={mode}>
						{#each modes as item (item.value)}
							<option value={item.value}>{item.label}</option>
						{/each}
					</select>
				</div>
				<button type="button" class="ghost-button" on:click={swapDirection}>
					Swap direction
				</button>
			</div>

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input</span>
					<textarea
						class="search-input min-h-45 resize-y"
						placeholder="Paste text to encode or decode"
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Output</span>
					<textarea class="search-input min-h-45 resize-y" readonly value={outputValue}></textarea>
				</label>
			</div>
		</section>
	</div>
</div>
