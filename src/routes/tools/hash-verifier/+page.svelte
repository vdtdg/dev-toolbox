<script>
	import { base } from '$app/paths';

	const homeHref = base || '/';
	const algorithms = [
		{ id: 'md5', label: 'MD5' },
		{ id: 'sha1', label: 'SHA-1' },
		{ id: 'sha256', label: 'SHA-256' },
		{ id: 'sha512', label: 'SHA-512' },
		{ id: 'ripemd160', label: 'RIPEMD-160' }
	];

	let selectedAlgorithm = 'sha256';
	let inputValue = '';
	let expectedHash = '';
	let computedHash = '';
	let matchState = '';
	let errorMessage = '';

	const toHex = (bytes) =>
		Array.from(bytes)
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

	const hashWithWebCrypto = async (algorithm, value) => {
		const encoder = new TextEncoder();
		const data = encoder.encode(value);
		const digest = await crypto.subtle.digest(algorithm, data);
		return toHex(new Uint8Array(digest));
	};

	const rotateLeft = (value, bits) => ((value << bits) | (value >>> (32 - bits))) >>> 0;

	const md5 = (message) => {
		const encoder = new TextEncoder();
		const bytes = encoder.encode(message);
		const length = bytes.length * 8;
		const paddedLength = (((bytes.length + 8) >> 6) + 1) << 6;
		const buffer = new Uint8Array(paddedLength);
		buffer.set(bytes);
		buffer[bytes.length] = 0x80;
		const view = new DataView(buffer.buffer);
		view.setUint32(paddedLength - 8, length >>> 0, true);
		view.setUint32(paddedLength - 4, Math.floor(length / 2 ** 32), true);

		let a0 = 0x67452301;
		let b0 = 0xefcdab89;
		let c0 = 0x98badcfe;
		let d0 = 0x10325476;

		const shifts = [
			7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
			14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15,
			21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
		];
		const constants = new Array(64)
			.fill(0)
			.map((_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32));

		for (let offset = 0; offset < paddedLength; offset += 64) {
			let a = a0;
			let b = b0;
			let c = c0;
			let d = d0;
			const chunk = new DataView(buffer.buffer, offset, 64);
			const words = new Array(16);
			for (let i = 0; i < 16; i += 1) {
				words[i] = chunk.getUint32(i * 4, true);
			}

			for (let i = 0; i < 64; i += 1) {
				let f = 0;
				let g = 0;
				if (i < 16) {
					f = (b & c) | (~b & d);
					g = i;
				} else if (i < 32) {
					f = (d & b) | (~d & c);
					g = (5 * i + 1) % 16;
				} else if (i < 48) {
					f = b ^ c ^ d;
					g = (3 * i + 5) % 16;
				} else {
					f = c ^ (b | ~d);
					g = (7 * i) % 16;
				}

				const temp = d;
				d = c;
				c = b;
				const sum = (a + f + constants[i] + words[g]) >>> 0;
				b = (b + rotateLeft(sum, shifts[i])) >>> 0;
				a = temp;
			}

			a0 = (a0 + a) >>> 0;
			b0 = (b0 + b) >>> 0;
			c0 = (c0 + c) >>> 0;
			d0 = (d0 + d) >>> 0;
		}

		const digest = new Uint8Array(16);
		const digestView = new DataView(digest.buffer);
		digestView.setUint32(0, a0, true);
		digestView.setUint32(4, b0, true);
		digestView.setUint32(8, c0, true);
		digestView.setUint32(12, d0, true);
		return toHex(digest);
	};

	const sha1 = (message) => {
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const length = data.length * 8;
		const paddedLength = (((data.length + 8) >> 6) + 1) << 6;
		const buffer = new Uint8Array(paddedLength);
		buffer.set(data);
		buffer[data.length] = 0x80;
		const view = new DataView(buffer.buffer);
		view.setUint32(paddedLength - 4, length >>> 0, false);
		view.setUint32(paddedLength - 8, Math.floor(length / 2 ** 32), false);

		let h0 = 0x67452301;
		let h1 = 0xefcdab89;
		let h2 = 0x98badcfe;
		let h3 = 0x10325476;
		let h4 = 0xc3d2e1f0;

		for (let offset = 0; offset < paddedLength; offset += 64) {
			const words = new Uint32Array(80);
			const chunk = new DataView(buffer.buffer, offset, 64);
			for (let i = 0; i < 16; i += 1) {
				words[i] = chunk.getUint32(i * 4, false);
			}
			for (let i = 16; i < 80; i += 1) {
				words[i] = rotateLeft(words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16], 1);
			}

			let a = h0;
			let b = h1;
			let c = h2;
			let d = h3;
			let e = h4;

			for (let i = 0; i < 80; i += 1) {
				let f = 0;
				let k = 0;
				if (i < 20) {
					f = (b & c) | (~b & d);
					k = 0x5a827999;
				} else if (i < 40) {
					f = b ^ c ^ d;
					k = 0x6ed9eba1;
				} else if (i < 60) {
					f = (b & c) | (b & d) | (c & d);
					k = 0x8f1bbcdc;
				} else {
					f = b ^ c ^ d;
					k = 0xca62c1d6;
				}

				const temp = (rotateLeft(a, 5) + f + e + k + words[i]) >>> 0;
				e = d;
				d = c;
				c = rotateLeft(b, 30) >>> 0;
				b = a;
				a = temp;
			}

			h0 = (h0 + a) >>> 0;
			h1 = (h1 + b) >>> 0;
			h2 = (h2 + c) >>> 0;
			h3 = (h3 + d) >>> 0;
			h4 = (h4 + e) >>> 0;
		}

		const digest = new Uint8Array(20);
		const digestView = new DataView(digest.buffer);
		digestView.setUint32(0, h0, false);
		digestView.setUint32(4, h1, false);
		digestView.setUint32(8, h2, false);
		digestView.setUint32(12, h3, false);
		digestView.setUint32(16, h4, false);
		return toHex(digest);
	};

	const ripemd160 = (message) => {
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const length = data.length * 8;
		const paddedLength = (((data.length + 8) >> 6) + 1) << 6;
		const buffer = new Uint8Array(paddedLength);
		buffer.set(data);
		buffer[data.length] = 0x80;
		const view = new DataView(buffer.buffer);
		view.setUint32(paddedLength - 8, length >>> 0, true);
		view.setUint32(paddedLength - 4, Math.floor(length / 2 ** 32), true);

		let h0 = 0x67452301;
		let h1 = 0xefcdab89;
		let h2 = 0x98badcfe;
		let h3 = 0x10325476;
		let h4 = 0xc3d2e1f0;

		const r1 = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5,
			2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4,
			13, 3, 7, 15, 14, 5, 6, 2
		];
		const r2 = [
			5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8,
			12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15,
			0, 5, 12, 2, 13, 9, 7, 10, 14
		];
		const s1 = [
			11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15,
			9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14,
			15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12
		];
		const s2 = [
			8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12,
			7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14,
			14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8
		];
		const k1 = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
		const k2 = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];

		for (let offset = 0; offset < paddedLength; offset += 64) {
			const words = new Uint32Array(16);
			const chunk = new DataView(buffer.buffer, offset, 64);
			for (let i = 0; i < 16; i += 1) {
				words[i] = chunk.getUint32(i * 4, true);
			}

			let al = h0;
			let bl = h1;
			let cl = h2;
			let dl = h3;
			let el = h4;
			let ar = h0;
			let br = h1;
			let cr = h2;
			let dr = h3;
			let er = h4;
			for (let i = 0; i < 80; i += 1) {
				const round = Math.floor(i / 16);
				const tl = rotateLeft(
					(al +
						(i < 16
							? bl ^ cl ^ dl
							: i < 32
								? (bl & cl) | (~bl & dl)
								: i < 48
									? (bl | ~cl) ^ dl
									: i < 64
										? (bl & dl) | (cl & ~dl)
										: bl ^ (cl | ~dl)) +
						words[r1[i]] +
						k1[round]) >>>
						0,
					s1[i]
				);
				const newTl = (tl + el) >>> 0;
				al = el;
				el = dl;
				dl = rotateLeft(cl, 10) >>> 0;
				cl = bl;
				bl = newTl;
				const tr = rotateLeft(
					(ar +
						(i < 16
							? (br & cr) | (~br & dr)
							: i < 32
								? (br | ~cr) ^ dr
								: i < 48
									? (br & dr) | (cr & ~dr)
									: i < 64
										? br ^ cr ^ dr
										: (br & cr) | (~br & dr)) +
						words[r2[i]] +
						k2[round]) >>>
						0,
					s2[i]
				);
				const newTr = (tr + er) >>> 0;
				ar = er;
				er = dr;
				dr = rotateLeft(cr, 10) >>> 0;
				cr = br;
				br = newTr;
			}
			const temp = (h1 + cl + dr) >>> 0;
			h1 = (h2 + dl + er) >>> 0;
			h2 = (h3 + el + ar) >>> 0;
			h3 = (h4 + al + br) >>> 0;
			h4 = (h0 + bl + cr) >>> 0;
			h0 = temp;
		}

		const digest = new Uint8Array(20);
		const digestView = new DataView(digest.buffer);
		digestView.setUint32(0, h0, true);
		digestView.setUint32(4, h1, true);
		digestView.setUint32(8, h2, true);
		digestView.setUint32(12, h3, true);
		digestView.setUint32(16, h4, true);
		return toHex(digest);
	};

	const computeHash = async () => {
		errorMessage = '';
		computedHash = '';
		matchState = '';
		if (!inputValue) return;
		try {
			if (selectedAlgorithm === 'md5') {
				computedHash = md5(inputValue);
			} else if (selectedAlgorithm === 'sha1') {
				computedHash = sha1(inputValue);
			} else if (selectedAlgorithm === 'ripemd160') {
				computedHash = ripemd160(inputValue);
			} else {
				const map = {
					sha256: 'SHA-256',
					sha512: 'SHA-512'
				};
				computedHash = await hashWithWebCrypto(map[selectedAlgorithm], inputValue);
			}
		} catch (error) {
			errorMessage = 'Unable to compute hash in this browser.';
		}
	};

	const normalizeHash = (value) => value.trim().toLowerCase().replace(/\s+/g, '');

	$: (inputValue, selectedAlgorithm, computeHash());
	$: {
		if (!expectedHash || !computedHash) {
			matchState = '';
		} else {
			matchState =
				normalizeHash(expectedHash) === normalizeHash(computedHash) ? 'match' : 'mismatch';
		}
	}
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Hash Verifier</h1>
			<p class="text-sm text-[var(--color-muted)]">Verify a digest matches the input value.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-[var(--color-muted)]" for="algorithm-select">Algorithm</label>
					<select id="algorithm-select" class="select-input" bind:value={selectedAlgorithm}>
						{#each algorithms as algorithm}
							<option value={algorithm.id}>{algorithm.label}</option>
						{/each}
					</select>
				</div>
				<div class="text-xs text-[var(--color-muted)]">Matches are case-insensitive.</div>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input</span>
					<textarea
						class="search-input min-h-[160px] resize-y"
						placeholder="Paste text to verify"
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Expected hash</span>
					<textarea
						class="search-input min-h-[160px] resize-y font-mono"
						placeholder="Paste expected hash"
						bind:value={expectedHash}
					></textarea>
				</label>
			</div>

			<div class="panel panel-muted p-5">
				<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Computed</p>
				<p class="mt-2 font-mono text-xs break-all">{computedHash || '--'}</p>
				{#if matchState}
					<p
						class={`mt-3 text-xs ${
							matchState === 'match' ? 'text-[var(--color-accent)]' : 'text-[var(--color-danger)]'
						}`}
					>
						{matchState === 'match' ? 'Match confirmed.' : 'Hash does not match.'}
					</p>
				{/if}
			</div>
		</section>
	</div>
</div>
