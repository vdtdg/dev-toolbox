<script>
	import { base as basePath } from '$app/paths';

	const homeHref = basePath ? `${basePath}/` : '/';

	const controlCodes = [
		{ code: 0, value: 'NUL', description: 'null character' },
		{ code: 1, value: 'SOH', description: 'start of header' },
		{ code: 2, value: 'STX', description: 'start of text' },
		{ code: 3, value: 'ETX', description: 'end of text' },
		{ code: 4, value: 'EOT', description: 'end of transmission' },
		{ code: 5, value: 'ENQ', description: 'enquiry' },
		{ code: 6, value: 'ACK', description: 'acknowledgment' },
		{ code: 7, value: 'BEL', description: 'bell' },
		{ code: 8, value: 'BS', description: 'backspace' },
		{ code: 9, value: 'HT', description: 'horizontal tab' },
		{ code: 10, value: 'LF', description: 'line feed' },
		{ code: 11, value: 'VT', description: 'vertical tab' },
		{ code: 12, value: 'FF', description: 'form feed' },
		{ code: 13, value: 'CR', description: 'carriage return' },
		{ code: 14, value: 'SO', description: 'shift out' },
		{ code: 15, value: 'SI', description: 'shift in' },
		{ code: 16, value: 'DLE', description: 'data link escape' },
		{ code: 17, value: 'DC1', description: 'device control 1 (XON)' },
		{ code: 18, value: 'DC2', description: 'device control 2' },
		{ code: 19, value: 'DC3', description: 'device control 3 (XOFF)' },
		{ code: 20, value: 'DC4', description: 'device control 4' },
		{ code: 21, value: 'NAK', description: 'negative acknowledgment' },
		{ code: 22, value: 'SYN', description: 'synchronous idle' },
		{ code: 23, value: 'ETB', description: 'end of transmission block' },
		{ code: 24, value: 'CAN', description: 'cancel' },
		{ code: 25, value: 'EM', description: 'end of medium' },
		{ code: 26, value: 'SUB', description: 'substitute' },
		{ code: 27, value: 'ESC', description: 'escape' },
		{ code: 28, value: 'FS', description: 'file separator' },
		{ code: 29, value: 'GS', description: 'group separator' },
		{ code: 30, value: 'RS', description: 'record separator' },
		{ code: 31, value: 'US', description: 'unit separator' },
		{ code: 32, value: 'SP', description: 'space' },
		{ code: 127, value: 'DEL', description: 'delete' }
	];

	const punctuationDescriptions = {
		33: 'exclamation mark',
		34: 'double quote',
		35: 'number sign',
		36: 'dollar sign',
		37: 'percent sign',
		38: 'ampersand',
		39: 'apostrophe',
		40: 'left parenthesis',
		41: 'right parenthesis',
		42: 'asterisk',
		43: 'plus sign',
		44: 'comma',
		45: 'minus sign',
		46: 'period',
		47: 'slash',
		58: 'colon',
		59: 'semicolon',
		60: 'less than',
		61: 'equals sign',
		62: 'greater than',
		63: 'question mark',
		64: 'at sign',
		91: 'left bracket',
		92: 'backslash',
		93: 'right bracket',
		94: 'caret',
		95: 'underscore',
		96: 'grave accent',
		123: 'left brace',
		124: 'vertical bar',
		125: 'right brace',
		126: 'tilde'
	};

	const toBinary = (value) => value.toString(2).padStart(8, '0');
	const formatBinary = (value) => {
		const bits = toBinary(value);
		return `${bits.slice(0, 4)} ${bits.slice(4)}`;
	};

	const buildRows = () => {
		const controlMap = new Map(controlCodes.map((item) => [item.code, item]));
		const rows = [];
		for (let code = 0; code <= 127; code += 1) {
			const control = controlMap.get(code);
			let value = control?.value || String.fromCharCode(code);
			let description = control?.description || '';
			if (!control) {
				if (code >= 65 && code <= 90) {
					description = `uppercase letter ${value}`;
				} else if (code >= 97 && code <= 122) {
					description = `lowercase letter ${value}`;
				} else if (code >= 48 && code <= 57) {
					description = `digit ${value}`;
				} else {
					description = punctuationDescriptions[code] || description;
				}
			}
			rows.push({
				decimal: code.toString(10).padStart(3, '0'),
				octal: code.toString(8).padStart(3, '0'),
				hex: code.toString(16).toUpperCase().padStart(2, '0'),
				binary: formatBinary(code),
				value,
				description
			});
		}
		return rows;
	};

	const ASCII_REF = buildRows();

	let query = '';

	$: normalizedQuery = query.trim().toLowerCase();
	$: filteredRows =
		normalizedQuery.length === 0
			? ASCII_REF
			: ASCII_REF.filter((row) =>
					[row.decimal, row.octal, row.hex, row.binary, row.value, row.description]
						.join(' ')
						.toLowerCase()
						.includes(normalizedQuery)
				);
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">ASCII Reference Table</h1>
			<p class="text-sm text-(--color-muted)">Standard ASCII (0-127) lookup table.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-(--color-muted)">Search</span>
				<input
					type="search"
					class="search-input"
					placeholder="Search by code, hex, or description"
					bind:value={query}
				/>
			</label>

			<div class="panel panel-muted overflow-x-auto p-4">
				<table class="w-full min-w-220 text-left text-sm">
					<thead class="text-xs text-(--color-muted) uppercase">
						<tr>
							<th class="pr-4 pb-3">Dec</th>
							<th class="pr-4 pb-3">Oct</th>
							<th class="pr-4 pb-3">Hex</th>
							<th class="pr-4 pb-3">Binary</th>
							<th class="pr-4 pb-3">Value</th>
							<th class="pb-3">Description</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-(--color-border)">
						{#each filteredRows as row (row.decimal)}
							<tr>
								<td class="py-2 pr-4 font-mono text-xs">{row.decimal}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.octal}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.hex}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.binary}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.value}</td>
								<td class="py-2 text-xs text-(--color-muted)">{row.description || '--'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	</div>
</div>
