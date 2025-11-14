<script lang="ts">
    interface Props {
        isLoading: boolean;
        isReady: boolean;
        hasEntered: boolean;
        onEnter: () => void;
    }

    let { isLoading, isReady, hasEntered, onEnter }: Props = $props();
</script>

{#if !hasEntered}
    <div class="loading-screen" class:fade-out={hasEntered}>
        <div class="aura aura-one"></div>
        <div class="aura aura-two"></div>
        <div class="grain"></div>

        <section class="loading-panel">
            <header class="hero">
                <p class="eyebrow">Immersive gallery experience</p>
                <h1>3D Museum</h1>
                <p class="tagline">An atmospheric walkthrough of curated masterpieces rendered in real time.</p>
            </header>

            <div class="status-block">
                {#if isLoading}
                    <div class="status-pill">
                        <span class="pulse-dot"></span>
                        <span>Calibrating the exhibition space</span>
                    </div>
                    <div class="loader">
                        <div class="ring"></div>
                        <p class="loading-text">Loading experience...</p>
                    </div>
                {:else if isReady}
                    <div class="status-pill ready">
                        <span class="pulse-dot"></span>
                        <span>Experience ready</span>
                    </div>
                    <button class="enter-button" onclick={onEnter}>
                        Enter Museum
                    </button>
                {:else}
                    <div class="status-pill">
                        <span class="pulse-dot"></span>
                        <span>Preparing gallery assets</span>
                    </div>
                {/if}
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

            <footer class="meta">
                <span class="author">Author: Andre</span>
                <span class="hint">Best experienced fullscreen</span>
            </footer>
        </section>
    </div>
{/if}

<style>
    .loading-screen {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at 20% 20%, #3d1dff 0%, #0b0b18 55%, #03030d 100%);
        overflow: hidden;
        z-index: 1000;
        color: #f6f6f6;
        font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
        transition: opacity 0.8s ease, visibility 0.8s ease;
    }

    .loading-screen.fade-out {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .aura {
        position: absolute;
        width: 50vmax;
        height: 50vmax;
        filter: blur(120px);
        opacity: 0.7;
        animation: drift 16s ease-in-out infinite;
    }

    .aura-one {
        top: -10vmax;
        left: -20vmax;
        background: #8c5bff;
    }

    .aura-two {
        bottom: -15vmax;
        right: -25vmax;
        background: #00c6ff;
        animation-delay: -6s;
    }

    .grain {
        position: absolute;
        inset: 0;
        background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.15"/%3E%3C/svg%3E');
        mix-blend-mode: screen;
        pointer-events: none;
    }

    .loading-panel {
        position: relative;
        width: min(560px, 90vw);
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2.5rem;
        border-radius: 28px;
        background: rgba(5, 5, 20, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(32px);
        box-shadow: 0 40px 120px rgba(3, 5, 20, 0.65);
    }

    .hero {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 0.78rem;
        color: rgba(255, 255, 255, 0.6);
    }

    .hero h1 {
        margin: 0;
        font-size: clamp(2.5rem, 4vw, 3.5rem);
        font-weight: 600;
        line-height: 1.05;
        background: linear-gradient(120deg, #ffffff 20%, #b5c9ff 60%, #67e8f9 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .tagline {
        margin: 0;
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.65);
    }

    .status-block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.7rem;
        padding: 0.75rem 1.25rem;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
        font-size: 0.9rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .status-pill.ready {
        border-color: rgba(103, 232, 249, 0.5);
        background: rgba(103, 232, 249, 0.08);
    }

    .pulse-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #67e8f9;
        position: relative;
    }

    .pulse-dot::after {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 1px solid rgba(103, 232, 249, 0.5);
        animation: pulse 1.6s infinite;
    }

    .loader {
        display: flex;
        align-items: center;
        gap: 1.25rem;
    }

    .ring {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-top-color: #67e8f9;
        animation: spin 1.2s linear infinite;
    }

    .loading-text {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.7);
    }

    .enter-button {
        align-self: flex-start;
        padding: 0.9rem 2.4rem;
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

    .enter-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
    }

    .controls-card {
        border-radius: 20px;
        padding: 1.5rem;
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
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 0.9rem;
    }

    .control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
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

    .meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.6);
    }

    @media (max-width: 640px) {
        .loading-panel {
            padding: 2rem;
            border-radius: 22px;
        }

        .controls-grid {
            grid-template-columns: 1fr;
        }

        .enter-button {
            width: 100%;
            text-align: center;
        }

        .meta {
            flex-direction: column;
            gap: 0.4rem;
        }
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
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
        0%, 100% {
            transform: translate3d(0, 0, 0);
        }
        50% {
            transform: translate3d(60px, -40px, 0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .aura,
        .ring,
        .pulse-dot::after {
            animation: none;
        }
    }
</style>
