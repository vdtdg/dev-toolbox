<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	let foreground = '#E4EDF5';
	let background = '#0A0D12';
	let contrast = 0;
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

	const linearize = (value) => {
		const normalized = value / 255;
		return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
	};

	const luminance = (rgb) =>
		0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);

	const calculateContrast = () => {
		errorMessage = '';
		const fg = hexToRgb(foreground);
		const bg = hexToRgb(background);
		if (!fg || !bg) {
			errorMessage = 'Invalid hex color.';
			contrast = 0;
			return;
		}
		const l1 = luminance(fg);
		const l2 = luminance(bg);
		const brighter = Math.max(l1, l2);
		const darker = Math.min(l1, l2);
		contrast = (brighter + 0.05) / (darker + 0.05);
	};

	const pass = (ratio, level) => ratio >= level;

	$: (foreground, background, calculateContrast());
	$: ratioText = contrast ? contrast.toFixed(2) : '--';
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Color Contrast Checker</h1>
			<p class="text-sm text-(--color-muted)">
				Check WCAG contrast ratios for text and UI elements.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Foreground</span>
					<input type="text" class="search-input" bind:value={foreground} placeholder="#E4EDF5" />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Background</span>
					<input type="text" class="search-input" bind:value={background} placeholder="#0A0D12" />
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="panel panel-muted p-5" style={`background:${background};`}>
				<p class="text-sm" style={`color:${foreground};`}>Sample text on selected colors.</p>
			</div>

			<div class="grid gap-4 lg:grid-cols-3">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Contrast</p>
					<p class="mt-2 text-2xl font-semibold">{ratioText}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">AA</p>
					<p
						class={pass(contrast, 4.5)
							? 'mt-2 text-sm text-(var(--color-accent)]'
							: 'mt-2 text-sm text-(var(--color-danger)]'}
					>
						Normal text (4.5:1)
					</p>
					<p
						class={pass(contrast, 3)
							? 'mt-1 text-xs text-(var(--color-accent)]'
							: 'mt-1 text-xs text-(var(--color-danger)]'}
					>
						Large text (3:1)
					</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">AAA</p>
					<p
						class={pass(contrast, 7)
							? 'mt-2 text-sm text-(var(--color-accent)]'
							: 'mt-2 text-sm text-(var(--color-danger)]'}
					>
						Normal text (7:1)
					</p>
					<p
						class={pass(contrast, 4.5)
							? 'mt-1 text-xs text-(var(--color-accent)]'
							: 'mt-1 text-xs text-(var(--color-danger)]'}
					>
						Large text (4.5:1)
					</p>
				</div>
			</div>
		</section>
	</div>
</div>
