<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	let mode = 'csv-to-json';
	let inputValue = '';
	let outputValue = '';
	let errorMessage = '';
	let delimiter = ',';

	const parseCsvLine = (line, delim) => {
		const result = [];
		let current = '';
		let inQuotes = false;
		for (let i = 0; i < line.length; i += 1) {
			const char = line[i];
			if (char === '"') {
				const nextChar = line[i + 1];
				if (inQuotes && nextChar === '"') {
					current += '"';
					i += 1;
				} else {
					inQuotes = !inQuotes;
				}
			} else if (char === delim && !inQuotes) {
				result.push(current);
				current = '';
			} else {
				current += char;
			}
		}
		result.push(current);
		return result;
	};

	const parseCsv = (value, delim) => {
		const lines = value.split(/\r?\n/).filter((line) => line.trim().length > 0);
		if (lines.length === 0) return [];
		const headers = parseCsvLine(lines[0], delim).map((header) => header.trim());
		return lines.slice(1).map((line) => {
			const cells = parseCsvLine(line, delim);
			return headers.reduce((acc, header, index) => {
				acc[header || `field_${index + 1}`] = cells[index] ?? '';
				return acc;
			}, {});
		});
	};

	const toCsv = (rows, delim) => {
		if (!Array.isArray(rows) || rows.length === 0) return '';
		const headers = Array.from(
			rows.reduce((set, row) => {
				Object.keys(row).forEach((key) => set.add(key));
				return set;
			}, new Set())
		);
		const escapeCell = (value) => {
			const str = value == null ? '' : String(value);
			if (str.includes('"') || str.includes('\n') || str.includes(delim)) {
				return `"${str.replace(/"/g, '""')}"`;
			}
			return str;
		};
		const lines = [headers.join(delim)];
		for (const row of rows) {
			lines.push(headers.map((header) => escapeCell(row[header])).join(delim));
		}
		return lines.join('\n');
	};

	const transform = () => {
		errorMessage = '';
		outputValue = '';
		if (!inputValue.trim()) return;
		try {
			if (mode === 'csv-to-json') {
				const data = parseCsv(inputValue, delimiter);
				outputValue = JSON.stringify(data, null, 2);
			} else {
				const data = JSON.parse(inputValue);
				outputValue = toCsv(data, delimiter);
			}
		} catch (error) {
			errorMessage = 'Unable to convert input.';
		}
	};

	const swapDirection = () => {
		mode = mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json';
		inputValue = outputValue || inputValue;
		transform();
	};

	$: (inputValue, mode, delimiter, transform());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">CSV ↔ JSON Converter</h1>
			<p class="text-sm text-[var(--color-muted)]">Convert CSV rows to JSON arrays and back.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-[var(--color-muted)]" for="mode-select">Mode</label>
					<select id="mode-select" class="select-input" bind:value={mode}>
						<option value="csv-to-json">CSV → JSON</option>
						<option value="json-to-csv">JSON → CSV</option>
					</select>
				</div>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Delimiter</span>
					<input type="text" class="search-input" maxlength="1" bind:value={delimiter} />
				</label>
				<button type="button" class="ghost-button" on:click={swapDirection}>Swap direction</button>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input</span>
					<textarea
						class="search-input min-h-[200px] resize-y font-mono"
						placeholder="Paste CSV or JSON"
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Output</span>
					<textarea
						class="search-input min-h-[200px] resize-y font-mono"
						readonly
						value={outputValue}
					></textarea>
				</label>
			</div>
		</section>
	</div>
</div>
