<script setup>
import { ref, nextTick } from "vue";
import Game from "./js";
import Bus from "../../utils/bus";

const canvas = ref(null);
let width = 1200;
let height = 769;

const scale = `scale(${
  window.innerHeight < window.innerWidth
    ? window.innerHeight / height
    : window.innerWidth / width
})`;


nextTick(() => {
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
  <div class="game" :class="{'landscape':isLandscape}" ref="canvas"></div>
</template>

<style lang="scss" scoped>
/* latin */
@font-face {
  font-family: "Press Start 2P";
  font-style: normal;
  font-weight: 400;
  src: url("@/assets/Press Start 2P.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}
.game {
  transform: v-bind(scale);
  cursor: none;
}
</style>
