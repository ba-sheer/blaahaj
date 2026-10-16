<script>
    import {onMount, settled} from 'svelte';
    import {createSharkScene,BACKING,PRIZE_POSE} from './shark-scene.js';
    import{GLB_URL,POSTER_URL} from './assets.js';
	import { highpModelNormalViewMatrix } from 'three/src/nodes/accessors/ModelNode.js';

    let {autoSpin = false,class:klass = ''}=$props();

    const SPIN = 1.1;
    const STOP = 0.02;
    const FRAME = 1000/60;

    let wrap, canvas;
    let src = $state(undefined);
    let spinning = $state(false);

    onMount(()=>{
        const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
        const always = autoSpin && !reduced;

        let scene = null,raf = 0,last = 0,vy =0;
        let hovering = false,ready=false,snapping = false,visible=false,disposed = false;

        function loop(now){
            if(!scene)return;
            raf = requestAnimationFrame(loop);
            if(now - last < FRAME) return;
            const dt = Math.min((now-last)/1000, 0.05);
            last = now;
            if(!always || hovering)vy = SPIN;else vy *= Math.exp(-3 * dt);
            scene.state.ry += vy*dt;
            scene.render();
            if(!always&&!hovering && Math.abs(vy)< STOP) settled();
        }
        const start = ()=>{
            if(!raf&& scene){last = performance.now()-FRAME;raf=requestAnimationFrame(loop);}
        };
        const stop =()=>{
            cancelAnimationFrame(raf);
            raf=0;
        }
        function settle(){
            stop();
            scene.render();
            try{snapping = true;src= canvas.toDataURL('image/png');}
            catch{snapping = false;spinning=false;}
        }
        wrap.querySelector('img').addEventListener('load',()=>{
            if(snapping){snapping=false;
                spinning = false;
            }
        });
        const enter=()=>{
            if(!ready || always)return;
            hovering=true;
            scene.render();
            spinning=true;
            start();
        };
        const leave =()=>{
            if(always) return;
            hovering = false;
            start();
        };
        wrap.addEventListener('pointerenter',enter);
        wrap.addEventListener('pointerleave',leave);
        async 
    })
</script>