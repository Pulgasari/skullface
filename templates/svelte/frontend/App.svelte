<script>
  let count = 0;
</script>

<h1>Svelte</h1>
<button on:click={() => count++}>Increment</button>
<p>{count}</p>
