<script setup lang="ts">
let color = ref("blue");

function onPlayerCard(color: string) {
    $fetch("/api/playerCard/", {
        method: "POST",
        body: JSON.stringify({ color }),
    });
}

let id = ref(0);

function onPropertyCard(id: number) {
    $fetch("/api/property/", {
        method: "POST",
        body: JSON.stringify({ id }),
    });
}

function onJailCard() {
    $fetch("/api/jailCard/", {
        method: "POST",
        body: JSON.stringify({}),
    });
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold">monopoly api</h1>

        <div class="flex gap-2 flex-col">
            <div class="flex gap-2">
                <button
                    class="cursor-pointer border px-2 rounded"
                    @click="onPlayerCard(color)"
                >
                    send Player card
                </button>
                <select class="border px-2 rounded" v-model="color">
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                </select>
            </div>
            <div class="flex gap-2">
                <button
                    class="cursor-pointer border px-2 rounded"
                    @click="onPropertyCard(id)"
                >
                    send Property card
                </button>
                <input class="border px-2 rounded" v-model="id" type="number" />
            </div>
            <div>
                <button
                    class="cursor-pointer border px-2 rounded"
                    @click="onJailCard"
                >
                    send Jail card
                </button>
            </div>
        </div>
    </div>
</template>
