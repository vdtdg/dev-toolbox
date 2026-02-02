<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	const modes = [
		{ value: 'encode', label: 'Encode' },
		{ value: 'decode', label: 'Decode' }
	];

	let mode = 'decode';
	let inputValue = '';
	let outputValue = '';
	let errorMessage = '';

	const encodeBase64 = (value) => {
		const encoder = new TextEncoder();
		const bytes = encoder.encode(value);
		let binary = '';
		bytes.forEach((byte) => {
			binary += String.fromCharCode(byte);
		});
		return btoa(binary);
	};

	const decodeBase64 = (value) => {
		const sanitized = value.replace(/\s+/g, '');
		const binary = atob(sanitized);
		const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
		const decoder = new TextDecoder();
		return decoder.decode(bytes);
	};

	const transform = () => {
		errorMessage = '';
		if (!inputValue) {
			outputValue = '';
			return;
		}
		try {
			outputValue = mode === 'encode' ? encodeBase64(inputValue) : decodeBase64(inputValue);
		} catch (error) {
			errorMessage = 'Invalid base64 input.';
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
			<h1 class="text-3xl font-semibold">Base64 Encoder / Decoder</h1>
			<p class="text-sm text-[var(--color-muted)]">Encode or decode base64 strings locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-[var(--color-muted)]" for="mode-select">Mode</label>
					<select id="mode-select" class="select-input" bind:value={mode}>
						{#each modes as item}
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
					<span class="text-[var(--color-muted)]">Input</span>
					<textarea
						class="search-input min-h-45 resize-y"
						placeholder="Paste base64 or text"
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
