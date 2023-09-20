<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { useWindowSizeStore } from '@/stores';
  const windowStore = useWindowSizeStore();
  window.addEventListener('resize', () => {
    windowStore.updateSize();
  })
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
  * {
    padding: 0;
    margin: 0;
}
body {
    background-color: #efefef;
}
::-webkit-scrollbar {
    width: 10px;
}
::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 5px;
}

  ::-webkit-scrollbar-thumb:hover {
    background: #f40;
}
.auth-drawer {
  background-color: #efefef;
}
</style>
