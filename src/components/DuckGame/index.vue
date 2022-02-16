<script setup>
import { ref, nextTick } from "vue";
import Game from "./js";

const canvas = ref(null);
const count = ref(0);
const bgm = ref(null);

nextTick(() => {
  let game = new Game({
    width: 1200,
    height: 769,
    el: canvas.value,
    resolution: 0.8
  }).init();
});
</script>

<template>
  <div ref="canvas"></div>
</template>

<style scoped>
</style>
