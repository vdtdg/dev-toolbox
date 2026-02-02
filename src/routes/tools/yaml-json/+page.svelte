<script>
	import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

	let mode = 'yaml-to-json';
	let inputValue = '';
	let outputValue = '';
	let errorMessage = '';

	const transform = () => {
		errorMessage = '';
		outputValue = '';
		if (!inputValue.trim()) return;
		try {
			if (mode === 'yaml-to-json') {
				const data = parseYaml(inputValue);
				outputValue = JSON.stringify(data, null, 2);
			} else {
				const data = JSON.parse(inputValue);
				outputValue = stringifyYaml(data);
			}
		} catch (error) {
			errorMessage = 'Unable to convert input.';
		}
	};

	const swapDirection = () => {
		mode = mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json';
		inputValue = outputValue || inputValue;
		transform();
	};

	$: (inputValue, mode, transform());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">YAML ↔ JSON Converter</h1>
			<p class="text-sm text-[var(--color-muted)]">Convert YAML to JSON or JSON to YAML locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-[var(--color-muted)]" for="mode-select">Mode</label>
					<select id="mode-select" class="select-input" bind:value={mode}>
						<option value="yaml-to-json">YAML → JSON</option>
						<option value="json-to-yaml">JSON → YAML</option>
					</select>
				</div>
				<button type="button" class="ghost-button" on:click={swapDirection}>Swap direction</button>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input</span>
					<textarea
						class="search-input min-h-[200px] resize-y font-mono"
						placeholder="Paste YAML or JSON"
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Output</span>
					<textarea
						class="search-input min-h-[200px] resize-y font-mono"
						readonly
						value={outputValue}
					></textarea>
				</label>
			</div>
		</section>
	</div>
</div>
