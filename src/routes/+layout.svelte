<script lang="ts">
	import { onMount } from 'svelte';
	import '$lib/styles/reset.css';

	let { children } = $props();
	let showTouchNotice = $state(false);
	const BODY_LOCK_CLASS = 'touch-notice-lock';

	const siteTitle = '3D Museum';
	const siteDescription = 'Explore an immersive 3D art gallery built with SvelteKit, Three.js, and Rapier physics.';
	const siteImage = '/ogimage.png';

	const updateBodyLock = (active: boolean) => {
		if (typeof document === 'undefined') {
			return;
		}

		document.body.classList.toggle(BODY_LOCK_CLASS, active);
	};

	const detectTouchSupport = () => {
		if (typeof window === 'undefined' || typeof navigator === 'undefined') {
			return false;
		}

		if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) {
			return true;
		}

		const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
		const anyCoarsePointer = window.matchMedia('(any-pointer: coarse)').matches;
		const noHover = window.matchMedia('(hover: none)').matches;

		return coarsePointer || anyCoarsePointer || noHover;
	};

	onMount(() => {
		const updateTouchState = () => {
			const shouldShow = detectTouchSupport();
			showTouchNotice = shouldShow;
			updateBodyLock(shouldShow);
		};

		updateTouchState();

		const mediaQueries = ['(pointer: coarse)', '(any-pointer: coarse)', '(hover: none)'];
		const mqls = mediaQueries.map((query) => window.matchMedia(query));
		const handleChange = () => updateTouchState();

		mqls.forEach((mql) => mql.addEventListener('change', handleChange));
		window.addEventListener('touchstart', updateTouchState, { passive: true });

		return () => {
			mqls.forEach((mql) => mql.removeEventListener('change', handleChange));
			window.removeEventListener('touchstart', updateTouchState);
			updateBodyLock(false);
		};
	});
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

{#if showTouchNotice}
	<div class="device-notice" aria-live="polite" role="status">
		<div class="device-notice__panel">
			<p class="device-notice__title">Visit from desktop</p>
			<p>For the best experience, open this 3D museum on a desktop or laptop computer.</p>
		</div>
	</div>
{/if}

<style>
	:global(body.touch-notice-lock) {
		overflow: hidden;
		background: #fff;
	}

	:global(body.touch-notice-lock #svelte) {
		background: #fff;
	}

	.device-notice {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(1rem, 5vw, 2.5rem);
		background: #fff;
		z-index: 9999;
		overflow: hidden;
	}

	.device-notice__panel {
		max-width: min(22rem, 90vw);
		width: 100%;
		text-align: center;
		border-radius: 1rem;
		padding: 2rem 1.5rem;
		background: #fff;
		color: #111;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
	}

	.device-notice__title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.device-notice p {
		margin: 0;
		line-height: 1.45;
		font-size: 1rem;
	}
</style>
