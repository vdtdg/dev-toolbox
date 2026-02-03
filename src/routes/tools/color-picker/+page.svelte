<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	let color = '#52D6FF';
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

	const rgbToHsl = ({ r, g, b }) => {
		const rNorm = r / 255;
		const gNorm = g / 255;
		const bNorm = b / 255;
		const max = Math.max(rNorm, gNorm, bNorm);
		const min = Math.min(rNorm, gNorm, bNorm);
		let h = 0;
		let s = 0;
		const l = (max + min) / 2;
		if (max !== min) {
			const delta = max - min;
			s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
			switch (max) {
				case rNorm:
					h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
					break;
				case gNorm:
					h = (bNorm - rNorm) / delta + 2;
					break;
				default:
					h = (rNorm - gNorm) / delta + 4;
			}
			h /= 6;
		}
		return {
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			l: Math.round(l * 100)
		};
	};

	const normalizeHex = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return '';
		if (!trimmed.startsWith('#')) return `#${trimmed}`;
		return trimmed;
	};

	$: hexValue = normalizeHex(color);
	$: rgb = hexToRgb(hexValue);
	$: errorMessage = rgb ? '' : hexValue ? 'Invalid hex value.' : '';
	$: hsl = rgb ? rgbToHsl(rgb) : null;
	$: rgbText = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '--';
	$: hslText = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '--';
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Color Picker</h1>
			<p class="text-sm text-(--color-muted)">
				Pick a color and get hex, RGB, and HSL values.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1fr_0.6fr]">
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Hex</span>
					<input type="text" class="search-input" bind:value={color} placeholder="#52D6FF" />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-(--color-muted)">Picker</span>
					<input type="color" class="search-input h-10.5 p-1" bind:value={color} />
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-3">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">Preview</p>
					<div
						class="mt-3 h-20 rounded-xl border border-(var(--color-border)]  "
						style={`background:${hexValue};`}
					></div>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">RGB</p>
					<p class="mt-2 font-mono text-sm">{rgbText}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-(--color-muted) uppercase">HSL</p>
					<p class="mt-2 font-mono text-sm">{hslText}</p>
				</div>
			</div>
		</section>
	</div>
</div>
