<script setup>
import DuckGame from "./components/DuckGame/index.vue"
</script>

<template>
  <DuckGame />
</template>

<style>
*{
  padding: 0;
  margin: 0;
}
body,html{
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
}
</style>
