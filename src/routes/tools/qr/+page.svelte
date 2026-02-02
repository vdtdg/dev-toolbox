<script>
	import { base } from '$app/paths';
	import QRCode from 'qrcode';

	const homeHref = base || '/';

	let text = 'https://dtdg.fr';
	let size = 256;
	let errorMessage = '';
	let dataUrl = '';

	const generateQr = async () => {
		errorMessage = '';
		if (!text.trim()) {
			dataUrl = '';
			return;
		}
		try {
			dataUrl = await QRCode.toDataURL(text, {
				width: Number(size) || 256,
				margin: 2,
				color: {
					dark: '#0A0D12',
					light: '#F5F8FB'
				}
			});
		} catch (error) {
			errorMessage = 'Unable to generate QR code.';
			dataUrl = '';
		}
	};

	$: (text, size, generateQr());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">QR Code Generator</h1>
			<p class="text-sm text-[var(--color-muted)]">Generate QR codes from text or URLs.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">Content</span>
				<textarea
					class="search-input min-h-30 resize-y"
					placeholder="Paste text or a URL"
					bind:value={text}
				></textarea>
			</label>

			<div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Size (px)</span>
					<input type="number" min="128" max="512" class="search-input" bind:value={size} />
				</label>
				{#if dataUrl}
					<a class="ghost-button" href={dataUrl} download="qrcode.png">Download PNG</a>
				{/if}
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			{#if dataUrl}
				<div class="panel panel-muted flex items-center justify-center p-6">
					<img src={dataUrl} alt="QR code" class="h-auto max-w-full" />
				</div>
			{:else}
				<div class="panel panel-muted p-6 text-sm text-[var(--color-muted)]">
					Enter text to generate a QR code.
				</div>
			{/if}
		</section>
	</div>
</div>
