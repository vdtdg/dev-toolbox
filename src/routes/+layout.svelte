<script>
	import './layout.css';
	import { base } from '$app/paths';

	let { children } = $props();
	const assetBase = base || '';
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={`${assetBase}/apple-touch-icon.png`} />
	<link rel="icon" type="image/png" sizes="32x32" href={`${assetBase}/favicon-32x32.png`} />
	<link rel="icon" type="image/png" sizes="16x16" href={`${assetBase}/favicon-16x16.png`} />
	<link rel="icon" href={`${assetBase}/favicon.ico`} />
	<link rel="manifest" href={`${assetBase}/site.webmanifest`} />
</svelte:head>
{@render children()}
