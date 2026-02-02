<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	let targetDate = '';
	let baseDate = '';
	let outputValue = '';
	let errorMessage = '';

	const parseDateTime = (value) => {
		if (!value) return null;
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? null : date;
	};

	const formatDuration = (seconds) => {
		const abs = Math.abs(seconds);
		const days = Math.floor(abs / 86400);
		const hours = Math.floor((abs % 86400) / 3600);
		const minutes = Math.floor((abs % 3600) / 60);
		const secs = Math.floor(abs % 60);
		return `${days}d ${hours}h ${minutes}m ${secs}s`;
	};

	const transform = () => {
		errorMessage = '';
		outputValue = '';
		const target = parseDateTime(targetDate);
		const base = baseDate ? parseDateTime(baseDate) : new Date();
		if (!target || !base) {
			if (targetDate) errorMessage = 'Invalid target date.';
			return;
		}
		const deltaSeconds = Math.round((target.getTime() - base.getTime()) / 1000);
		const human = formatDuration(deltaSeconds);
		outputValue =
			deltaSeconds === 0
				? 'now'
				: `${deltaSeconds > 0 ? 'in' : ''} ${human} ${deltaSeconds > 0 ? '' : 'ago'}`;
	};

	$: (targetDate, baseDate, transform());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Relative Time Calculator</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Measure a target date relative to now or a custom base.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Target date</span>
					<input type="datetime-local" class="search-input" bind:value={targetDate} />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Base date (optional)</span>
					<input type="datetime-local" class="search-input" bind:value={baseDate} />
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="panel panel-muted p-5">
				<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Result</p>
				<p class="mt-2 font-mono text-sm">{outputValue || '--'}</p>
			</div>
		</section>
	</div>
</div>
