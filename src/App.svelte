<script>
    import Shark3D from "#lib/Shark3D.svelte";
    import StaticShark from "#lib/StaticShark.svelte";
    import {reveal} from "./lib/reveal.js";
    import {chapters,facts} from "./lib/chapters.js";
    import {cuddleMessage} from "./lib/cuddles.js";
    import {PLUSH_URL} from "./lib/assets.js";

    let plushOk = $state(true);
    let count = $state(0);
    let message = $state('');
    let petBtn;

    function pet(){
        count++;
        message = cuddleMessage(count);
        petBtn.classList.remove('hit');
        void petBtn.offsetWidth;
        petBtn.classList.add('hit');
    }
</script>
<header class="hero">
    <Shark3D autoSpin class="hero-shark"/>
</header>
<main></main>
<footer></footer>