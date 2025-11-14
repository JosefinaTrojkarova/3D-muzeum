<script lang="ts">
	const props = $props<{ visible?: boolean; onResume?: () => void }>();
	const visible = $derived(props.visible ?? false);

	function handleResume() {
		props.onResume?.();
	}
</script>

{#if visible}
	<div class="pause-overlay" tabindex="-1">
		<div class="aura aura-one"></div>
		<div class="aura aura-two"></div>
		<div class="grain"></div>

		<section class="pause-panel">
			<header class="hero">
				<p class="eyebrow">Session paused</p>
				<h2>Take a breath</h2>
				<p class="tagline">Your tour is waiting right where you left it. Press ESC or hit resume to dive back in.</p>
			</header>

			<div class="status-pill">
				<span class="pulse-dot"></span>
				<span>Gallery is held in stasis</span>
			</div>

			<div class="controls-card">
				<p class="card-label">Controls</p>
				<div class="controls-grid">
					<div class="control">
						<span class="key">WASD</span>
						<span class="action">Move around</span>
					</div>
					<div class="control">
						<span class="key">Mouse</span>
						<span class="action">Look around</span>
					</div>
					<div class="control">
						<span class="key">Space</span>
						<span class="action">Jump</span>
					</div>
					<div class="control">
						<span class="key">Shift</span>
						<span class="action">Hold to run</span>
					</div>
					<div class="control">
						<span class="key">C</span>
						<span class="action">Zoom in/out</span>
					</div>
				</div>
			</div>

			<div class="actions">
				<button type="button" onclick={handleResume}>
					Resume tour
				</button>
			</div>
		</section>
	</div>
{/if}

<style>
	.pause-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle at 10% 10%, rgba(61, 29, 255, 0.35), rgba(5, 5, 20, 0.95));
		backdrop-filter: blur(12px);
		z-index: 200;
		overflow: hidden;
		color: #f6f6f6;
		font-family: "Space Grotesk", "Inter", system-ui, sans-serif;
	}

	.aura {
		position: absolute;
		width: 45vmax;
		height: 45vmax;
		filter: blur(120px);
		opacity: 0.65;
		animation: drift 18s ease-in-out infinite;
	}

	.aura-one {
		top: -15vmax;
		left: -20vmax;
		background: #8c5bff;
	}

	.aura-two {
		bottom: -20vmax;
		right: -25vmax;
		background: #00c6ff;
		animation-delay: -7s;
	}

	.grain {
		position: absolute;
		inset: 0;
		background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.15"/%3E%3C/svg%3E');
		pointer-events: none;
		mix-blend-mode: screen;
	}

	.pause-panel {
		position: relative;
		width: min(90vw, 520px);
		padding: 2.5rem;
		border-radius: 28px;
		background: rgba(5, 5, 20, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(26px);
		box-shadow: 0 40px 120px rgba(3, 5, 20, 0.65);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hero {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.eyebrow {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.3em;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.55);
	}

	.hero h2 {
		margin: 0;
		font-size: clamp(2rem, 4vw, 2.6rem);
		font-weight: 600;
		background: linear-gradient(120deg, #ffffff 20%, #b5c9ff 60%, #67e8f9 100%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.tagline {
		margin: 0;
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.status-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.7rem 1.1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		font-size: 0.85rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.pulse-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #67e8f9;
		position: relative;
	}

	.pulse-dot::after {
		content: "";
		position: absolute;
		inset: -6px;
		border-radius: 50%;
		border: 1px solid rgba(103, 232, 249, 0.45);
		animation: pulse 1.6s infinite;
	}

	.controls-card {
		border-radius: 20px;
		padding: 1.25rem 1.5rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.06);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card-label {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.3em;
		font-size: 0.72rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.8rem;
	}

	.control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.7rem 1rem;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.04);
		font-size: 0.9rem;
	}

	.key {
		font-weight: 600;
		letter-spacing: 0.1em;
	}

	.action {
		color: rgba(255, 255, 255, 0.7);
		text-align: right;
	}

	.actions button {
		width: 100%;
		padding: 0.9rem 2.2rem;
		border-radius: 999px;
		border: none;
		font-size: 1rem;
		font-weight: 600;
		color: #050514;
		background: linear-gradient(120deg, #ffffff 0%, #7dd3fc 50%, #c084fc 100%);
		box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
		cursor: pointer;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.actions button:hover,
	.actions button:focus-visible {
		transform: translateY(-2px);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
		outline: none;
	}

	.actions button:active {
		transform: translateY(0);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
	}

	@media (max-width: 560px) {
		.pause-panel {
			padding: 2rem;
			border-radius: 22px;
		}

		.controls-grid {
			grid-template-columns: 1fr;
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(0.8);
			opacity: 0.7;
		}
		50% {
			transform: scale(1.2);
			opacity: 0;
		}
		100% {
			transform: scale(0.8);
			opacity: 0;
		}
	}

	@keyframes drift {
		0%,
		100% {
			transform: translate3d(0, 0, 0);
		}
		50% {
			transform: translate3d(50px, -30px, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.aura,
		.pulse-dot::after {
			animation: none;
		}
	}
</style>
