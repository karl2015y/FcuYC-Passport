<template>
  查看會員資料(管理員跟自己能看)
  {{ UserData }}
  <br />
  {{ UserRoles }}
</template>
<script>
import { useRoute } from "vue-router";

import { db } from "../tools/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref } from "vue";

export default {
  setup() {
    const route = useRoute();
    const findEmail = ref(route.params.email ?? null);
    if (findEmail.value == null) {
      alert("sorry 網頁錯誤");
    }
    findEmail.value = decodeURIComponent(findEmail.value).replace(/DOT/g, ".");

    /**
     * 取得使用這資料
     */
    const UserData = ref(null);
    const getUserData = async (email) => {
      const docRef = doc(db, "user", email);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          UserData.value = docSnap.data();
          UserRoles.value = await getUserRolesHandler(email);
          console.log("取得資料成功", UserData.value);
        } else {
          console.log("無註冊資料");
        }
      } catch (error) {
        if (error.code == "permission-denied") {
          console.log("權限不足");
          alert("權限不足");
        }
      }
    };
    /**
     * 取得帳號權限角色
     */
    const UserRoles = ref(null);
    const getUserRolesHandler = async (email) => {
      const docRef = doc(db, "roles", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("找不到角色");
        return {
          isMember: false,
        };
      }
    };

    getUserData(findEmail.value);
    return {
      UserData,
      UserRoles,
    };
  },
};
</script>