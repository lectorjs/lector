<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Greet } from "$wailsjs/go/main/App";
</script>

<main class="grid place-items-center h-full">
    <Button onclick={async () => console.log(await Greet("Juan"))}>Greet</Button>
</main>
