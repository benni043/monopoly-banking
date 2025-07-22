<script setup lang="ts">
const { game } = useGame();
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">DKT works</h1>

    <div class="flex flex-col gap-2">
      <div>
        <h2 class="text-xl">Players</h2>
        <div class="flex gap-2">
          <div v-for="player in game.players">
            {{ player.color }}
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl">Active Player</h2>
        {{ getActivePlayer(game)?.color }}
      </div>
    </div>
  </div>
</template>