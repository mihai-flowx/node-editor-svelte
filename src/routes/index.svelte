<script lang="ts">
  import NodesView from '../components/NodesView.svelte'

  import { nodes, edges } from '../core/mock-data/mock-data'
</script>

<h1 class="text-red-500 text-lg">Process Editor</h1>
<NodesView {nodes} {edges} zoomLevel={0.8} />

<style global lang="postcss">
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;

  .nodes-wrapper {
    transform-origin: 0px 0px 0px;
  }
</style>
