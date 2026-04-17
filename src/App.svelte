<script lang="ts">
  import { onMount } from 'svelte'
  import Desktop from './lib/components/Desktop.svelte'
  import { loadSavedTheme } from './lib/themes'

  onMount(() => {
    loadSavedTheme()
  })
</script>

<Desktop />

<style :global>
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
</style>
