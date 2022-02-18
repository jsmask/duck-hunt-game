<script setup>
import { ref, nextTick } from "vue";
import Game from "./js";
import Bus from "../../utils/bus";

const canvas = ref(null);
const scale = `scale(${window.innerHeight / 769})`;

nextTick(() => {
  const height = 769;
  const width = 1200;
  new Game({
    width,
    height,
    el: canvas.value,
    resolution: 1,
    onProgress: n => {
      Bus.$emit("changeProgress", n);
    }
  }).init();
});
</script>

<template>
  <div class="game" ref="canvas"></div>
</template>

<style lang="scss" scoped>
.game {
  transform: v-bind(scale);
  cursor: none;
}
</style>
