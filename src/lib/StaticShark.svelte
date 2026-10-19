<script>
  import { onMount } from 'svelte';
  import { bakeShark } from './bake.js';

  let { rx = 0, ry = 0, class: klass = '' } = $props();
  let src = $state(undefined);

  onMount(async () => {
    try {
      src = await bakeShark(rx, ry);
    } catch (err) {
      console.warn('[shark] could not bake a static shark', err);
    }
  });
</script>

<img class="sp {klass}" data-shark {src} alt="" />