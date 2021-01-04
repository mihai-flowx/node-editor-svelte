<script lang="ts">
  export let name = ''
  // export let source: number = null
  // export let target: number = null

  function startDrag(event) {
    console.log(event)
  }
</script>

<div class="flex shadow-lg p-4 border-0 border-gray-600 max-w-xs cursor-pointer" on:mousedown={startDrag}>
  <h3>{name}</h3>
</div>
