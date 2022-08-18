<template>login</template>
<script>
import "../tools/liff";
import { useUserStore } from "../store/user";
import { ref, onMounted, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";

import { getDBDataHandler } from "@/api/user";
import { db } from "@/tools/firebase";
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { doc } from "firebase/firestore";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStatus = useUserStore();



    /**
     * 取得角色資料 
     */
    console.log(userStatus.get('user').email);
    const roles = useFirestore(doc(db, "roles", userStatus.get('user').email))
    watchEffect(() => {
      if (roles.value) {
        userStatus.set('roles', roles.value)
      }
    })

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
      console.log("返回", path, query);
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


    return {
      roles,
    }
  },
};




</script>