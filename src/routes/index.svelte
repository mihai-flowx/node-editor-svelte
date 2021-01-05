<script lang="ts">
  import Node from '../components/Node.svelte'

  let viewerElm = null
  let zoomLevel = 1

  const nodes = [
    {
      id: 1,
      name: 'start',
    },
    {
      id: 2,
      name: 'send_kafka_request',
    },
    {
      id: 3,
      name: 'receive_kafka_request',
    },
    {
      id: 4,
      name: 'show_search_results',
    },
    {
      id: 5,
      name: 'end',
    },
  ]

  function zoomViewer(event: WheelEvent) {
    console.log(event)
    const newZoom = zoomLevel + 0.02 * event.deltaY
    zoomLevel = Math.min(1, Math.max(0.2, newZoom))
  }
</script>

<h1 class="text-red-500 text-lg">Process Editor</h1>
<div bind:this={viewerElm} class="relative flex w-full h-96 border-black border overflow-hidden" on:wheel={zoomViewer}>
  <div style="transform: scale({zoomLevel})" class="nodes-wrapper border-red-500 border">
    {#each nodes as node, i}
      <Node name={node.name} parent={viewerElm} startPos={{ x: 100 + i * 250, y: 100 + 50 * Math.random() }} />
    {/each}
  </div>
</div>

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
