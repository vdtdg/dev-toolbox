<script>
	import { base as basePath } from '$app/paths';

	const homeHref = basePath ? `${basePath}/` : '/';

	const encoders = [
		{ id: 'base32', label: 'Base32 (RFC 4648)' },
		{ id: 'base58', label: 'Base58 (Bitcoin)' },
		{ id: 'base85', label: 'Base85 (ASCII85)' }
	];

	const modes = [
		{ id: 'encode', label: 'Encode' },
		{ id: 'decode', label: 'Decode' }
	];

	let encoder = 'base32';
	let mode = 'encode';
	let inputValue = '';
	let outputValue = '';
	let errorMessage = '';

	const encoderText = new TextEncoder();
	const decoderText = new TextDecoder();

	const toBytes = (value) => encoderText.encode(value);
	const fromBytes = (bytes) => decoderText.decode(bytes);

	const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
	const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
	const base85Offset = 33;

	const base32Encode = (bytes) => {
		let output = '';
		let buffer = 0;
		let bits = 0;
		bytes.forEach((byte) => {
			buffer = (buffer << 8) | byte;
			bits += 8;
			while (bits >= 5) {
				bits -= 5;
				output += base32Alphabet[(buffer >>> bits) & 31];
			}
		});
		if (bits > 0) {
			output += base32Alphabet[(buffer << (5 - bits)) & 31];
		}
		const padding = output.length % 8 === 0 ? 0 : 8 - (output.length % 8);
		return output + '='.repeat(padding);
	};

	const base32Decode = (value) => {
		const clean = value.toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '');
		let buffer = 0;
		let bits = 0;
		const bytes = [];
		for (const char of clean) {
			const index = base32Alphabet.indexOf(char);
			if (index === -1) {
				throw new Error('Invalid Base32 character.');
			}
			buffer = (buffer << 5) | index;
			bits += 5;
			if (bits >= 8) {
				bits -= 8;
				bytes.push((buffer >>> bits) & 255);
			}
		}
		return new Uint8Array(bytes);
	};

	const base58Encode = (bytes) => {
		if (!bytes.length) return '';
		let value = 0n;
		bytes.forEach((byte) => {
			value = (value << 8n) + BigInt(byte);
		});
		let output = '';
		while (value > 0n) {
			const mod = value % 58n;
			output = base58Alphabet[Number(mod)] + output;
			value /= 58n;
		}
		let zeros = 0;
		for (const byte of bytes) {
			if (byte === 0) zeros += 1;
			else break;
		}
		return base58Alphabet[0].repeat(zeros) + output;
	};

	const base58Decode = (value) => {
		const clean = value.trim();
		if (!clean) return new Uint8Array();
		let result = 0n;
		for (const char of clean) {
			const index = base58Alphabet.indexOf(char);
			if (index === -1) {
				throw new Error('Invalid Base58 character.');
			}
			result = result * 58n + BigInt(index);
		}
		const bytes = [];
		while (result > 0n) {
			bytes.unshift(Number(result % 256n));
			result /= 256n;
		}
		let leadingZeros = 0;
		for (const char of clean) {
			if (char === base58Alphabet[0]) leadingZeros += 1;
			else break;
		}
		if (leadingZeros) {
			bytes.unshift(...new Array(leadingZeros).fill(0));
		}
		return new Uint8Array(bytes);
	};

	const base85Encode = (bytes) => {
		if (!bytes.length) return '';
		let output = '';
		for (let i = 0; i < bytes.length; i += 4) {
			const chunk = bytes.slice(i, i + 4);
			const padding = 4 - chunk.length;
			const padded = new Uint8Array(4);
			padded.set(chunk);
			let value = (padded[0] * 256 ** 3 + padded[1] * 256 ** 2 + padded[2] * 256 + padded[3]) >>> 0;
			const digits = new Array(5).fill(0).map(() => {
				const mod = value % 85;
				value = Math.floor(value / 85);
				return mod;
			});
			digits.reverse();
			const chars = digits.map((digit) => String.fromCharCode(digit + base85Offset)).join('');
			output += padding ? chars.slice(0, 5 - padding) : chars;
		}
		return output;
	};

	const base85Decode = (value) => {
		const clean = value.replace(/\s+/g, '');
		if (!clean) return new Uint8Array();
		const bytes = [];
		for (let i = 0; i < clean.length; i += 5) {
			const block = clean.slice(i, i + 5);
			const padding = 5 - block.length;
			const padded = block.padEnd(5, 'u');
			let valueBlock = 0;
			for (const char of padded) {
				const code = char.charCodeAt(0) - base85Offset;
				if (code < 0 || code >= 85) {
					throw new Error('Invalid Base85 character.');
				}
				valueBlock = valueBlock * 85 + code;
			}
			const chunk = [
				(valueBlock >>> 24) & 255,
				(valueBlock >>> 16) & 255,
				(valueBlock >>> 8) & 255,
				valueBlock & 255
			];
			const length = padding ? 4 - padding : 4;
			bytes.push(...chunk.slice(0, length));
		}
		return new Uint8Array(bytes);
	};

	const transform = () => {
		errorMessage = '';
		outputValue = '';
		if (!inputValue.trim()) return;
		try {
			if (mode === 'encode') {
				const bytes = toBytes(inputValue);
				if (encoder === 'base32') outputValue = base32Encode(bytes);
				if (encoder === 'base58') outputValue = base58Encode(bytes);
				if (encoder === 'base85') outputValue = base85Encode(bytes);
				return;
			}
			let bytes = new Uint8Array();
			if (encoder === 'base32') bytes = base32Decode(inputValue);
			if (encoder === 'base58') bytes = base58Decode(inputValue);
			if (encoder === 'base85') bytes = base85Decode(inputValue);
			outputValue = fromBytes(bytes);
		} catch (error) {
			errorMessage = error.message || 'Unable to decode input.';
		}
	};

	$: (encoder, mode, inputValue, transform());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Base-N Encoders</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Encode or decode Base32, Base58, and Base85 strings locally.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Encoding</span>
					<select class="select-input" bind:value={encoder}>
						{#each encoders as option}
							<option value={option.id}>{option.label}</option>
						{/each}
					</select>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Mode</span>
					<select class="select-input" bind:value={mode}>
						{#each modes as option}
							<option value={option.id}>{option.label}</option>
						{/each}
					</select>
				</label>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Input</span>
					<textarea
						class="search-input min-h-45 resize-y"
						placeholder={mode === 'encode' ? 'Paste text to encode' : 'Paste encoded string'}
						bind:value={inputValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Output</span>
					<textarea class="search-input min-h-45 resize-y" readonly value={outputValue}></textarea>
				</label>
			</div>

			<p class="text-xs text-[var(--color-muted)]">
				Base32 uses RFC 4648 padding, Base58 uses the Bitcoin alphabet, and Base85 is ASCII85
				without zero compression.
			</p>
		</section>
	</div>
</div>
