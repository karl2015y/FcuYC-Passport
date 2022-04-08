

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
    const loadingStatus = computed(
      () =>
        userStatus.isLogin === false ||
        userStatus.user === null ||
        userStatus.loading.length > 0
    );

    return {
      Loading,
      loadingStatus,
    };
  },
};
</script>