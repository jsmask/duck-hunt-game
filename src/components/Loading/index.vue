<template>
  <div class="loading-page">
    <p class="loading">
      <span>l</span>
      <span>o</span>
      <span>a</span>
      <span>d</span>
      <span>i</span>
      <span>n</span>
      <span>g</span>
    </p>
    <div class="progress">{{Math.floor(progress)}}%</div>
  </div>
</template>

<script setup>
import { ref,defineProps } from "vue"
const props = defineProps({
  progress:0
})
</script>

<style lang="scss" scoped>
@use "sass:math";
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P");
$t: 3s;
$n: 7;

.progress{
    display: block;
    position: absolute;
    right: 2%;
    bottom: 2%;
    font-size: 1em;
    color: white;
    text-transform: uppercase;
    font-family: "Press Start 2P", sans-serif;
}

.loading-page {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99; 
}

.loading {
  font-family: "Press Start 2P", sans-serif;
  font-size: #{100vw * 0.025};
  color: #ffffff;
  text-transform: uppercase;
  padding: 1.2em;
  position: relative;
  &::after {
    content: "";
    display: block;
    height: 2px;
    bottom: 0;
    left: 0;
    right: 0%;
    background-color: #ffffff;
    position: absolute;
    animation: line $t ease-in-out infinite;
  }
  span {
    display: inline-block;
    animation-name: char;
    animation-duration: $t;
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;
    animation-fill-mode: backwards;
    @for $i from 1 through $n {
      &:nth-child(#{$i}) {
        animation-delay: math.div($i * $t * 0.25, $n);
      }
    }
  }
}

@keyframes line {
  0% {
    right: 100%;
    left: 0%;
    opacity: 0.1;
  }
  50% {
    right: 0%;
    left: 0%;
    opacity: 1;
  }
  100% {
    left: 100%;
    right: 0%;
    opacity: 0.1;
  }
}

@keyframes char {
  0% {
    transform: translateY(1.8em);
    opacity: 0;
  }
  25%,
  50% {
    transform: none;
    opacity: 1;
  }
  75%,
  100% {
    transform: translateY(-1.8em);
    opacity: 0;
  }
}
</style>