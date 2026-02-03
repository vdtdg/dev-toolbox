<script>
	import { base } from '$app/paths';
	import { X509Certificate } from '@peculiar/x509';

	const homeHref = base || '/';

	let pemValue = '';
	let output = [];
	let errorMessage = '';

	const formatDate = (date) =>
		new Intl.DateTimeFormat(undefined, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);

	const toHex = (bytes) =>
		Array.from(bytes)
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

	const formatFingerprint = (bytes, label) => {
		const hex = toHex(bytes);
		const pairs = hex.match(/.{2}/g) || [];
		return `${label}:${pairs.join(':')}`;
	};

	const parseCertificate = async () => {
		errorMessage = '';
		output = [];
		if (!pemValue.trim()) return;
		try {
			const cert = new X509Certificate(pemValue);
			const raw = cert.rawData || cert.raw;
			if (!raw) throw new Error('Certificate parsing failed.');
			const sha256 = await crypto.subtle.digest('SHA-256', raw);
			const sha1 = await crypto.subtle.digest('SHA-1', raw);
			const signatureAlgorithm =
				cert.signatureAlgorithm?.name ||
				(cert.signatureAlgorithm?.hash
					? `${cert.signatureAlgorithm.name} with ${cert.signatureAlgorithm.hash}`
					: '') ||
				'Unknown';
			output = [
				{ label: 'Subject', value: `${cert.subject}` },
				{ label: 'Issuer', value: `${cert.issuer}` },
				{ label: 'Serial Number', value: cert.serialNumber },
				{ label: 'Valid From', value: formatDate(cert.notBefore || cert.validFrom) },
				{ label: 'Valid To', value: formatDate(cert.notAfter || cert.validTo) },
				{ label: 'Signature Algorithm', value: signatureAlgorithm },
				{ label: 'Public Key Algorithm', value: cert.publicKey?.algorithm?.name || 'Unknown' },
				{
					label: 'Fingerprint (SHA-256)',
					value: formatFingerprint(new Uint8Array(sha256), 'SHA-256')
				},
				{ label: 'Fingerprint (SHA-1)', value: formatFingerprint(new Uint8Array(sha1), 'SHA-1') }
			];
		} catch (error) {
			errorMessage = error.message || 'Unable to parse certificate.';
		}
	};

	const handleFile = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		pemValue = await file.text();
	};

	$: (pemValue, parseCertificate());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">TLS Certificate Decoder</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Parse PEM certificates locally in your browser.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Upload PEM file</span>
					<input type="file" accept=".pem,.crt" class="search-input" on:change={handleFile} />
				</label>
			</div>

			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">PEM</span>
				<textarea
					class="search-input min-h-40 resize-y font-mono"
					placeholder="-----BEGIN CERTIFICATE-----"
					bind:value={pemValue}
				></textarea>
			</label>

			{#if errorMessage}
				<div class="alert alert-danger">{errorMessage}</div>
			{/if}

			<div class="panel panel-muted p-5">
				{#if output.length === 0}
					<p class="text-sm text-[var(--color-muted)]">No certificate data yet.</p>
				{:else}
					<ul class="space-y-3 text-sm">
						{#each output as row (row.label)}
							<li class="flex flex-col gap-1">
								<span class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">
									{row.label}
								</span>
								<span class="font-mono text-xs break-all">{row.value}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</section>
	</div>
</div>
