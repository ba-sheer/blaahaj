<script>
	import Shark3D from '#lib/Shark3D.svelte';
	import StaticShark from '#lib/StaticShark.svelte';
	import { reveal } from './lib/reveal.js';
	import { chapters, facts } from './lib/chapters.js';
	import { cuddleMessage } from './lib/cuddles.js';
	import { PLUSH_URL } from './lib/assets.js';

	let plushOk = $state(true);
	let count = $state(0);
	let message = $state('');
	let petBtn;

	function pet() {
		count++;
		message = cuddleMessage(count);
		petBtn.classList.remove('hit');
		void petBtn.offsetWidth;
		petBtn.classList.add('hit');
	}
</script>

<header class="hero">
	<Shark3D autoSpin class="hero-shark" />
	<h1>blahaj lore</h1>
	<span class="by">unofficial fan archive from a hc member</span>

	<p class="lead">the story of one very soft blue shark, told in six tiny chapters.</p>
	<p class="tag"><span class="ul">be soft. be a shark.</span></p>

	<a class="btn" href="#lore">meet the shark</a>
	<span class="note">yeah click on<br />this i know u<br />wanna</span>
	{#if plushOk}
		<img class="plush" src={PLUSH_URL} alt="" onerror={() => (plushOk = false)} />
	{/if}
</header>
<main>
	<h2 id="lore">the lore</h2>
	{#each chapters as ch}
		<article class="ch rv" use:reveal>
			<div class="pol" style="--r:{ch.r}">
				<div class="scene {ch.scene}">
					{#each ch.sharks as s}
						<StaticShark rx={s.rx} ry={s.ry} class={s.cls ?? ''} />
					{/each}
				</div>
			</div>
			<div class="txt">
				<small style="color:{ch.color}">
					chapter {ch.n}
				</small>
				<h3>{ch.title}</h3>
				<p>{ch.text}</p>
			</div>
		</article>
	{/each}
	<section class="facts rv" use:reveal>
		{#each facts as f}
			<div style="--c:{f.c};--r:{f.r}"><b>{f.b}</b>{f.t}</div>
		{/each}
	</section>
	<section class="petbox rv" use:reveal>
		<h2>go on, pet the shark</h2>
		<button id="pet" aria-label="pet the shark" bind:this={petBtn} onclick={pet}>
			<Shark3D />
		</button>
		<p id="count" aria-live="polite">cuddles: {count}{message ? ' · ' + message : ''}</p>
	</section>
</main>
<footer>
	<p class="made">made with <span class="salmon">&lt;3</span> for sharks</p>
	<p class="nav">
		<span style="color:var(--c1)">the deep</span><span style="color:var(--c2)">the aisle</span><span
			style="color:var(--c3)">the internet</span
		><span style="color:var(--c4)">comfort</span><span style="color:var(--c5)">restock</span>
	</p>
	<p class="ghost">be soft, be a shark</p>
	<p class="small">
		font by augie (hack club) · shark art from jame gam · unofficial fan project, not affiliated
		with IKEA
	</p>
</footer>
