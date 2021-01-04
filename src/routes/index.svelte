<script lang="ts">
  import Node from '../components/Node.svelte'
</script>

<h1 class="text-red-500 text-lg">Process Editor</h1>
<div class="flex p-8">
  <Node name="send_kafka_request" />
</div>

<style global lang="postcss">
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;
</style>
