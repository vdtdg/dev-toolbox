<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	let inputValue = '';
	let inputBase = 'binary';
	let errorMessage = '';
	let decimalValue = '';
	let binaryValue = '';
	let hexValue = '';
	let bitWidth = 0;
	let bitGroups = [];

	const parseValue = (value, base) => {
		const trimmed = value.trim();
		if (!trimmed) return null;
		const normalized = trimmed.toLowerCase().replace(/^0b|^0x/, '');
		const radix = base === 'binary' ? 2 : base === 'hex' ? 16 : 10;
		const validChars = '0123456789abcdef'.slice(0, radix);
		for (const char of normalized) {
			if (char === '-' || char === '+') continue;
			if (!validChars.includes(char)) {
				throw new Error(`Invalid digit "${char}" for base ${radix}.`);
			}
		}
		return BigInt(parseInt(normalized, radix));
	};

	const formatBinary = (value, width) => {
		const raw = value.toString(2);
		if (!width) return raw;
		return raw.padStart(width, '0');
	};

	const updateOutput = () => {
		errorMessage = '';
		decimalValue = '';
		binaryValue = '';
		hexValue = '';
		bitGroups = [];
		if (!inputValue.trim()) return;
		try {
			const parsed = parseValue(inputValue, inputBase);
			if (parsed === null) return;
			decimalValue = parsed.toString(10);
			hexValue = parsed.toString(16).toUpperCase();
			binaryValue = formatBinary(parsed, bitWidth);
			const padded = formatBinary(parsed, bitWidth);
			bitGroups = padded.match(/.{1,4}/g) || [];
		} catch (error) {
			errorMessage = error.message;
		}
	};

	$: (inputValue, inputBase, bitWidth, updateOutput());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Binary Helper</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Convert between binary, decimal, and hex with bit grouping.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input</span>
					<input type="text" class="search-input" placeholder="10101010" bind:value={inputValue} />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input base</span>
					<select class="select-input" bind:value={inputBase}>
						<option value="binary">Binary</option>
						<option value="decimal">Decimal</option>
						<option value="hex">Hex</option>
					</select>
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-3">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Binary</p>
					<p class="mt-2 font-mono text-xs break-all">{binaryValue || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Decimal</p>
					<p class="mt-2 font-mono text-xs break-all">{decimalValue || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Hex</p>
					<p class="mt-2 font-mono text-xs break-all">{hexValue || '--'}</p>
				</div>
			</div>

			<div class="panel panel-muted p-5">
				<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Grouped bits</p>
				<p class="mt-2 font-mono text-xs break-all">
					{bitGroups.length ? bitGroups.join(' ') : '--'}
				</p>
			</div>
		</section>
	</div>
</div>
