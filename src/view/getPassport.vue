<template>
  查看會員資料(管理員跟自己能看)
  {{ UserData }}
  <br />
  {{ UserRoles }}

  <PassportItem :UserData="UserData" />
</template>
<script>
import { useRoute } from "vue-router";

import { ref } from "vue";

import { getUserDataHandler, fire } from "@/api/user";
import PassportItem from "@/components/PassportItem.vue";

export default {
  components: { PassportItem },
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
    const UserData = ref({});
    const UserRoles = ref({});
    const getUserData = async (email) => {
      const result = await fire(getUserDataHandler, [email]);
      UserData.value = result["UserData"];
      UserRoles.value = result["UserRoles"];
    };
    /**
     * 取得帳號權限角色
     */

    getUserData(findEmail.value);
    return {
      UserData,
      UserRoles,
    };
  },
};
</script>