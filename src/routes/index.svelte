<script lang="ts">
  import Node from '../components/Node.svelte'
  import Edge from '../components/Edge.svelte'

  let viewerElm = null
  let zoomLevel = 1

  const edges = [
    {
      id: 1,
      source: {
        nodeId: 1,
        socketId: 2,
      },
      target: {
        nodeId: 2,
        socketId: 1,
      },
    },
    {
      id: 2,
      source: {
        nodeId: 2,
        socketId: 2,
      },
      target: {
        nodeId: 3,
        socketId: 1,
      },
    },
    {
      id: 3,
      source: {
        nodeId: 3,
        socketId: 2,
      },
      target: {
        nodeId: 4,
        socketId: 1,
      },
    },
  ]

  const edgePositions = {
    1: {
      source: { x: 100, y: 100 },
      target: { x: 300, y: 300 },
    },
    2: {
      source: { x: 300, y: 100 },
      target: { x: 380, y: 170 },
    },
    3: {
      source: { x: 350, y: 100 },
      target: { x: 200, y: 20 },
    },
  }

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

  function nodeMoved({ detail: { id, deltaPos } }) {
    console.log('NODE MOVED', id, deltaPos)
  }
</script>

<h1 class="text-red-500 text-lg">Process Editor</h1>
<div bind:this={viewerElm} class="relative flex w-full h-96 border-black border overflow-hidden" on:wheel={zoomViewer}>
  <div style="transform: scale({zoomLevel})" class="nodes-wrapper border-red-500 border">
    {#each nodes as node, i}
      <Node
        on:dragMove={nodeMoved}
        id={node.id}
        name={node.name}
        parent={viewerElm}
        startPos={{ x: 100 + i * 250, y: 100 + 50 * Math.random() }} />
    {/each}
    {#each Object.values(edgePositions) as edgePos}
      <Edge source={edgePos.source} target={edgePos.target} />
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
