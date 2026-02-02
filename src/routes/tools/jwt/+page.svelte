<script>
	const supportedAlgs = {
		HS256: 'SHA-256',
		HS384: 'SHA-384',
		HS512: 'SHA-512'
	};

	let token = '';
	let secret = '';
	let jwkValue = '';
	let clockSkew = 0;

	let headerJson = '';
	let payloadJson = '';
	let signatureValue = '';
	let parseError = '';
	let signatureStatus = '';
	let claimStatus = '';
	let claimDetails = [];

	const base64UrlToBytes = (value) => {
		const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
		const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
		const binary = atob(`${normalized}${padding}`);
		return Uint8Array.from(binary, (char) => char.charCodeAt(0));
	};

	const bytesToBase64Url = (bytes) => {
		const binary = String.fromCharCode(...bytes);
		return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
	};

	const decodePart = (value) => {
		const bytes = base64UrlToBytes(value);
		const text = new TextDecoder().decode(bytes);
		return { text, json: JSON.parse(text) };
	};

	const parseToken = () => {
		parseError = '';
		signatureStatus = '';
		claimStatus = '';
		claimDetails = [];
		headerJson = '';
		payloadJson = '';
		signatureValue = '';
		if (!token.trim()) return null;

		const parts = token.trim().split('.');
		if (parts.length !== 3) {
			parseError = 'JWT must have header, payload, and signature.';
			return null;
		}

		try {
			const header = decodePart(parts[0]);
			const payload = decodePart(parts[1]);
			headerJson = JSON.stringify(header.json, null, 2);
			payloadJson = JSON.stringify(payload.json, null, 2);
			signatureValue = parts[2];
			return { header: header.json, payload: payload.json, parts };
		} catch (error) {
			parseError = 'Unable to decode JWT parts.';
			return null;
		}
	};

	const getClockSkewSeconds = () => {
		const value = Number(clockSkew);
		return Number.isFinite(value) ? Math.max(0, value) : 0;
	};

	const validateClaims = (payload) => {
		const now = Math.floor(Date.now() / 1000);
		const skew = getClockSkewSeconds();
		const results = [];

		if (payload.exp) {
			results.push({
				label: 'exp',
				status: now <= payload.exp + skew ? 'valid' : 'invalid',
				value: payload.exp
			});
		}
		if (payload.nbf) {
			results.push({
				label: 'nbf',
				status: now + skew >= payload.nbf ? 'valid' : 'invalid',
				value: payload.nbf
			});
		}
		if (payload.iat) {
			results.push({
				label: 'iat',
				status: now + skew >= payload.iat ? 'valid' : 'invalid',
				value: payload.iat
			});
		}
		claimDetails = results;
		if (results.length === 0) {
			claimStatus = 'No exp/nbf/iat claims provided.';
			return;
		}
		const anyInvalid = results.some((item) => item.status === 'invalid');
		claimStatus = anyInvalid ? 'One or more claims failed.' : 'Claims valid within skew.';
	};

	const getSecretKeyBytes = () => {
		if (jwkValue.trim()) {
			const jwk = JSON.parse(jwkValue);
			if (jwk.kty !== 'oct' || !jwk.k) {
				throw new Error('JWK must be symmetric (kty=oct).');
			}
			return base64UrlToBytes(jwk.k);
		}
		if (!secret) return null;
		const encoder = new TextEncoder();
		return encoder.encode(secret);
	};

	const verifySignature = async (header, parts) => {
		signatureStatus = '';
		const algorithm = header.alg;
		if (!algorithm) {
			signatureStatus = 'Missing alg in header.';
			return;
		}
		if (algorithm === 'none') {
			signatureStatus = parts[2] ? 'Signature present but alg is none.' : 'Unsigned token.';
			return;
		}
		if (!supportedAlgs[algorithm]) {
			signatureStatus = 'Algorithm not supported for verification.';
			return;
		}

		try {
			const keyBytes = getSecretKeyBytes();
			if (!keyBytes) {
				signatureStatus = 'Provide a secret or JWK to verify.';
				return;
			}
			const encoder = new TextEncoder();
			const data = encoder.encode(`${parts[0]}.${parts[1]}`);
			const hash = supportedAlgs[algorithm];
			const signingKey = await crypto.subtle.importKey(
				'raw',
				keyBytes,
				{ name: 'HMAC', hash },
				false,
				['sign']
			);
			const signature = await crypto.subtle.sign('HMAC', signingKey, data);
			const calculated = bytesToBase64Url(new Uint8Array(signature));
			signatureStatus = calculated === parts[2] ? 'Signature valid.' : 'Signature mismatch.';
		} catch (error) {
			signatureStatus = 'Unable to verify signature.';
		}
	};

	const runAll = async () => {
		const parsed = parseToken();
		if (!parsed) return;
		validateClaims(parsed.payload);
		await verifySignature(parsed.header, parsed.parts);
	};

	$: (token, secret, jwkValue, clockSkew, runAll());
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">JWT Helper</h1>
			<p class="text-sm text-[var(--color-muted)]">
				Decode tokens, validate time-based claims, and verify HMAC signatures.
			</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">JWT</span>
				<textarea
					class="search-input min-h-[140px] resize-y"
					placeholder="Paste your JWT here"
					bind:value={token}
				></textarea>
			</label>

			<div class="grid gap-4 lg:grid-cols-3">
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Shared secret</span>
					<input type="text" class="search-input" placeholder="Optional" bind:value={secret} />
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">JWK (oct)</span>
					<textarea
						class="search-input min-h-[90px] resize-y"
						placeholder={'{"kty":"oct","k":"..."}'}
						bind:value={jwkValue}
					></textarea>
				</label>
				<label class="space-y-2 text-sm">
					<span class="text-[var(--color-muted)]">Clock skew (seconds)</span>
					<input type="number" min="0" class="search-input" bind:value={clockSkew} />
				</label>
			</div>

			{#if parseError}
				<div class="alert alert-danger">{parseError}</div>
			{/if}

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Header</p>
					<pre class="text-xs text-[var(--color-text)]">{headerJson || '--'}</pre>
				</div>
				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Payload</p>
					<pre class="text-xs text-[var(--color-text)]">{payloadJson || '--'}</pre>
				</div>
			</div>

			<div class="grid gap-4 lg:grid-cols-2">
				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Signature</p>
					<p class="font-mono text-xs">{signatureValue || '--'}</p>
					<p class="text-xs text-[var(--color-muted)]">
						{signatureStatus || 'Signature not verified yet.'}
					</p>
				</div>
				<div class="panel panel-muted space-y-3 p-5">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Claims</p>
					<p class="text-xs text-[var(--color-muted)]">
						{claimStatus || 'No claim check performed.'}
					</p>
					{#if claimDetails.length > 0}
						<ul class="space-y-2 text-xs">
							{#each claimDetails as claim}
								<li class="flex items-center justify-between">
									<span class="font-mono">{claim.label}: {claim.value}</span>
									<span
										class={claim.status === 'valid'
											? 'text-[var(--color-accent)]'
											: 'text-[var(--color-danger)]'}
									>
										{claim.status}
									</span>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</section>
	</div>
</div>
