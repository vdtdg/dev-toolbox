<script>
	let timestamp = '';
	let unit = 'seconds';
	let errorMessage = '';

	const parseTimestamp = (valueRaw, unitValue) => {
		errorMessage = '';
		if (!valueRaw.trim()) {
			return null;
		}
		const value = Number(valueRaw.trim());
		if (!Number.isFinite(value)) {
			errorMessage = 'Invalid timestamp value.';
			return null;
		}
		const millis = unitValue === 'seconds' ? value * 1000 : value;
		const date = new Date(millis);
		if (Number.isNaN(date.getTime())) {
			errorMessage = 'Timestamp is out of range.';
			return null;
		}
		return date;
	};

	const formatDate = (date, timeZone) =>
		new Intl.DateTimeFormat(undefined, {
			timeZone,
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).format(date);

	$: parsedDate = parseTimestamp(timestamp, unit);
	$: localTime = parsedDate ? formatDate(parsedDate) : '';
	$: utcTime = parsedDate ? formatDate(parsedDate, 'UTC') : '';
	$: isoTime = parsedDate ? parsedDate.toISOString() : '';
	$: nowSeconds = Math.floor(Date.now() / 1000);
	$: nowMillis = Date.now();
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Timestamp to Time</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Convert Unix timestamps to local time, UTC, and ISO.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<div class="space-y-3">
					<label class="text-sm text-[var(--color-muted)]" for="timestamp-input"> Timestamp </label>
					<input
						id="timestamp-input"
						type="text"
						class="search-input"
						placeholder="1700000000"
						bind:value={timestamp}
					/>
					<div class="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
						<label class="flex items-center gap-2">
							<input type="radio" name="unit" value="seconds" bind:group={unit} />
							Seconds
						</label>
						<label class="flex items-center gap-2">
							<input type="radio" name="unit" value="milliseconds" bind:group={unit} />
							Milliseconds
						</label>
					</div>
				</div>
				<div
					class="rounded-xl border border-[var(--color-border)] bg-[rgba(10,14,20,0.6)] p-4 text-xs text-[var(--color-muted)]"
				>
					<p>Current timestamps</p>
					<p class="mt-2 font-mono">Seconds: {nowSeconds}</p>
					<p class="mt-1 font-mono">Milliseconds: {nowMillis}</p>
				</div>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-3">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Local</p>
					<p class="mt-2 font-mono text-sm">{localTime || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">UTC</p>
					<p class="mt-2 font-mono text-sm">{utcTime || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">ISO 8601</p>
					<p class="mt-2 font-mono text-sm">{isoTime || '--'}</p>
				</div>
			</div>
		</section>
	</div>
</div>
