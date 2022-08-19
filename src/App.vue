

<template>
  <transition enter-active-class="animate__animated animate__fadeIn animate__slower"
    leave-active-class="animate__animated animate__fadeOut animate__delay-1s">
    <Loading v-show="!loadingStatus" />
  </transition>
  <div class="bg-[#F0F0F0] flex flex-col h-screen overflow-hidden">
    <div class="w-screen">
      <picture class="w-[41.753vw]">
        <source srcset="/design/background_top/background_top@2x.png" media="(min-width: 473px)" />
        <img src="/design/background_top/background_top.png" alt="上背景" />
      </picture>
    </div>
    <div id="main" class="flex flex-col z-10 font-sans fixed h-full w-full overflow-auto">
      <div>
        <router-view v-if="userStatus.isLiffLogin" />
        <Firestore v-if="userStatus.user && userStatus.user.email" />
      </div>
    </div>

    <div class="w-screen flex justify-end mt-auto">
      <img class="w-[33.179%]" src="/design/backgroung_bottom/backgroung_bottom.png" alt="" />
    </div>
  </div>
</template>
<script >
</script>


<script>
import Loading from "./components/Loading.vue";
import { useUserStore } from "./store/user";
import { computed, ref, nextTick, onMounted } from "vue";
import Firestore from '@/components/firestore.vue';

export default {
  components: { Loading },
  setup() {
    const userStatus = useUserStore();
    const loadingStatus = computed(()=>userStatus.isLiffLogin&&userStatus.UserData)
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