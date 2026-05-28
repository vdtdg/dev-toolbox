<script>
	const siteName = 'Dev Toolbox';
	const defaultImage = 'https://dtdg.fr/dev-toolbox/android-chrome-512x512.png';

	let {
		title,
		description,
		canonicalUrl,
		type = 'website',
		image = defaultImage,
		jsonLd = null
	} = $props();

	$: fullTitle = title?.includes(siteName) ? title : `${title} - ${siteName}`;
	$: jsonLdString = jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '';
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={image} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#if jsonLdString}
		{@html `<script type="application/ld+json">${jsonLdString}</script>`}
	{/if}
</svelte:head>
