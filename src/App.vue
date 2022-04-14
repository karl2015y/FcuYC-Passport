

<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn animate__slower"
    leave-active-class="animate__animated animate__fadeOut animate__delay-1s"
  >
    <Loading v-show="loadingStatus" />
  </transition>
  <div class="bg-[#F0F0F0] flex flex-col h-screen overflow-hidden">
    <div class="w-screen">
      <picture class="w-[41.753vw]">
        <source
          srcset="/design/background_top/background_top@2x.png"
          media="(min-width: 473px)"
        />
        <img src="/design/background_top/background_top.png" alt="上背景" />
      </picture>
    </div>
    <div id="main" class=" z-10 font-sans fixed h-full w-full overflow-auto">
      <div>
        <router-view />
      </div>
    </div>

    <div class="w-screen flex justify-end mt-auto">
      <img
        class="w-[33.179%]"
        src="/design/backgroung_bottom/backgroung_bottom.png"
        alt=""
      />
    </div>
  </div>
</template>
<script >
</script>


<script>
import Loading from "./components/Loading.vue";
import { useUserStore } from "./store/user";
import { computed, ref, nextTick, onMounted } from "vue";
export default {
  components: { Loading },
  setup() {
    const userStatus = useUserStore();
    const loadingStatus = computed(() => {
      return (
        userStatus.isLogin === false ||
        userStatus.get("user") === null ||
        userStatus.get("roles") === null ||
        userStatus.get("UserData") === null ||
        userStatus.loading.length > 0
      );
    });

    const mainPadding = ref(`50px`);
    onMounted(() => {
      nextTick(() => {
        const main = document.querySelector("#main");
        const windowH = window.innerHeight;
        const x = setInterval(() => {
          const passportH = main.children[0].clientHeight;
          console.log("fix gogo", windowH, passportH);
          if (passportH > 100) {
            mainPadding.value = `${
              passportH+50 < windowH ? (windowH - passportH) / 2 : 50
            }px`;
            console.log("fix done", windowH, passportH, mainPadding);

            clearInterval(x);
          }
        }, 100);
        // console.log(main, windowH, main.children[0], passportH);
      });
    });

    return {
      Loading,
      loadingStatus,
      mainPadding,
    };
  },
};
</script>

<style scoped>
#main {
  padding-top: v-bind("mainPadding");
  padding-bottom: v-bind("mainPadding");
}
</style>