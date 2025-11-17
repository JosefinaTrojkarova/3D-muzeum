<script lang="ts">
	import '$lib/styles/reset.css';

	let { children } = $props();

	const siteTitle = '3D Museum';
	const siteDescription = 'Explore an immersive 3D art gallery built with SvelteKit, Three.js, and Rapier physics.';
	const siteImage = '/ogimage.png';
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="description" content={siteDescription}>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content={siteTitle}>
	<meta property="og:title" content={siteTitle}>
	<meta property="og:description" content={siteDescription}>
	<meta property="og:image" content={siteImage}>
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content={siteTitle}>
	<meta name="twitter:description" content={siteDescription}>
	<meta name="twitter:image" content={siteImage}>
</svelte:head>

{@render children()}
