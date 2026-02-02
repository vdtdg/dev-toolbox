<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	const presets = [
		{ id: 'bin', label: 'Binary', base: 2 },
		{ id: 'oct', label: 'Octal', base: 8 },
		{ id: 'dec', label: 'Decimal', base: 10 },
		{ id: 'hex', label: 'Hex', base: 16 },
		{ id: 'base32', label: 'Base32', base: 32 },
		{ id: 'base36', label: 'Base36', base: 36 }
	];

	let inputValue = '';
	let inputBase = 10;
	let errorMessage = '';
	let outputs = [];

	const exampleByBase = {
		2: '10101101',
		8: '755',
		10: '255',
		16: 'FF',
		32: '7V',
		36: 'Z9'
	};

	const parseNumber = (value, base) => {
		const normalized = value.trim().toLowerCase();
		if (!normalized) return null;
		const validChars = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, base);
		for (const char of normalized) {
			if (char === '-' || char === '+') continue;
			if (!validChars.includes(char)) {
				throw new Error(`Invalid digit "${char}" for base ${base}.`);
			}
		}
		return BigInt(parseInt(normalized, base));
	};

	const formatNumber = (value, base) => {
		if (value === null) return '';
		return value.toString(base).toUpperCase();
	};

	const transform = () => {
		errorMessage = '';
		outputs = [];
		if (!inputValue.trim()) return;
		try {
			const parsed = parseNumber(inputValue, inputBase);
			if (parsed === null) return;
			outputs = presets.map((preset) => ({
				label: preset.label,
				base: preset.base,
				value: formatNumber(parsed, preset.base)
			}));
		} catch (error) {
			errorMessage = error.message;
		}
	};

	$: inputPlaceholder = exampleByBase[inputBase] || '0';
	$: (inputValue, inputBase, transform());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Change Base Helper</h1>
			<p class="text-sm text-[var(--color-muted)]">Convert numbers between common bases.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input value</span>
					<input
						type="text"
						class="search-input"
						placeholder={inputPlaceholder}
						bind:value={inputValue}
					/>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input base</span>
					<select class="select-input" bind:value={inputBase}>
						{#each presets as preset}
							<option value={preset.base}>{preset.label} (base {preset.base})</option>
						{/each}
					</select>
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-3">
				{#if outputs.length === 0}
					<div class="panel panel-muted p-5 text-sm text-[var(--color-muted)]">
						No conversions yet.
					</div>
				{:else}
					{#each outputs as output}
						<div class="panel panel-muted p-5">
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">
								{output.label}
							</p>
							<p class="mt-2 font-mono text-xs break-all">{output.value}</p>
						</div>
					{/each}
				{/if}
			</div>
		</section>
	</div>
</div>
