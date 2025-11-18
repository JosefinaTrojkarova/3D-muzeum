<script lang="ts">
	import { onMount } from 'svelte';
	import '$lib/styles/reset.css';

	let { children } = $props();
	let showTouchNotice = $state(false);
	const BODY_LOCK_CLASS = 'touch-notice-lock';

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

		const hasTouchInput = () => {
			if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) {
				return true;
			}

			const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
			const anyCoarsePointer = window.matchMedia('(any-pointer: coarse)').matches;
			const noHover = window.matchMedia('(hover: none)').matches;

			return coarsePointer || anyCoarsePointer || noHover;
		};

		const isLikelyMobile = () => {
			const nav = navigator as Navigator & {
				userAgentData?: { mobile?: boolean };
			};

			if (nav.userAgentData?.mobile) {
				return true;
			}

			const ua = nav.userAgent?.toLowerCase() ?? '';
			const mobileRegex = /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/;

			// Require a mobile user agent to avoid flagging hybrid touch laptops like Surface
			return mobileRegex.test(ua);
		};

		return hasTouchInput() && isLikelyMobile();
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
