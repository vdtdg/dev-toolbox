<script>
	const uuidVersions = [
		{ id: 'v4', label: 'UUID v4' },
		{ id: 'v7', label: 'UUID v7' }
	];

	let uuidVersion = 'v4';
	let uuidCount = 5;
	let ulidCount = 5;
	let ksuidCount = 5;

	let uuidOutput = '';
	let ulidOutput = '';
	let ksuidOutput = '';

	const randomBytes = (length) => {
		const bytes = new Uint8Array(length);
		crypto.getRandomValues(bytes);
		return bytes;
	};

	const toHex = (bytes) =>
		Array.from(bytes)
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

	const formatUuid = (bytes) => {
		const hex = toHex(bytes);
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	};

	const generateUuidV4 = () => {
		const bytes = randomBytes(16);
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;
		return formatUuid(bytes);
	};

	const generateUuidV7 = () => {
		const bytes = randomBytes(16);
		const timestamp = BigInt(Date.now());
		bytes[0] = Number((timestamp >> 40n) & 0xffn);
		bytes[1] = Number((timestamp >> 32n) & 0xffn);
		bytes[2] = Number((timestamp >> 24n) & 0xffn);
		bytes[3] = Number((timestamp >> 16n) & 0xffn);
		bytes[4] = Number((timestamp >> 8n) & 0xffn);
		bytes[5] = Number(timestamp & 0xffn);
		bytes[6] = (bytes[6] & 0x0f) | 0x70;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;
		return formatUuid(bytes);
	};

	const crockford = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
	const encodeBase32 = (bytes) => {
		let output = '';
		let buffer = 0;
		let bits = 0;
		for (const byte of bytes) {
			buffer = (buffer << 8) | byte;
			bits += 8;
			while (bits >= 5) {
				const index = (buffer >> (bits - 5)) & 31;
				output += crockford[index];
				bits -= 5;
			}
		}
		if (bits > 0) {
			const index = (buffer << (5 - bits)) & 31;
			output += crockford[index];
		}
		return output;
	};

	const generateUlid = () => {
		const bytes = new Uint8Array(16);
		const timestamp = BigInt(Date.now());
		bytes[0] = Number((timestamp >> 40n) & 0xffn);
		bytes[1] = Number((timestamp >> 32n) & 0xffn);
		bytes[2] = Number((timestamp >> 24n) & 0xffn);
		bytes[3] = Number((timestamp >> 16n) & 0xffn);
		bytes[4] = Number((timestamp >> 8n) & 0xffn);
		bytes[5] = Number(timestamp & 0xffn);
		bytes.set(randomBytes(10), 6);
		return encodeBase32(bytes).padStart(26, '0');
	};

	const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const encodeBase62 = (bytes) => {
		let value = 0n;
		for (const byte of bytes) {
			value = (value << 8n) + BigInt(byte);
		}
		let output = '';
		const base = 62n;
		while (value > 0n) {
			const remainder = value % base;
			output = base62[Number(remainder)] + output;
			value /= base;
		}
		return output || '0';
	};

	const generateKsuid = () => {
		const bytes = new Uint8Array(20);
		const timestamp = Math.floor(Date.now() / 1000) - 1400000000;
		bytes[0] = (timestamp >>> 24) & 0xff;
		bytes[1] = (timestamp >>> 16) & 0xff;
		bytes[2] = (timestamp >>> 8) & 0xff;
		bytes[3] = timestamp & 0xff;
		bytes.set(randomBytes(16), 4);
		return encodeBase62(bytes).padStart(27, '0');
	};

	const generateMany = (count, generator) => {
		const total = Math.max(1, Math.min(200, Number(count) || 1));
		return Array.from({ length: total }, () => generator()).join('\n');
	};

	const generateUuids = () => {
		uuidOutput = generateMany(uuidCount, uuidVersion === 'v7' ? generateUuidV7 : generateUuidV4);
	};

	const generateUlids = () => {
		ulidOutput = generateMany(ulidCount, generateUlid);
	};

	const generateKsuids = () => {
		ksuidOutput = generateMany(ksuidCount, generateKsuid);
	};

	$: (uuidCount, uuidVersion, generateUuids());
	$: (ulidCount, generateUlids());
	$: (ksuidCount, generateKsuids());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">UUID / ULID / KSUID Generator</h1>
			<p class="text-sm text-[var(--color-muted)]">
				UUID v4 is random, UUID v7 is time-ordered, ULID and KSUID are sortable identifiers.
			</p>
		</header>

		<section class="panel space-y-6 p-6">
			<div class="grid gap-6 lg:grid-cols-3">
				<div class="panel panel-muted space-y-3 p-5">
					<div class="flex items-center justify-between">
						<p class="text-sm font-semibold">UUID</p>
						<select class="select-input" bind:value={uuidVersion}>
							{#each uuidVersions as version}
								<option value={version.id}>{version.label}</option>
							{/each}
						</select>
					</div>
					<p class="text-xs text-[var(--color-muted)]">v4 is random, v7 sorts by time.</p>
					<div class="flex items-center gap-2">
						<input type="number" min="1" max="200" class="search-input" bind:value={uuidCount} />
						<button type="button" class="ghost-button" on:click={generateUuids}>Generate</button>
					</div>
					<textarea
						class="search-input min-h-[160px] resize-y font-mono"
						readonly
						value={uuidOutput}
					></textarea>
				</div>

				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-sm font-semibold">ULID</p>
					<p class="text-xs text-[var(--color-muted)]">
						Sortable IDs with 48-bit time and 80-bit randomness.
					</p>
					<div class="flex items-center gap-2">
						<input type="number" min="1" max="200" class="search-input" bind:value={ulidCount} />
						<button type="button" class="ghost-button" on:click={generateUlids}>Generate</button>
					</div>
					<textarea
						class="search-input min-h-[160px] resize-y font-mono"
						readonly
						value={ulidOutput}
					></textarea>
				</div>

				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-sm font-semibold">KSUID</p>
					<p class="text-xs text-[var(--color-muted)]">
						Sortable IDs with 32-bit time and 128-bit randomness.
					</p>
					<div class="flex items-center gap-2">
						<input type="number" min="1" max="200" class="search-input" bind:value={ksuidCount} />
						<button type="button" class="ghost-button" on:click={generateKsuids}>Generate</button>
					</div>
					<textarea
						class="search-input min-h-[160px] resize-y font-mono"
						readonly
						value={ksuidOutput}
					></textarea>
				</div>
			</div>
		</section>
	</div>
</div>
