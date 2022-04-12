

<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn animate__slower"
    leave-active-class="animate__animated animate__fadeOut animate__delay-1s"
  >
    <Loading v-show="loadingStatus" />
  </transition>
  <div class="bg-[#F0F0F0] flex flex-col  min-h-screen">
    <div class="w-screen">
      <picture class="w-[41.753vw]">
        <source
          srcset="/design/background_top/background_top@2x.png"
          media="(min-width: 473px)"
        />
        <img src="/design/background_top/background_top.png" alt="上背景" />
      </picture>
    </div>
    <div class="font-sans">
      <router-view />
    </div>

    <div class="w-screen flex justify-end -mt-[12.23vw]">
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
import { computed } from "vue";
export default {
  components: { Loading },
  setup() {
    const userStatus = useUserStore();
    const loadingStatus = computed(() => {
      // console.log("isLogin", userStatus.isLogin === false, userStatus.isLogin);
      // console.log(
      //   "user",
      //   userStatus.get("user") === null,
      //   userStatus.get("user")
      // );
      // console.log(
      //   "roles",
      //   userStatus.get("roles") === null,
      //   userStatus.get("roles")
      // );
      // console.log(
      //   "UserData",
      //   userStatus.get("UserData") === null,
      //   userStatus.get("UserData")
      // );
      // console.log("loading", userStatus.loading.length);

      return (
        userStatus.isLogin === false ||
        userStatus.get("user") === null ||
        userStatus.get("roles") === null ||
        userStatus.get("UserData") === null ||
        userStatus.loading.length > 0
      );
    });

    return {
      Loading,
      loadingStatus,
    };
  },
};
</script>