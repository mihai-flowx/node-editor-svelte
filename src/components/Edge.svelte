<script lang="ts">
  export let source = { x: 0, y: 0 }
  export let target = { x: 0, y: 0 }

  export let controlPointsOffset = {
    x: 40,
    y: 20,
  }
</script>

<svg style="overflow: visible;" class="absolute left-0 top-0 w-0 h-0">
  <path
    d="M {source.x}, {source.y} C {source.x + controlPointsOffset.x}, {source.y - controlPointsOffset.y} {target.x - controlPointsOffset.x}, {target.y + controlPointsOffset.y} {target.x}, {target.y}"
    stroke="steelblue"
    fill="transparent"
    stroke-width="5px" />
</svg>
