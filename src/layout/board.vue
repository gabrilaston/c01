<template>
  <div class="relative">
    <Screenc class="absolute right-4 bottom-4"></Screenc>
    <!-- <Ctrl class="absolute left-1/2 -ml-60 bottom-4"></Ctrl> -->
    <router-view
      :key="key"
      v-slot="{ Component }"
    >
      <transition class="animate__animated animate__lightSpeedInRight">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { Screenc } from "./com";
// 控制按钮
// import Ctrl from "./com/b_ctrl.vue";

const rkey = computed(() => {
  return useRoute().fullPath;
});
const key = ref(rkey);
</script>

<style scoped lang="scss"></style>
