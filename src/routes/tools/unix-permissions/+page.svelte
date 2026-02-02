<script>
	let octalInput = '';
	let errorMessage = '';
	let summary = null;

	const trimLeadingZeros = (value) => {
		let result = value;
		while (result.length > 4 && result.startsWith('0')) {
			result = result.slice(1);
		}
		return result;
	};

	const parseOctal = (value) => {
		const normalized = value.trim().toLowerCase();
		if (!normalized) return null;
		let cleaned = normalized.replace(/^chmod\s+/, '').replace(/^0o/, '');
		cleaned = cleaned.replace(/\s+/g, '');
		cleaned = trimLeadingZeros(cleaned);
		if (!/^[0-7]+$/.test(cleaned)) {
			throw new Error('Octal values can only contain digits 0-7.');
		}
		if (cleaned.length < 3 || cleaned.length > 4) {
			throw new Error('Enter a 3 or 4 digit octal value (e.g. 644 or 0755).');
		}
		const digits = cleaned.split('').map((digit) => Number(digit));
		if (digits.some((digit) => Number.isNaN(digit))) {
			throw new Error('Invalid octal value.');
		}
		const special = digits.length === 4 ? digits[0] : 0;
		const perms = digits.length === 4 ? digits.slice(1) : digits;
		return { special, perms, raw: cleaned };
	};

	const toRwx = (value) => {
		const flags = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
		return flags[value] || '---';
	};

	const applySpecialBits = (rwx, special, position) => {
		const chars = rwx.split('');
		if (position === 'user' && special & 4) {
			chars[2] = chars[2] === 'x' ? 's' : 'S';
		}
		if (position === 'group' && special & 2) {
			chars[2] = chars[2] === 'x' ? 's' : 'S';
		}
		if (position === 'other' && special & 1) {
			chars[2] = chars[2] === 'x' ? 't' : 'T';
		}
		return chars.join('');
	};

	const buildSymbolic = (user, group, other, special) => {
		const base = `${user}${group}${other}`;
		const parts = [];
		if (special & 4) parts.push('setuid');
		if (special & 2) parts.push('setgid');
		if (special & 1) parts.push('sticky');
		return { base, flags: parts.join(', ') || 'none' };
	};

	const updateSummary = () => {
		errorMessage = '';
		summary = null;
		if (!octalInput.trim()) return;
		try {
			const parsed = parseOctal(octalInput);
			if (!parsed) return;
			const [userDigit, groupDigit, otherDigit] = parsed.perms;
			const userRaw = toRwx(userDigit);
			const groupRaw = toRwx(groupDigit);
			const otherRaw = toRwx(otherDigit);
			const user = applySpecialBits(userRaw, parsed.special, 'user');
			const group = applySpecialBits(groupRaw, parsed.special, 'group');
			const other = applySpecialBits(otherRaw, parsed.special, 'other');
			const symbolic = buildSymbolic(user, group, other, parsed.special);
			summary = {
				octal: parsed.raw.padStart(3, '0'),
				chmod: `chmod ${parsed.raw.padStart(3, '0')}`,
				special: parsed.special,
				user: { digit: userDigit, rwx: user },
				group: { digit: groupDigit, rwx: group },
				other: { digit: otherDigit, rwx: other },
				string: symbolic.base,
				flags: symbolic.flags
			};
		} catch (error) {
			errorMessage = error.message || 'Unable to parse permissions.';
		}
	};

	$: (octalInput, updateSummary());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Unix Permission Calculator</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Decode octal chmod values into readable permissions.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Octal input</span>
					<input
						type="text"
						class="search-input"
						placeholder="755 or 0644"
						bind:value={octalInput}
					/>
				</label>
				<div
					class="rounded-xl border border-[var(--color-border)] bg-[rgba(10,14,20,0.6)] p-4 text-xs text-[var(--color-muted)]"
				>
					<p>Accepted formats</p>
					<p class="mt-2 font-mono">755, 0644, 4755, chmod 640</p>
				</div>
			</div>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-3">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">
						Permission String
					</p>
					<p class="mt-2 font-mono text-sm">{summary?.string || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Special Bits</p>
					<p class="mt-2 text-sm">{summary?.flags || '--'}</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Chmod</p>
					<p class="mt-2 font-mono text-sm">{summary?.chmod || '--'}</p>
				</div>
			</div>

			<div class="grid gap-4 lg:grid-cols-3">
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Owner</p>
					<p class="mt-2 font-mono text-sm">
						{summary ? `${summary.user.digit} → ${summary.user.rwx}` : '--'}
					</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Group</p>
					<p class="mt-2 font-mono text-sm">
						{summary ? `${summary.group.digit} → ${summary.group.rwx}` : '--'}
					</p>
				</div>
				<div class="panel panel-muted p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Other</p>
					<p class="mt-2 font-mono text-sm">
						{summary ? `${summary.other.digit} → ${summary.other.rwx}` : '--'}
					</p>
				</div>
			</div>
		</section>
	</div>
</div>
