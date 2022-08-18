<template>
  <div class="
      w-screen
      h-screen
      z-[9999]
      fixed
      top-0
      left-0
      flex flex-col
      justify-center
      items-center
      bg-white bg-opacity-95
    ">
    <lottie-player class="-mt-40 w-96 h-96" autoplay loop mode="normal" src="/loading.json"></lottie-player>
    <div class="flex font-bold text-2xl">
      <span id="loading-text" />
    </div>
    <div>
      <button v-show="showReloadBtn" @click="handleReload()" class="
          mt-3
          px-5
          bg-center bg-no-repeat bg-clip-padding bg-origin-padding
          shadow-[0_0.769vw_1.538vw_#00000029]
          rounded-[5.641vw]
          text-[5vw]
          font-bold
          w-full
          h-[10vw]
        ">
        重新整理
      </button>
    </div>
  </div>
</template>
<script>
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { onMounted, ref } from "vue";
import Typed from "typed.js";

export default {
  setup() {
    onMounted(() => {

      var typed = new Typed("#loading-text", {
        strings: [
          "載入中...",
          "再給我一點時間...",
          "真的快好了...",
          "好了好了真的好了...",
          "網路有點慢...",
        ],
        typeSpeed: 100,
        loop: true,
      });
    });

    const showReloadBtn = ref(false);
      setTimeout(() => {
        showReloadBtn.value = true
      }, 5000);
    const handleReload = () => {
      localStorage.clear();
      location.reload()
    }
    return {
      handleReload,
      showReloadBtn
    }
  },
};
</script>