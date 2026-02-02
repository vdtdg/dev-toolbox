<script>
	import exifr from 'exifr';

	let imageSrc = '';
	let imageName = '';
	let imageSize = 0;
	let errorMessage = '';
	let exifData = null;
	let iptcData = null;
	let gpsData = null;

	const formatBytes = (bytes) => {
		if (!bytes) return '0 B';
		const units = ['B', 'KB', 'MB', 'GB'];
		let value = bytes;
		let index = 0;
		while (value >= 1024 && index < units.length - 1) {
			value /= 1024;
			index += 1;
		}
		return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
	};

	const formatValue = (value) => {
		if (value === null || value === undefined || value === '') return '--';
		if (value instanceof Date) {
			return new Intl.DateTimeFormat(undefined, {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			}).format(value);
		}
		if (Array.isArray(value)) {
			return value.map((entry) => formatValue(entry)).join(', ');
		}
		if (typeof value === 'object') {
			return JSON.stringify(value);
		}
		return String(value);
	};

	const toRows = (data) =>
		data
			? Object.entries(data)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => ({ key, value: formatValue(value) }))
					.sort((a, b) => a.key.localeCompare(b.key))
			: [];

	const handleFile = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		errorMessage = '';
		exifData = null;
		iptcData = null;
		gpsData = null;
		imageName = file.name;
		imageSize = file.size;
		imageSrc = URL.createObjectURL(file);
		try {
			const parsed = await exifr.parse(file, {
				exif: true,
				iptc: true,
				gps: true,
				tiff: true,
				ifd1: true
			});
			exifData = parsed || null;
			iptcData = parsed?.iptc || null;
			gpsData = parsed?.gps || null;
		} catch (error) {
			errorMessage = error.message || 'Unable to read image metadata.';
		}
	};

	$: exifRows = toRows(exifData);
	$: iptcRows = toRows(iptcData);
	$: gpsRows = toRows(gpsData);
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Image Metadata Viewer</h1>
			<p class="text-sm text-[var(--color-muted)]">Inspect EXIF and IPTC metadata locally.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">Upload image</span>
				<input type="file" accept="image/*" class="search-input" on:change={handleFile} />
			</label>

			{#if imageSrc}
				<div class="panel panel-muted p-4">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Preview</p>
					<div class="mt-3 overflow-hidden rounded-lg border border-[var(--color-border)]">
						<img src={imageSrc} alt={imageName} class="max-h-[240px] w-full object-contain" />
					</div>
					<p class="mt-2 text-xs text-[var(--color-muted)]">
						{imageName} • {formatBytes(imageSize)}
					</p>
				</div>
			{/if}

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">EXIF</p>
					{#if exifRows.length}
						<ul class="mt-3 space-y-2 text-xs">
							{#each exifRows as row}
								<li class="flex items-start justify-between gap-4">
									<span class="text-[var(--color-muted)]">{row.key}</span>
									<span class="text-right font-mono break-all">{row.value}</span>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="mt-2 text-xs text-[var(--color-muted)]">No EXIF metadata found.</p>
					{/if}
				</div>

				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">IPTC</p>
					{#if iptcRows.length}
						<ul class="mt-3 space-y-2 text-xs">
							{#each iptcRows as row}
								<li class="flex items-start justify-between gap-4">
									<span class="text-[var(--color-muted)]">{row.key}</span>
									<span class="text-right font-mono break-all">{row.value}</span>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="mt-2 text-xs text-[var(--color-muted)]">No IPTC metadata found.</p>
					{/if}
				</div>
			</div>

			<div class="panel panel-muted p-5">
				<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">GPS</p>
				{#if gpsRows.length}
					<ul class="mt-3 space-y-2 text-xs">
						{#each gpsRows as row}
							<li class="flex items-start justify-between gap-4">
								<span class="text-[var(--color-muted)]">{row.key}</span>
								<span class="text-right font-mono break-all">{row.value}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-2 text-xs text-[var(--color-muted)]">No GPS metadata found.</p>
				{/if}
			</div>
		</section>
	</div>
</div>
