<script lang="ts">
  import { onMount } from 'svelte'
  import Terminal from './lib/components/Terminal.svelte'
  import { loadSavedTheme } from './lib/themes'

  onMount(() => {
    loadSavedTheme()
  })
</script>

<Terminal />
