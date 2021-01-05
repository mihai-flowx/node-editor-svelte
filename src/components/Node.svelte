<script lang="ts">
  export let name = ''
  export let parent: HTMLElement = null

  export let startPos = { x: 0, y: 0 }

  let currentPos = startPos
  let nodeElm = null

  let dragPoint = {
    x: 0,
    y: 0,
  }

  function startDrag(event: MouseEvent) {
    console.log('START DRAG', event)
    document.addEventListener('mousemove', dragMove)

    dragPoint = {
      x: event.pageX - nodeElm.getBoundingClientRect().left,
      y: event.pageY - nodeElm.getBoundingClientRect().top,
    }

    console.log(dragPoint)
  }

  function stopDrag(event) {
    console.log('STOP DRAG', event)
    document.removeEventListener('mousemove', dragMove)
  }

  function dragMove(event: MouseEvent) {
    currentPos.x = event.pageX - parent.getBoundingClientRect().left - dragPoint.x
    currentPos.y = event.pageY - parent.getBoundingClientRect().top - dragPoint.y
  }
</script>

<div
  bind:this={nodeElm}
  class="absolute flex flex-col shadow-lg p-4 border-0 border-gray-600 w-48 flex-shrink-0 cursor-pointer rounded-md"
  on:mousedown={startDrag}
  on:mouseup={stopDrag}
  on:dragstart={() => false}
  style="transform: translate({currentPos.x}px, {currentPos.y}px)">
  <span class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 border-4 z-10" style="left: -0.5rem" />
  <span class="absolute top-2/4 w-4 h-4 rounded-full border-blue-500 border-4 z-10" style="right: -0.5rem" />

  <h3 class="select-none border-b-2 border-gray-500">{name}</h3>

  <p>left: {parent?.getBoundingClientRect().left}</p>
  <p>top: {parent?.getBoundingClientRect().top}</p>
</div>
