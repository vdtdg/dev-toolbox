<script>
	import { base as basePath } from '$app/paths';

	const homeHref = basePath ? `${basePath}/` : '/';

	const algorithms = [
		{ id: 'sha256', label: 'SHA-256' },
		{ id: 'md5', label: 'MD5' }
	];

	let algorithm = 'sha256';
	let inputValue = '';
	let fingerprint = '';
	let errorMessage = '';
	let keyType = '';
	let keyComment = '';
	let keyByteLength = null;

	const normalizeBase64 = (value) => {
		const trimmed = value.replace(/\s+/g, '');
		const standardized = trimmed.replace(/-/g, '+').replace(/_/g, '/');
		const padding = standardized.length % 4 === 0 ? '' : '='.repeat(4 - (standardized.length % 4));
		return standardized + padding;
	};

	const base64ToBytes = (value) => {
		const normalized = normalizeBase64(value);
		const binary = atob(normalized);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	};

	const bytesToBase64 = (bytes) => {
		let binary = '';
		bytes.forEach((byte) => {
			binary += String.fromCharCode(byte);
		});
		return btoa(binary);
	};

	const toHex = (bytes) =>
		Array.from(bytes)
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

	const rotateLeft = (value, bits) => ((value << bits) | (value >>> (32 - bits))) >>> 0;

	const md5Bytes = (bytes) => {
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
		return digest;
	};

	const parseKey = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return null;

		if (trimmed.includes('BEGIN SSH2 PUBLIC KEY')) {
			const lines = trimmed.split(/\r?\n/);
			const base64Lines = lines.filter((line) => /^[A-Za-z0-9+/=]+$/.test(line));
			const base64 = base64Lines.join('');
			return { base64, type: 'ssh2', comment: '' };
		}

		const tokens = trimmed.split(/\s+/).filter(Boolean);
		if (tokens.length >= 2 && /^(ssh|ecdsa|sk)-/.test(tokens[0])) {
			return {
				base64: tokens[1],
				type: tokens[0],
				comment: tokens.slice(2).join(' ')
			};
		}

		const base64Token = tokens.find(
			(token) => /^[A-Za-z0-9+/=]+$/.test(token) && token.length > 20
		);
		if (base64Token) {
			return { base64: base64Token, type: 'public key', comment: '' };
		}

		return null;
	};

	const formatMd5Fingerprint = (bytes) => {
		const hex = toHex(bytes);
		const pairs = hex.match(/.{2}/g) || [];
		return `MD5:${pairs.join(':')}`;
	};

	const formatSha256Fingerprint = (bytes) => {
		const encoded = bytesToBase64(bytes).replace(/=+$/, '');
		return `SHA256:${encoded}`;
	};

	const computeFingerprint = async () => {
		errorMessage = '';
		fingerprint = '';
		keyType = '';
		keyComment = '';
		keyByteLength = null;
		if (!inputValue.trim()) {
			return;
		}
		const parsed = parseKey(inputValue);
		if (!parsed?.base64) {
			errorMessage = 'No SSH public key data found.';
			return;
		}
		try {
			const keyBytes = base64ToBytes(parsed.base64);
			keyByteLength = keyBytes.length;
			keyType = parsed.type || 'public key';
			keyComment = parsed.comment || '';
			if (algorithm === 'sha256') {
				const digest = await crypto.subtle.digest('SHA-256', keyBytes);
				fingerprint = formatSha256Fingerprint(new Uint8Array(digest));
				return;
			}
			const md5Digest = md5Bytes(keyBytes);
			fingerprint = formatMd5Fingerprint(md5Digest);
		} catch (error) {
			errorMessage = 'Invalid SSH public key or unsupported format.';
		}
	};

	$: (inputValue, algorithm, computeFingerprint());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">SSH Key Fingerprint</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Generate MD5 or SHA-256 fingerprints from SSH public keys locally.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="w-full sm:max-w-xs">
					<label class="text-sm text-[var(--color-muted)]" for="algorithm-select">Algorithm</label>
					<select id="algorithm-select" class="select-input" bind:value={algorithm}>
						{#each algorithms as item}
							<option value={item.id}>{item.label}</option>
						{/each}
					</select>
				</div>
				<p class="text-xs text-[var(--color-muted)]">
					Accepts OpenSSH public keys like <span class="font-mono">ssh-ed25519 AAAA... comment</span
					>.
				</p>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Public key input</span>
					<textarea
						class="search-input min-h-45 resize-y"
						placeholder="Paste an SSH public key"
						bind:value={inputValue}
					></textarea>
				</label>
				<div class="space-y-4">
					<div class="panel panel-muted p-5">
						<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Fingerprint</p>
						<p class="mt-2 font-mono text-xs break-all">{fingerprint || '--'}</p>
					</div>
					<div class="grid gap-3 sm:grid-cols-3">
						<div class="panel panel-muted p-4">
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Key Type</p>
							<p class="mt-1 text-sm">{keyType || '--'}</p>
						</div>
						<div class="panel panel-muted p-4">
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Comment</p>
							<p class="mt-1 text-sm break-words">{keyComment || '--'}</p>
						</div>
						<div class="panel panel-muted p-4">
							<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Bytes</p>
							<p class="mt-1 text-sm">{keyByteLength ?? '--'}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
