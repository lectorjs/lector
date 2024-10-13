<!-- <script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { rsvp } from "$wailsjs/go/models";
    import { SkipBackward, SkipFoward, StreamNodes } from "$wailsjs/go/rsvp/Rsvp";
    import { EventsOn } from "$wailsjs/runtime";
    import { onMount } from "svelte";

    onMount(async () => {
        await StreamNodes(
            "The quick brown fox jumps over the lazy dog. For more information, visit https://lector.com and https://other.lector.net. We will be wating.",
        );
    });

    EventsOn(rsvp.RsvpEvent.StateChanged, (value) => {
        console.log("The state has changed", value);
    });

    async function handleSkipBackward() {
        await SkipBackward();
    }

    async function handleSkipForward() {
        await SkipFoward();
    }
</script>

<main class="grid place-items-center h-full">
    <div>
        <div class="grid place-items-center w-4xl h-[400px] border">
            <span class="text-7xl">Lector</span>
        </div>

        <div class="flex items-center justify-center gap-2 mt-6">
            <Button
                variant="secondary"
                onclick={handleSkipBackward}
            >
                Prev
            </Button>
            <Button
                variant="secondary"
                onclick={handleSkipForward}
            >
                Next
            </Button>
        </div>
    </div>
</main> -->

<h1 class="text-6xl">Rendered ✅</h1>
