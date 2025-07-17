<script setup lang="ts">

import {io} from "socket.io-client";

const socket = io("/", {
  path: "/api/socket.io",
});

socket.on("game:update", (msg: string) => {
  console.log(msg)
})



</script>

<template>
  <div>
    <h1>app works</h1>
  </div>
</template>
