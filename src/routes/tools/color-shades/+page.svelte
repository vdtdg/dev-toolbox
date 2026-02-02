<script>
	let baseColor = '#52D6FF';
	let steps = 10;
	let palette = [];
	let errorMessage = '';

	const hexToRgb = (hex) => {
		const normalized = hex.replace('#', '');
		if (![3, 6].includes(normalized.length)) return null;
		const value =
			normalized.length === 3
				? normalized
						.split('')
						.map((char) => char + char)
						.join('')
				: normalized;
		const int = Number.parseInt(value, 16);
		if (Number.isNaN(int)) return null;
		return {
			r: (int >> 16) & 255,
			g: (int >> 8) & 255,
			b: int & 255
		};
	};

	const rgbToHex = ({ r, g, b }) =>
		`#${[r, g, b]
			.map((val) =>
				Math.max(0, Math.min(255, Math.round(val)))
					.toString(16)
					.padStart(2, '0')
			)
			.join('')}`.toUpperCase();

	const mix = (from, to, ratio) => ({
		r: from.r + (to.r - from.r) * ratio,
		g: from.g + (to.g - from.g) * ratio,
		b: from.b + (to.b - from.b) * ratio
	});

	const buildPalette = () => {
		errorMessage = '';
		palette = [];
		const rgb = hexToRgb(baseColor);
		if (!rgb) {
			errorMessage = 'Invalid hex value.';
			return;
		}
		const totalSteps = Math.max(3, Math.min(20, Number(steps) || 10));
		const midpoint = Math.floor(totalSteps / 2);
		const white = { r: 255, g: 255, b: 255 };
		const black = { r: 0, g: 0, b: 0 };

		palette = Array.from({ length: totalSteps }, (_, index) => {
			if (index === midpoint) return { value: rgbToHex(rgb), label: 'Base' };
			if (index < midpoint) {
				const ratio = (midpoint - index) / midpoint;
				return { value: rgbToHex(mix(rgb, white, ratio)), label: `Tint ${midpoint - index}` };
			}
			const ratio = (index - midpoint) / (totalSteps - midpoint - 1);
			return { value: rgbToHex(mix(rgb, black, ratio)), label: `Shade ${index - midpoint}` };
		});
	};

	$: (baseColor, steps, buildPalette());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Color Shades Generator</h1>
			<p class="text-sm text-[var(--color-muted)]">Create tints and shades from a base color.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1fr_0.6fr]">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Base color</span>
					<input type="text" class="search-input" bind:value={baseColor} placeholder="#52D6FF" />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Steps</span>
					<input type="number" min="3" max="20" class="search-input" bind:value={steps} />
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
				{#each palette as swatch}
					<div class="panel panel-muted p-4">
						<div
							class="h-16 rounded-lg border border-[var(--color-border)]"
							style={`background:${swatch.value};`}
						></div>
						<p class="mt-2 text-xs text-[var(--color-muted)]">{swatch.label}</p>
						<p class="font-mono text-xs">{swatch.value}</p>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
