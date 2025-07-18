<script setup lang="ts">
import { io } from "socket.io-client";
import type { Color } from "~/utils/types";

const socket = io("/", {
    path: "/api/socket.io",
});

const game = new Game();

socket.on("game:playerCard", (color: Color) => {
    game.activatePlayerCard(color);
});

socket.on("game:propertyCard", (id: number) => {
    game.activatePropertyCard(id);
});

socket.on("game:jailCard", () => {
    game.outOfJail();
});
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold">monopoly works</h1>
    </div>
</template>
