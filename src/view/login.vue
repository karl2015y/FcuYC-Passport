<template>login</template>
<script>
import "../tools/liff";
import { useUserStore } from "../store/user";
import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import "../tools/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../tools/firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStatus = useUserStore();

    /**
     * 取得帳號權限角色
     */
    const getUserRolesHandler = async (email) => {
      const docRef = doc(db, "roles", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        userStatus.roles = docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("找不到角色");
        userStatus.roles = {
          isMember: false,
        };
      }
    };
    /**
     * 到資料庫確定一下該用戶是否登記過，如果沒有就加上去
     */
    const getDBDataHandler = (email, password, callback = null) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          getUserRolesHandler(email).then(() => {
            if (callback) callback();
          });
        })
        .catch((error) => {
          if (error.code == "auth/user-disabled") {
            alert(`該帳號(${email})已被停用，請聯絡中逢青管理員`);
          } else if (error.code == "auth/user-not-found") {
            createUserWithEmailAndPassword(auth, email, password).then(
              (userCredential) => {
                const user = userCredential.user;
                getUserRolesHandler(email).then(() => {
                  if (callback) callback();
                });
              }
            );
          } else {
            alert(
              `好像出錯了，請將此頁截圖，並聯絡中逢青管理員。\nError Code：${error.code}`
            );
          }
        });
    };

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
      () => userStatus.isLogin,
      (isLogin) => {
        if (isLogin) {
          // back2FromUrl();
          console.log();
          getDBDataHandler(userStatus.user.email, "Aa3345678", back2FromUrl);
        }
      }
    );
  },
};
</script>