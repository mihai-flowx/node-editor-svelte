<script lang="ts">
  import Node from '../components/Node.svelte'
  import Edge from '../components/Edge.svelte'

  export let nodes: any[]
  export let edges: any[]

  let viewerElm: HTMLElement = null
  let zoomLevel = 1

  let edgePositions = initEdgePositions(edges)

  function zoomViewer(event: WheelEvent) {
    // console.log(event)
    const newZoom = zoomLevel + 0.02 * event.deltaY
    zoomLevel = Math.min(1, Math.max(0.2, newZoom))
  }

  function nodeMounted({ detail: { id, socketsPositions } }) {
    edgePositions = matchEdgesPositionsWithNodeSockets(id, edges, edgePositions, socketsPositions)
  }

  function nodeMoved({ detail: { id, socketsPositions } }) {
    edgePositions = matchEdgesPositionsWithNodeSockets(id, edges, edgePositions, socketsPositions)
  }

  function initEdgePositions(edges: any[]): any {
    return edges.reduce(
      (edgePositions, edge) => ({
        ...edgePositions,
        [edge.id]: {},
      }),
      {}
    )
  }

  function matchEdgesPositionsWithNodeSockets(
    nodeId: number,
    edges: any,
    edgePositions: any,
    socketsPositions: any
  ): any {
    const edgesToUpdate = edges.filter((edge: any) => edge.source.nodeId === nodeId || edge.target.nodeId === nodeId)

    const newEdgePositions = edgesToUpdate.reduce((edgesObj: any, edge: any) => {
      let source = { ...edgePositions[edge.id].source }
      let target = { ...edgePositions[edge.id].target }

      if (socketsPositions[edge.source.socketId]) {
        source = {
          x: socketsPositions[edge.source.socketId].x - viewerElm.getBoundingClientRect().left,
          y: socketsPositions[edge.source.socketId].y - viewerElm.getBoundingClientRect().top,
        }
      }

      if (socketsPositions[edge.target.socketId]) {
        target = {
          x: socketsPositions[edge.target.socketId].x - viewerElm.getBoundingClientRect().left,
          y: socketsPositions[edge.target.socketId].y - viewerElm.getBoundingClientRect().top,
        }
      }

      return {
        ...edgesObj,
        [edge.id]: {
          source,
          target,
        },
      }
    }, {})

    return {
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
        on:mount={nodeMounted}
        id={node.id}
        name={node.name}
        parent={viewerElm}
        inputSockets={node.inputSockets}
        outputSockets={node.outputSockets}
        currentPos={{ x: 100 + i * 300, y: 100 + 80 * Math.random() }} />
    {/each}
    {#each Object.values(edgePositions) as edgePos}
      <Edge source={edgePos.source} target={edgePos.target} />
    {/each}
  </div>
</div>
