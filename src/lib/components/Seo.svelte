<script>
	const siteName = 'Dev Toolbox';
	const defaultImage = 'https://dtdg.fr/dev-toolbox/android-chrome-512x512.png';

	let {
		title,
		description,
		canonicalUrl,
		keywords = '',
		type = 'website',
		image = defaultImage,
		jsonLd = null
	} = $props();

	let fullTitle = $derived(title?.includes(siteName) ? title : `${title} | ${siteName}`);
	let jsonLdString = $derived(jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '');
	const jsonLdTag = 'script';
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
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
		<svelte:element this={jsonLdTag} type="application/ld+json">{@html jsonLdString}</svelte:element
		>
	{/if}
</svelte:head>
