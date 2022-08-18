

<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn animate__slower"
    leave-active-class="animate__animated animate__fadeOut animate__delay-1s"
  >
    <Loading v-show="loadingStatus" />
  </transition>
  <router-view v-if="userStatus.isLiffLogin" />

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
    const loadingStatus = false

    const mainPadding = ref(`12vw`);


    return {
      userStatus,
      loadingStatus,
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