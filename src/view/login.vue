<template>login</template>
<script>
import "../tools/liff";
import { useUserStore } from "../store/user";
import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const userStatus = useUserStore();
    watch(
      () => userStatus.isLogin,
      (isLogin) => {
        if (isLogin) {
          router.push({ path: decodeURIComponent(route.query.from) });
        }
      }
    );
  },
};
</script>