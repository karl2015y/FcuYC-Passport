<template>
  <div
    class="
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
    "
  >
    <lottie-player
      class="-mt-40 w-96 h-96"
      autoplay
      loop
      mode="normal"
      src="/loading.json"
    ></lottie-player>
    <div class="flex font-bold text-2xl">
      <span id="loading-text" />
    </div>
  </div>
</template>
<script>
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { onMounted } from "vue";
import Typed from "typed.js";

export default {
  setup() {
    onMounted(() => {
      var typed = new Typed("#loading-text", {
        strings: [
          "載入中...",
          "網路有點慢...",
          "再給我一點時間...",
          "真的快好了...",
          "好了好了真的好了...",
        ],
        typeSpeed:100,
        loop: true,
      });
    });
  },
};
</script>