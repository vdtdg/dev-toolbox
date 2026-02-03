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
	let errorMessage = '';

	const transform = () => {
		errorMessage = '';
		if (!inputValue) {
			outputValue = '';
			return;
		}
		try {
			outputValue =
				mode === 'encode' ? encodeURIComponent(inputValue) : decodeURIComponent(inputValue);
		} catch (error) {
			errorMessage = 'Invalid input for decoding.';
			outputValue = '';
		}
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
			<h1 class="text-3xl font-semibold">URI Encoder / Decoder</h1>
			<p class="text-sm text-(--color-muted)">Encode or decode URI components locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-(--color-muted)" for="mode-select">Mode</label>
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

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Input</span>
					<textarea
						class="search-input min-h-45 resize-y"
						placeholder="Paste text to encode or decode"
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Output</span>
					<textarea class="search-input min-h-45 resize-y" readonly value={outputValue}></textarea>
				</label>
			</div>
		</section>
	</div>
</div>
