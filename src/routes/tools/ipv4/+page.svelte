<script>
	let addressInput = '';
	let prefixLength = 24;
	let errorMessage = '';
	let summary = null;

	const parseIPv4 = (value) => {
		const parts = value.split('.').map((part) => Number(part));
		if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return null;
		if (parts.some((part) => part < 0 || part > 255)) return null;
		return parts;
	};

	const parseCidrInput = (value, fallbackPrefix) => {
		const trimmed = value.trim();
		if (!trimmed) return { address: '', prefix: fallbackPrefix, hasPrefix: false, error: '' };
		if (trimmed.includes('/')) {
			const [address, prefixRaw] = trimmed.split('/');
			const prefix = Number(prefixRaw);
			if (!Number.isFinite(prefix) || prefix < 0 || prefix > 32) {
				return {
					address: address.trim(),
					prefix: fallbackPrefix,
					hasPrefix: true,
					error: 'Invalid CIDR prefix.'
				};
			}
			return { address: address.trim(), prefix, hasPrefix: true, error: '' };
		}
		return { address: trimmed, prefix: fallbackPrefix, hasPrefix: false, error: '' };
	};

	const toInt = (parts) =>
		(((parts[0] << 24) >>> 0) | ((parts[1] << 16) >>> 0) | ((parts[2] << 8) >>> 0) | parts[3]) >>>
		0;

	const toDotted = (value) =>
		[(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join('.');

	const toBinary = (parts) => parts.map((part) => part.toString(2).padStart(8, '0')).join('.');

	const toMask = (prefix) => (prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);

	const classify = (firstOctet) => {
		if (firstOctet >= 0 && firstOctet <= 127) return 'Class A';
		if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
		if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
		if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
		return 'Class E (Reserved)';
	};

	const computeSummary = () => {
		errorMessage = '';
		summary = null;
		const parsed = parseCidrInput(addressInput, Number(prefixLength) || 0);
		if (!addressInput.trim()) return;
		if (parsed.error) {
			errorMessage = parsed.error;
			return;
		}
		if (parsed.hasPrefix && parsed.prefix !== prefixLength) {
			prefixLength = parsed.prefix;
		}
		const parts = parseIPv4(parsed.address);
		if (!parts) {
			errorMessage = 'Invalid IPv4 address.';
			return;
		}
		const prefix = parsed.prefix;
		if (!Number.isFinite(prefix) || prefix < 0 || prefix > 32) {
			errorMessage = 'Prefix must be between 0 and 32.';
			return;
		}

		const ipInt = toInt(parts);
		const maskInt = toMask(prefix);
		const wildcardInt = ~maskInt >>> 0;
		const networkInt = ipInt & maskInt;
		const broadcastInt = networkInt | wildcardInt;
		const totalAddresses = 2 ** (32 - prefix);
		const usableHosts = prefix >= 31 ? 0 : Math.max(totalAddresses - 2, 0);
		const hostRange =
			usableHosts > 0
				? `${toDotted(networkInt + 1)} - ${toDotted(broadcastInt - 1)}`
				: prefix === 31
					? 'Point-to-point (/31)'
					: 'Single host (/32)';

		summary = {
			address: parsed.address,
			cidr: `${parsed.address}/${prefix}`,
			addressBinary: toBinary(parts),
			addressInt: ipInt,
			prefix,
			mask: toDotted(maskInt),
			maskBinary: toBinary([
				(maskInt >>> 24) & 255,
				(maskInt >>> 16) & 255,
				(maskInt >>> 8) & 255,
				maskInt & 255
			]),
			wildcard: toDotted(wildcardInt),
			network: toDotted(networkInt),
			broadcast: toDotted(broadcastInt),
			hostRange,
			totalAddresses,
			usableHosts,
			classLabel: classify(parts[0]),
			isPrivate:
				parts[0] === 10 ||
				(parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
				(parts[0] === 192 && parts[1] === 168),
			isLoopback: parts[0] === 127,
			isLinkLocal: parts[0] === 169 && parts[1] === 254,
			isMulticast: parts[0] >= 224 && parts[0] <= 239
		};
	};

	$: (addressInput, prefixLength, computeSummary());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">IPv4 Helper</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Analyze IPv4 addresses and CIDR blocks locally.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<div class="space-y-3">
					<label class="text-sm text-[var(--color-muted)]" for="ipv4-input">Address or CIDR</label>
					<input
						id="ipv4-input"
						type="text"
						class="search-input"
						placeholder="192.168.1.10/24"
						bind:value={addressInput}
					/>
					<p class="text-xs text-[var(--color-muted)]">
						Paste <span class="font-mono">192.168.1.10</span> or a CIDR like
						<span class="font-mono">10.0.0.0/16</span>.
					</p>
				</div>
				<div class="space-y-3">
					<label class="text-sm text-[var(--color-muted)]" for="prefix-input">CIDR prefix</label>
					<input
						id="prefix-input"
						type="number"
						min="0"
						max="32"
						class="search-input"
						bind:value={prefixLength}
					/>
					<p class="text-xs text-[var(--color-muted)]">Used when no prefix is provided.</p>
				</div>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-3">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">CIDR</p>
					<p class="mt-2 font-mono text-sm">{summary?.cidr || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Class</p>
					<p class="mt-2 text-sm">{summary?.classLabel || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Range</p>
					<p class="mt-2 text-sm">{summary?.hostRange || '--'}</p>
				</div>
			</div>

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Network</p>
					<p class="font-mono text-sm">Network: {summary?.network || '--'}</p>
					<p class="font-mono text-sm">Broadcast: {summary?.broadcast || '--'}</p>
					<p class="font-mono text-sm">Netmask: {summary?.mask || '--'}</p>
					<p class="font-mono text-sm">Wildcard: {summary?.wildcard || '--'}</p>
				</div>
				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Counts</p>
					<p class="text-sm">Total addresses: {summary?.totalAddresses ?? '--'}</p>
					<p class="text-sm">Usable hosts: {summary?.usableHosts ?? '--'}</p>
					<p class="text-sm">Private: {summary ? (summary.isPrivate ? 'Yes' : 'No') : '--'}</p>
					<p class="text-sm">Loopback: {summary ? (summary.isLoopback ? 'Yes' : 'No') : '--'}</p>
					<p class="text-sm">Link-local: {summary ? (summary.isLinkLocal ? 'Yes' : 'No') : '--'}</p>
					<p class="text-sm">Multicast: {summary ? (summary.isMulticast ? 'Yes' : 'No') : '--'}</p>
				</div>
			</div>

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Binary</p>
					<p class="mt-2 font-mono text-xs break-all">IP: {summary?.addressBinary || '--'}</p>
					<p class="mt-2 font-mono text-xs break-all">Mask: {summary?.maskBinary || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Integer</p>
					<p class="mt-2 font-mono text-sm">{summary?.addressInt ?? '--'}</p>
				</div>
			</div>
		</section>
	</div>
</div>
