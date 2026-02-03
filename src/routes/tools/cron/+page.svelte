<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	const fieldRanges = {
		minute: [0, 59],
		hour: [0, 23],
		day: [1, 31],
		month: [1, 12],
		weekday: [0, 6]
	};

	const fieldLabels = {
		minute: 'Minutes',
		hour: 'Hours',
		day: 'Day of month',
		month: 'Month',
		weekday: 'Day of week'
	};

	let cronExpression = '*/5 * * * *';
	let baseDate = new Date();
	const runCount = 10;
	let parseError = '';

	const parseField = (value, [min, max], { allowQuestion = false, mapDow = false } = {}) => {
		const trimmed = value.trim();
		if (!trimmed) {
			throw new Error('Empty field');
		}
		if (allowQuestion && trimmed === '?') {
			return { values: new Set(), any: true };
		}

		const segments = trimmed.split(',');
		const values = new Set();
		let any = false;

		for (const segment of segments) {
			const [baseRaw, stepRaw] = segment.split('/');
			const base = baseRaw === '' ? '*' : baseRaw;
			const step = stepRaw ? Number(stepRaw) : 1;
			if (!Number.isInteger(step) || step <= 0) {
				throw new Error(`Invalid step: ${stepRaw}`);
			}

			if (base === '*') {
				any = true;
				for (let i = min; i <= max; i += step) {
					values.add(i);
				}
				continue;
			}

			let start = null;
			let end = null;
			if (base.includes('-')) {
				const [startRaw, endRaw] = base.split('-');
				start = Number(startRaw);
				end = Number(endRaw);
			} else {
				start = Number(base);
				end = stepRaw ? max : start;
			}

			if (!Number.isInteger(start) || !Number.isInteger(end)) {
				throw new Error(`Invalid range: ${base}`);
			}
			if (mapDow) {
				start = start === 7 ? 0 : start;
				end = end === 7 ? 0 : end;
			}
			if (start < min || start > max || end < min || end > max) {
				throw new Error(`Value out of range: ${base}`);
			}
			if (end < start) {
				throw new Error(`Invalid range: ${base}`);
			}

			for (let i = start; i <= end; i += step) {
				values.add(i);
			}
		}

		return { values, any: any && values.size === max - min + 1 };
	};

	const parseCron = (expression) => {
		const parts = expression.trim().split(/\s+/);
		if (parts.length !== 5) {
			throw new Error('Cron expression must have 5 fields.');
		}

		const minute = parseField(parts[0], fieldRanges.minute);
		const hour = parseField(parts[1], fieldRanges.hour);
		const day = parseField(parts[2], fieldRanges.day, { allowQuestion: true });
		const month = parseField(parts[3], fieldRanges.month);
		const weekday = parseField(parts[4], fieldRanges.weekday, {
			allowQuestion: true,
			mapDow: true
		});

		return { minute, hour, day, month, weekday };
	};

	const formatList = (values, maxItems = 8) => {
		const list = Array.from(values).sort((a, b) => a - b);
		if (list.length <= maxItems) return list.join(', ');
		return `${list.slice(0, maxItems).join(', ')}...`;
	};

	const matchesCron = (cron, date) => {
		const minute = date.getMinutes();
		const hour = date.getHours();
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const weekday = date.getDay();

		const minuteMatch = cron.minute.values.has(minute);
		const hourMatch = cron.hour.values.has(hour);
		const monthMatch = cron.month.values.has(month);

		const dayAny = cron.day.any || cron.day.values.size === 0;
		const weekdayAny = cron.weekday.any || cron.weekday.values.size === 0;
		const dayMatch = dayAny ? true : cron.day.values.has(day);
		const weekdayMatch = weekdayAny ? true : cron.weekday.values.has(weekday);

		const dayOk =
			dayAny && weekdayAny
				? true
				: dayAny
					? weekdayMatch
					: weekdayAny
						? dayMatch
						: dayMatch || weekdayMatch;

		return minuteMatch && hourMatch && monthMatch && dayOk;
	};

	const getNextRuns = (cron, start, count) => {
		const results = [];
		let cursor = new Date(start);
		cursor.setSeconds(0, 0);
		cursor = new Date(cursor.getTime() + 60000);
		let guard = 0;
		const maxIterations = 525600;

		while (results.length < count && guard < maxIterations) {
			if (matchesCron(cron, cursor)) {
				results.push(new Date(cursor));
			}
			cursor = new Date(cursor.getTime() + 60000);
			guard += 1;
		}

		return results;
	};

	const formatDateTime = (date) =>
		new Intl.DateTimeFormat(undefined, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);

	const formatRelative = (date) => {
		const deltaMs = date.getTime() - Date.now();
		const minutes = Math.round(deltaMs / 60000);
		if (minutes === 0) return 'now';
		if (minutes < 60) return `in ${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const remainder = minutes % 60;
		return `in ${hours}h ${remainder}m`;
	};

	$: parsedCron = null;
	$: nextRuns = [];
	$: fieldSummary = [];
	const syntaxHint = 'Syntax: *, */step, range (a-b), list (a,b,c).';
	$: {
		parseError = '';
		try {
			parsedCron = parseCron(cronExpression);
			baseDate = new Date();
			nextRuns = getNextRuns(parsedCron, baseDate, Number(runCount) || 10);
			fieldSummary = Object.keys(fieldRanges).map((key) => {
				const field = parsedCron[key];
				const any = field.any || field.values.size === 0;
				const [min, max] = fieldRanges[key];
				return {
					key,
					label: fieldLabels[key],
					any,
					values: any ? 'Any' : formatList(field.values),
					range: `${min}-${max}`,
					hint: syntaxHint
				};
			});
		} catch (error) {
			parseError = error.message;
			parsedCron = null;
			nextRuns = [];
			fieldSummary = [];
		}
	}
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Cron Tab Helper + Visualizer</h1>
			<p class="text-sm text-(--color-muted)">
				Preview upcoming runs and validate 5-field cron expressions locally.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div class="flex-1 space-y-2">
					<label class="text-sm text-(--color-muted)" for="cron-input">Cron expression</label>
					<input
						id="cron-input"
						type="text"
						class="search-input"
						placeholder="*/5 * * * *"
						bind:value={cronExpression}
						aria-label="Cron expression"
					/>
					<p class="text-xs text-(--color-muted)">
						Supports: *, lists, ranges, and steps. Uses local time.
					</p>
				</div>
			</div>

			{#if parseError}
				<div class="alert alert-danger">{parseError}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
				<div class="panel panel-muted p-5">
					<h2 class="text-lg font-semibold">Next runs</h2>
					{#if nextRuns.length === 0}
						<p class="mt-3 text-sm text-(--color-muted)">No upcoming runs found.</p>
					{:else}
						<ol class="mt-4 space-y-3 text-sm">
							{#each nextRuns as run (run.getTime())}
								<li class="flex items-center justify-between gap-3">
									<span>{formatDateTime(run)}</span>
									<span class="text-xs text-(--color-muted)">{formatRelative(run)}</span>
								</li>
							{/each}
						</ol>
					{/if}
				</div>
				<div class="panel panel-muted p-5">
					<h2 class="text-lg font-semibold">Field breakdown</h2>
					<ul class="mt-4 space-y-3 text-sm">
						{#each fieldSummary as field (field.label)}
							<li class="flex flex-col gap-1">
								<span class="text-(--color-muted)">{field.label}</span>
								<span class="font-mono text-xs text-(var(--color-text)]">
									{field.values}
								</span>
								<span class="text-xs text-(--color-muted)">
									Range {field.range}. {field.hint}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	</div>
</div>
