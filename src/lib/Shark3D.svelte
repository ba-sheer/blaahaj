<script>
	import { onMount, settled } from 'svelte';
	import { createSharkScene, BACKING, PRIZE_POSE } from './shark-scene.js';
	import { GLB_URL, POSTER_URL } from './assets.js';

	let { autoSpin = false, class: klass = '' } = $props();

	const SPIN = 1.1;
	const STOP = 0.02;
	const FRAME = 1000 / 60;

	let wrap, canvas;
	let src = $state(undefined);
	let spinning = $state(false);

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
		const always = autoSpin && !reduced;

		let scene = null,
			raf = 0,
			last = 0,
			vy = 0;
		let hovering = false,
			ready = false,
			snapping = false,
			visible = false,
			disposed = false;

		function loop(now) {
			if (!scene) return;
			raf = requestAnimationFrame(loop);
			if (now - last < FRAME) return;
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			if (always || hovering) vy = SPIN;
			else vy *= Math.exp(-3 * dt);
			scene.state.ry += vy * dt;
			scene.render();
			if (!always && !hovering && Math.abs(vy) < STOP) settle();
		}
		const start = () => {
			if (!raf && scene) {
				last = performance.now() - FRAME;
				raf = requestAnimationFrame(loop);
			}
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};
		function settle() {
			stop();
			scene.render();
			try {
				snapping = true;
				src = canvas.toDataURL('image/png');
			} catch {
				snapping = false;
				spinning = false;
			}
		}
		wrap.querySelector('img').addEventListener('load', () => {
			if (snapping) {
				snapping = false;
				spinning = false;
			}
		});
		const enter = () => {
			if (!ready || always) return;
			hovering = true;
			scene.render();
			spinning = true;
			start();
		};
		const leave = () => {
			if (always) return;
			hovering = false;
			start();
		};
		wrap.addEventListener('pointerenter', enter);
		wrap.addEventListener('pointerleave', leave);
		async function load() {
			try {
				const s = createSharkScene({
					canvas,
					glbUrl: GLB_URL,
					backing: { ...BACKING },
					pose: PRIZE_POSE,
					preserveDrawingBuffer: true
				});
				await s.ready;
				if (disposed) {
					s.dispose();
					return;
				}
				scene = s;
				scene.render();
				src = canvas.toDataURL('image/png');
				ready = true;
				if (always) {
					spinning = true;
					if (visible) start();
				}
			} catch (err) {
				console.warn('[shark] 3d load failed keeping poster', err);
			}
		}
		let loaded = false;
		const io = new IntersectionObserver(
			(es) => {
				visible = es.some((e) => e.isIntersecting);
				if (visible && !loaded) {
					loaded = true;
					load();
				}
				if (always && scene) visible ? start() : stop();
			},
			{ rootMargin: '300px' }
		);
		io.observe(wrap);
		return () => {
			disposed = true;
			stop();
			io.disconnect();
			wrap.removeEventListener('pointerenter', enter);
			wrap.removeEventListener('pointerleave', leave);
			scene?.dispose();
		};
	});
</script>

<span class="shark3d {klass}" class:spin={spinning} bind:this={wrap}>
	<img src={src ?? POSTER_URL} alt="" />
	<canvas aria-hidden="true" bind:this={canvas}></canvas>
</span>
