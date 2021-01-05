<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let name = ''
  export let id
  export let parent: HTMLElement = null

  export let startPos = { x: 0, y: 0 }
  export let draggingZIndex = 1000

  const dispatch = createEventDispatcher()

  let currentPos = startPos
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
    currentPos.x = event.pageX - parent.getBoundingClientRect().left - dragPoint.x
    currentPos.y = event.pageY - parent.getBoundingClientRect().top - dragPoint.y

    const deltaPos = {
      x: currentPos.x - oldPos.x,
      y: currentPos.y - oldPos.y,
    }

    dispatch('dragMove', { id, deltaPos })
  }
</script>

<div
  bind:this={nodeElm}
  class="bg-white absolute flex flex-col shadow-lg p-4 border-0 border-gray-600 w-48 flex-shrink-0 cursor-pointer rounded-md z-30"
  style="transform: translate({currentPos.x}px, {currentPos.y}px); {zIndexStyle}"
  on:mousedown={startDrag}
  on:mouseup={stopDrag}
  on:dragstart={() => false}>
  <span class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 border-4 z-20" style="left: -0.5rem" />
  <span class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 border-4 z-20" style="right: -0.5rem" />

  <h3 class="select-none border-b-2 border-gray-500">{name}</h3>

  <p>left: {parent?.getBoundingClientRect().left}</p>
  <p>top: {parent?.getBoundingClientRect().top}</p>
</div>
