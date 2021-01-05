<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let name = ''
  export let id
  export let outputSockets = []
  export let inputSockets = []
  export let parent: HTMLElement = null

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

  function startDrag(event: MouseEvent) {
    dragging = true
    console.log('START DRAG', event)
    document.addEventListener('mousemove', dragMove)

    dragPoint = {
      x: event.pageX - nodeElm.getBoundingClientRect().left,
      y: event.pageY - nodeElm.getBoundingClientRect().top,
    }

    console.log(dragPoint)
  }

  function stopDrag(event) {
    dragging = false
    console.log('STOP DRAG', event)
    document.removeEventListener('mousemove', dragMove)
  }

  function dragMove(event: MouseEvent) {
    const oldPos = { ...currentPos }

    currentPos = {
      x: event.pageX - parent.getBoundingClientRect().left - dragPoint.x,
      y: event.pageY - parent.getBoundingClientRect().top - dragPoint.y,
    }

    const deltaPos = {
      x: currentPos.x - oldPos.x,
      y: currentPos.y - oldPos.y,
    }

    dispatch('move', { id, currentPos, deltaPos, socketsPositions: getSocketsPositions() })
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
  class="bg-white absolute flex flex-col shadow-lg p-4 border-0 border-gray-600 w-48 flex-shrink-0 cursor-pointer rounded-md z-30"
  style="transform: translate({currentPos.x}px, {currentPos.y}px); {zIndexStyle}"
  on:mousedown={startDrag}
  on:mouseup={stopDrag}
  on:dragstart={() => false}>
  {#each inputSockets as socket}
    <span
      bind:this={socket.elmRef}
      class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 border-4 z-20"
      style="left: -0.5rem" />
  {/each}

  {#each outputSockets as socket}
    <span
      bind:this={socket.elmRef}
      class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 border-4 z-20"
      style="right: -0.5rem" />
  {/each}

  <h3 class="select-none border-b-2 border-gray-500">{name}</h3>

  <p>left: {parent?.getBoundingClientRect().left}</p>
  <p>top: {parent?.getBoundingClientRect().top}</p>
</div>
