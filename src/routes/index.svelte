<script lang="ts">
  import { dndzone } from 'svelte-dnd-action'
  import Node from '../components/Node.svelte'

  const nodes = [
    {
      id: 1,
      name: 'send_kafka_request',
    },
    {
      id: 2,
      name: 'receive_kafka_request',
    },
  ]
</script>

<h1 class="text-red-500 text-lg">Process Editor</h1>
<div class="flex p-8" use:dndzone={{ items: nodes, dragDisabled: true }}>
  {#each nodes as node}
    <Node name={node.name} />
  {/each}
</div>

<style global lang="postcss">
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;
</style>
