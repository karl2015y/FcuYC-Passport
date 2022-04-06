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

    /**
     * 到資料庫確定一下該用戶是否登記過，如果沒有就加上去
     */
    

    /**
     * 返回登入前的畫面
     */
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

    /**
     * 監聽liff是否觸發登入
     */
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