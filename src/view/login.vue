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
    const back2FromUrl = () => {
      const path = route.query.from
        ? decodeURIComponent(route.query.from)
        : "passport";
      let query = {};
      if (path.indexOf("?") > -1) {
        query = path.split("?")[1];
        query = JSON.parse(
          '{"' +
            query
              .replace(/"/g, '\\"')
              .replace(/&/g, '","')
              .replace(/=/g, '":"') +
            '"}'
        );
      }
      console.log("返回", path, query);
      router.push({ path, query });
    };
    watch(
      () => userStatus.isLogin,
      (isLogin) => {
        if (isLogin) {
          back2FromUrl();
        }
      }
    );
  },
};
</script>