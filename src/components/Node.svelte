<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import { MouseButton } from '../core/dictionary'

  export let name = ''
  export let id: number
  export let outputSockets = []
  export let inputSockets = []
  export let parent: HTMLElement = null
  export let zoomLevel: number

  export let draggingZIndex = 1000

  const dispatch = createEventDispatcher()

  export let currentPos: { x: number; y: number }
  let nodeElm = null
  let dragging = false
  let zIndexStyle = ''

  let dragPoint = {
    x: 0,
    y: 0,
  }

  $: zIndexStyle = dragging ? `z-index: ${draggingZIndex}` : ''

  onMount(() => {
    dispatch('mount', { id, socketsPositions: getSocketsPositions() })
  })

  function startDrag(event: MouseEvent) {
    console.log('start drag')
    if (event.button !== MouseButton.LEFT) {
      return
    }

    dragging = true
    document.addEventListener('mousemove', dragMove)

    dragPoint = {
      x: event.clientX - nodeElm.getBoundingClientRect().left,
      y: event.clientY - nodeElm.getBoundingClientRect().top,
    }
  }

  function stopDrag(event: MouseEvent) {
    if (event.button !== MouseButton.LEFT) {
      return
    }

    dragging = false
    document.removeEventListener('mousemove', dragMove)
  }

  function dragMove(event: MouseEvent) {
    const oldPos = { ...currentPos }

    currentPos = {
      x: (event.clientX - parent.getBoundingClientRect().left - dragPoint.x) / zoomLevel,
      y: (event.clientY - parent.getBoundingClientRect().top - dragPoint.y) / zoomLevel,
    }

    const deltaPos = {
      x: currentPos.x - oldPos.x,
      y: currentPos.y - oldPos.y,
    }

    dispatch('move', { id, currentPos, deltaPos, socketsPositions: getSocketsPositions() })
  }

  function socketClicked(socket: any) {
    dispatch('socketClick', { socket, socketPosition: getSocketPos(socket) })
  }

  function getSocketsPositions(): { [id: number]: { x: number; y: number } } {
    return {
      ...outputSockets.reduce(
        (sockets, socket) => ({
          ...sockets,
          [socket.id]: getSocketPos(socket),
        }),
        {}
      ),
      ...inputSockets.reduce(
        (sockets, socket) => ({
          ...sockets,
          [socket.id]: getSocketPos(socket),
        }),
        {}
      ),
    }
  }

  function getSocketPos(socket: any): { x: number; y: number } {
    const boundingClientRect = socket.elmRef.getBoundingClientRect()
    return {
      x: boundingClientRect.left + boundingClientRect.width / 2,
      y: boundingClientRect.top + boundingClientRect.width / 2,
    }
  }
</script>

<div
  bind:this={nodeElm}
  class="bg-white absolute flex flex-col shadow-lg p-4 border-0 border-gray-600 w-28 h-28 flex-shrink-0 cursor-pointer z-30"
  style="transform: translate({currentPos.x}px, {currentPos.y}px); {zIndexStyle}"
  on:mousedown={startDrag}
  on:mouseup={stopDrag}
  on:dragstart={() => false}>
  {#each inputSockets as socket}
    <span
      bind:this={socket.elmRef}
      on:click={(event) => socketClicked(socket)}
      on:mousedown={(event) => event.stopPropagation()}
      class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 hover:border-blue-800 border-4 z-20"
      style="left: -0.5rem" />
  {/each}

  {#each outputSockets as socket}
    <span
      bind:this={socket.elmRef}
      on:click={(event) => socketClicked(socket)}
      on:mousedown={(event) => event.stopPropagation()}
      class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 hover:border-blue-800 border-4 z-20"
      style="right: -0.5rem" />
  {/each}

  <h3>{name}</h3>
</div>
