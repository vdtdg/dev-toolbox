<script>
	import { base as basePath } from '$app/paths';

	const homeHref = basePath ? `${basePath}/` : '/';

	const formats = [
		{ id: 'png', label: 'PNG' },
		{ id: 'jpeg', label: 'JPEG' },
		{ id: 'webp', label: 'WebP' }
	];

	let imageSrc = '';
	let imageName = '';
	let originalWidth = 0;
	let originalHeight = 0;
	let outputWidth = 0;
	let outputHeight = 0;
	let outputUrl = '';
	let errorMessage = '';
	let format = 'png';
	let quality = 0.92;
	let resizeEnabled = true;
	let cropEnabled = false;
	let keepAspect = true;
	let cropX = 0;
	let cropY = 0;
	let cropWidth = 0;
	let cropHeight = 0;
	let imageElement;

	const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

	const handleFile = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		imageName = file.name;
		const reader = new FileReader();
		reader.onload = () => {
			imageSrc = reader.result?.toString() || '';
		};
		reader.readAsDataURL(file);
	};

	const syncDimensions = (baseWidth, baseHeight, preferred = 'width') => {
		if (!keepAspect) return;
		if (preferred === 'width' && outputWidth) {
			outputHeight = Math.max(1, Math.round((outputWidth * baseHeight) / baseWidth));
		}
		if (preferred === 'height' && outputHeight) {
			outputWidth = Math.max(1, Math.round((outputHeight * baseWidth) / baseHeight));
		}
	};

	const handleImageLoad = () => {
		if (!imageElement) return;
		originalWidth = imageElement.naturalWidth || 0;
		originalHeight = imageElement.naturalHeight || 0;
		outputWidth = originalWidth;
		outputHeight = originalHeight;
		cropX = 0;
		cropY = 0;
		cropWidth = originalWidth;
		cropHeight = originalHeight;
		updateOutput();
	};

	const handleWidthInput = () => {
		const baseWidth = cropEnabled ? cropWidth : originalWidth;
		const baseHeight = cropEnabled ? cropHeight : originalHeight;
		syncDimensions(baseWidth, baseHeight, 'width');
		updateOutput();
	};

	const handleHeightInput = () => {
		const baseWidth = cropEnabled ? cropWidth : originalWidth;
		const baseHeight = cropEnabled ? cropHeight : originalHeight;
		syncDimensions(baseWidth, baseHeight, 'height');
		updateOutput();
	};

	const handleCropToggle = () => {
		if (!cropEnabled) return;
		cropX = 0;
		cropY = 0;
		cropWidth = originalWidth;
		cropHeight = originalHeight;
		if (resizeEnabled) {
			outputWidth = cropWidth;
			outputHeight = cropHeight;
		}
		updateOutput();
	};

	const updateOutput = () => {
		errorMessage = '';
		outputUrl = '';
		if (!imageElement || !imageSrc) return;

		const baseWidth = originalWidth;
		const baseHeight = originalHeight;
		let sourceX = 0;
		let sourceY = 0;
		let sourceWidth = baseWidth;
		let sourceHeight = baseHeight;

		if (cropEnabled) {
			sourceX = clamp(Number(cropX) || 0, 0, baseWidth - 1);
			sourceY = clamp(Number(cropY) || 0, 0, baseHeight - 1);
			sourceWidth = clamp(Number(cropWidth) || 1, 1, baseWidth - sourceX);
			sourceHeight = clamp(Number(cropHeight) || 1, 1, baseHeight - sourceY);
			if (sourceWidth <= 0 || sourceHeight <= 0) {
				errorMessage = 'Crop dimensions are out of bounds.';
				return;
			}
		}

		let targetWidth = sourceWidth;
		let targetHeight = sourceHeight;
		if (resizeEnabled) {
			targetWidth = Math.max(1, Number(outputWidth) || sourceWidth);
			targetHeight = Math.max(1, Number(outputHeight) || sourceHeight);
			if (keepAspect) {
				targetHeight = Math.max(1, Math.round((targetWidth * sourceHeight) / sourceWidth));
				outputHeight = targetHeight;
			}
		}

		const canvas = document.createElement('canvas');
		canvas.width = targetWidth;
		canvas.height = targetHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			errorMessage = 'Canvas is not supported in this browser.';
			return;
		}
		ctx.drawImage(
			imageElement,
			sourceX,
			sourceY,
			sourceWidth,
			sourceHeight,
			0,
			0,
			targetWidth,
			targetHeight
		);

		const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
		const outputQuality = format === 'png' ? 1 : clamp(Number(quality) || 0.92, 0.1, 1);
		outputUrl = canvas.toDataURL(mime, outputQuality);
	};

	$: if (!imageSrc) {
		outputUrl = '';
		errorMessage = '';
	}
	$: (format,
		quality,
		resizeEnabled,
		cropEnabled,
		keepAspect,
		outputWidth,
		outputHeight,
		updateOutput());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Image Helper</h1>
			<p class="text-sm text-[var(--color-muted)]">Convert, resize, and crop images locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">Upload image</span>
				<input type="file" accept="image/*" class="search-input" on:change={handleFile} />
			</label>

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="space-y-4">
					<div class="panel panel-muted p-4">
						<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Preview</p>
						{#if imageSrc}
							<div class="mt-3 overflow-hidden rounded-lg border border-[var(--color-border)]">
								<img
									bind:this={imageElement}
									on:load={handleImageLoad}
									src={imageSrc}
									alt={imageName || 'Uploaded image'}
									class="max-h-65 w-full object-contain"
								/>
							</div>
							<p class="mt-2 text-xs text-[var(--color-muted)]">
								Original: {originalWidth} x {originalHeight}
							</p>
						{:else}
							<p class="mt-2 text-xs text-[var(--color-muted)]">No image loaded yet.</p>
						{/if}
					</div>

					<div class="panel panel-muted p-4">
						<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">
							Output Preview
						</p>
						{#if outputUrl}
							<div class="mt-3 overflow-hidden rounded-lg border border-[var(--color-border)]">
								<img
									src={outputUrl}
									alt="Processed output"
									class="max-h-65 w-full object-contain"
								/>
							</div>
							<p class="mt-2 text-xs text-[var(--color-muted)]">
								Output: {outputWidth} x {outputHeight}
							</p>
						{:else}
							<p class="mt-2 text-xs text-[var(--color-muted)]">No output yet.</p>
						{/if}
					</div>
				</div>

				<div class="space-y-4">
					<div class="panel panel-muted space-y-3 p-4">
						<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Convert</p>
						<label class="space-y-2 text-sm">
							<span class="text-[var(--color-muted)]">Format</span>
							<select class="select-input" bind:value={format}>
								{#each formats as option (option.id)}
									<option value={option.id}>{option.label}</option>
								{/each}
							</select>
						</label>
						{#if format !== 'png'}
							<label class="space-y-2 text-sm">
								<span class="text-[var(--color-muted)]">Quality</span>
								<input
									type="number"
									min="0.1"
									max="1"
									step="0.01"
									class="search-input"
									bind:value={quality}
								/>
							</label>
						{/if}
					</div>

					<div class="panel panel-muted space-y-3 p-4">
						<div class="flex items-center justify-between">
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Resize</p>
							<label class="flex items-center gap-2 text-sm text-[var(--color-muted)]">
								<input type="checkbox" bind:checked={resizeEnabled} />
								Enabled
							</label>
						</div>
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="space-y-2 text-sm">
								<span class="text-[var(--color-muted)]">Width</span>
								<input
									type="number"
									min="1"
									class="search-input"
									bind:value={outputWidth}
									on:input={handleWidthInput}
								/>
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-[var(--color-muted)]">Height</span>
								<input
									type="number"
									min="1"
									class="search-input"
									bind:value={outputHeight}
									on:input={handleHeightInput}
								/>
							</label>
						</div>
						<label class="flex items-center gap-2 text-sm text-[var(--color-muted)]">
							<input type="checkbox" bind:checked={keepAspect} />
							Lock aspect ratio
						</label>
					</div>

					<div class="panel panel-muted space-y-3 p-4">
						<div class="flex items-center justify-between">
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Crop</p>
							<label class="flex items-center gap-2 text-sm text-[var(--color-muted)]">
								<input type="checkbox" bind:checked={cropEnabled} on:change={handleCropToggle} />
								Enabled
							</label>
						</div>
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="space-y-2 text-sm">
								<span class="text-[var(--color-muted)]">X</span>
								<input type="number" min="0" class="search-input" bind:value={cropX} />
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-[var(--color-muted)]">Y</span>
								<input type="number" min="0" class="search-input" bind:value={cropY} />
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-[var(--color-muted)]">Width</span>
								<input type="number" min="1" class="search-input" bind:value={cropWidth} />
							</label>
							<label class="space-y-2 text-sm">
								<span class="text-[var(--color-muted)]">Height</span>
								<input type="number" min="1" class="search-input" bind:value={cropHeight} />
							</label>
						</div>
						<p class="text-xs text-[var(--color-muted)]">
							Crop uses the original image coordinates.
						</p>
					</div>

					{#if errorMessage}
						<div class="alert alert-danger">{errorMessage}</div>
					{/if}

					<div class="flex flex-wrap items-center gap-3">
						{#if outputUrl}
							<a class="action-button" href={outputUrl} download={`image-${format}`}> Download </a>
						{/if}
						<span class="text-xs text-[var(--color-muted)]">
							Processing stays in your browser.
						</span>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
