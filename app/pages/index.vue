<script setup lang="ts">
import { io } from "socket.io-client";
import type { Color } from "~/utils/types";

const socket = io("/", {
    path: "/api/socket.io",
});

const game = reactive(new Game());

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

        <div class="flex flex-col gap-2">
            <div>
                <h2 class="text-xl">PLayers</h2>
                <div class="flex gap-2">
                    <div v-for="player in game.players">
                        {{ player.color }}
                    </div>
                </div>
            </div>

            <div>
                <h2 class="text-xl">Active PLayer</h2>
                {{ game.getActivePlayer()?.color }}
            </div>
        </div>
    </div>
</template>
