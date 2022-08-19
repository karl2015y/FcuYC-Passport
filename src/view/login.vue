<template></template>
<script>
import "../tools/liff";
import { useUserStore } from "../store/user";
import { ref, onMounted, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";

import { getDBDataHandler, setUserRolesHandler } from "@/api/user";


export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStatus = useUserStore();

    /**
     * 將query 轉obj
     */
    const paramsToObject = (entries) => {
      const result = {};
      for (const [key, value] of entries) {
        result[key] = value;
      }
      return result;
    };

    /**
     * 返回登入前的畫面
     */
    const back2FromUrl = () => {
      const path = route.query.to
        ? decodeURIComponent(route.query.to)
        : "/passport";
      let query = {};
      if (path.indexOf("?") > -1) {
        query = path.split("?")[1];
        const entries = new URLSearchParams(query).entries();
        query = paramsToObject(entries);
      }
      console.log("返回", path, query, userStatus.UserData);
      router.push({ path, query });
    };

    /**
     * 監聽liff是否觸發登入
     */
    watch(
      () => userStatus.isLiffLogin,
      (isLiffLogin) => {
        if (isLiffLogin) {
          getDBDataHandler(userStatus.user.email, "Aa3345678", back2FromUrl);
        }
      }
    );

    onMounted(() => {
      if (userStatus.isLiffLogin) {
        getDBDataHandler(userStatus.user.email, "Aa3345678", back2FromUrl);
      }
    });

  },
};




</script>