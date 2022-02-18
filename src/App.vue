<script setup>
import Loading from "./components/Loading/index.vue";
import DuckGame from "./components/DuckGame/index.vue";
import { ref } from "vue";
import Bus from "./utils/bus"

const progress = ref(0);

Bus.$on("changeProgress",n=>{
  progress.value = n;
})

</script>

<template>
  <div>
    <Loading v-if="progress<100" :progress="progress" />
    <DuckGame />
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}
body,
html {
  width: 100%;
  height: 100vh;
  background-color: #333;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
