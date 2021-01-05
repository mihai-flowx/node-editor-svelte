<script lang="ts">
  import Node from '../components/Node.svelte'
  import Edge from '../components/Edge.svelte'

  import { MouseButton } from '../core/dictionary'

  export let nodes: any[]
  export let edges: any[]
  export let zoomLevel = 1

  let rootElm: HTMLElement = null
  let viewTransformElm: HTMLElement = null

  let edgePositions = initEdgePositions(edges)

  let viewDragPoint = {
    x: 0,
    y: 0,
  }

  let currentViewPos = {
    x: 0,
    y: 0,
  }

  function zoomViewer(event: WheelEvent) {
    const newZoom = zoomLevel + 0.02 * event.deltaY
    zoomLevel = Math.min(1, Math.max(0.2, newZoom))
  }

  function startViewDrag(event: MouseEvent) {
    if (event.button !== MouseButton.MIDDLE) {
      return
    }

    document.addEventListener('mousemove', viewDragMove)

    viewDragPoint = {
      x: event.clientX - viewTransformElm.getBoundingClientRect().left,
      y: event.clientY - viewTransformElm.getBoundingClientRect().top,
    }
  }

  function stopViewDrag(event: MouseEvent) {
    if (event.button !== MouseButton.MIDDLE) {
      return
    }

    document.removeEventListener('mousemove', viewDragMove)
  }

  async function viewDragMove(event: MouseEvent) {
    currentViewPos = {
      x: (event.clientX - rootElm.getBoundingClientRect().left - viewDragPoint.x) / zoomLevel,
      y: (event.clientY - rootElm.getBoundingClientRect().top - viewDragPoint.y) / zoomLevel,
    }
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
          x: (socketsPositions[edge.source.socketId].x - viewTransformElm.getBoundingClientRect().left) / zoomLevel,
          y: (socketsPositions[edge.source.socketId].y - viewTransformElm.getBoundingClientRect().top) / zoomLevel,
        }
      }

      if (socketsPositions[edge.target.socketId]) {
        target = {
          x: (socketsPositions[edge.target.socketId].x - viewTransformElm.getBoundingClientRect().left) / zoomLevel,
          y: (socketsPositions[edge.target.socketId].y - viewTransformElm.getBoundingClientRect().top) / zoomLevel,
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

<div
  bind:this={rootElm}
  class="relative flex w-full h-96 border-black border overflow-hidden"
  on:wheel={zoomViewer}
  on:mousedown={startViewDrag}
  on:mouseup={stopViewDrag}
  on:dragstart={() => false}>
  <div
    bind:this={viewTransformElm}
    style="transform: scale({zoomLevel}) translate({currentViewPos.x}px, {currentViewPos.y}px)"
    class="nodes-wrapper border-red-500 border">
    {#each nodes as node, i}
      <Node
        on:move={nodeMoved}
        on:mount={nodeMounted}
        {zoomLevel}
        id={node.id}
        name={node.name}
        parent={viewTransformElm}
        inputSockets={node.inputSockets}
        outputSockets={node.outputSockets}
        currentPos={{ x: 100 + i * 300, y: 100 + 150 * Math.random() }} />
    {/each}
    {#each Object.values(edgePositions) as edgePos}
      <Edge source={edgePos.source} target={edgePos.target} />
    {/each}
  </div>
</div>
