<script lang="ts">
  import Node from '../components/Node.svelte'
  import Edge from '../components/Edge.svelte'

  export let nodes: any[]
  export let edges: any[]

  let viewerElm: HTMLElement = null
  let zoomLevel = 1

  let edgePositions = {
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
    4: {
      source: { x: 550, y: 200 },
      target: { x: 300, y: 100 },
    },
  }

  function zoomViewer(event: WheelEvent) {
    console.log(event)
    const newZoom = zoomLevel + 0.02 * event.deltaY
    zoomLevel = Math.min(1, Math.max(0.2, newZoom))
  }

  function nodeMoved({ detail: { id, deltaPos, currentPos, socketsPositions } }) {
    // console.log('NODE MOVED', id, deltaPos, currentPos, socketsPositions)
    // TODO: Gaseste toate edges legate de nodu cu id-u asta si modifica-le pozitia
    const edgesToUpdate = edges.filter((edge) => edge.source.nodeId === id || edge.target.nodeId === id)
    // .map(({ id, source, target }) => ({ id, source, target }))
    // console.log('EDGES TO UPDATE', edgesToUpdate)

    const newEdgePositions = edgesToUpdate.reduce((edgesObj, edge) => {
      let source: any, target: any
      if (socketsPositions[edge.source.socketId]) {
        source = {
          x: socketsPositions[edge.source.socketId].x - viewerElm.getBoundingClientRect().left,
          y: socketsPositions[edge.source.socketId].y - viewerElm.getBoundingClientRect().top,
        }
      } else {
        source = { ...edgePositions[edge.id].source }
      }

      if (socketsPositions[edge.target.socketId]) {
        target = {
          x: socketsPositions[edge.target.socketId].x - viewerElm.getBoundingClientRect().left,
          y: socketsPositions[edge.target.socketId].y - viewerElm.getBoundingClientRect().top,
        }
      } else {
        target = { ...edgePositions[edge.id].target }
      }

      return {
        ...edgesObj,
        [edge.id]: {
          source,
          target,
        },
      }
    }, {})

    // console.log('NEW EDGE POS', newEdgePositions)

    edgePositions = {
      ...edgePositions,
      ...newEdgePositions,
    }
  }
</script>

<div bind:this={viewerElm} class="relative flex w-full h-96 border-black border overflow-hidden" on:wheel={zoomViewer}>
  <div style="transform: scale({zoomLevel})" class="nodes-wrapper border-red-500 border">
    {#each nodes as node, i}
      <Node
        on:move={nodeMoved}
        id={node.id}
        name={node.name}
        parent={viewerElm}
        inputSockets={node.inputSockets}
        outputSockets={node.outputSockets}
        currentPos={{ x: 100 + i * 250, y: 100 + 50 * Math.random() }} />
    {/each}
    {#each Object.values(edgePositions) as edgePos}
      <Edge source={edgePos.source} target={edgePos.target} />
    {/each}
  </div>
</div>
