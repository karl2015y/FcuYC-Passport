

<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn animate__slower"
    leave-active-class="animate__animated animate__fadeOut animate__delay-1s"
  >
    <Loading v-if="loadingStatus" />
  </transition>
  <router-view />
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