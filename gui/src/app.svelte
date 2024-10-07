<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Resume } from "$wailsjs/go/rsvp/Rsvp";

    async function handleResume() {
        const result = await Resume();
        console.log(result);
    }
</script>

<main class="grid place-items-center h-full">
    <Button onclick={handleResume}>Resume</Button>
</main>
