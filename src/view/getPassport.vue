<template>
  查看會員資料(管理員跟自己能看)
  <div v-if="iMAdmin">
    <button
      @click="toggleRoleHandler('Member')"
      class="m-2 text-white font-bold py-2 px-4 border rounded w-36"
      :class="
        UserRoles.isMember ?? false
          ? 'bg-red-400 hover:bg-red-500 border-red-500'
          : ' bg-blue-500 hover:bg-blue-700 border-blue-700'
      "
    >
      {{ UserRoles.isMember ?? false ? "關閉" : "開通" }}會員
    </button>

    <button
      @click="toggleRoleHandler('Admin')"
      class="m-2 text-white font-bold py-2 px-4 border rounded w-36"
      :class="
        UserRoles.isAdmin ?? false
          ? 'bg-red-400 hover:bg-red-500 border-red-500'
          : ' bg-blue-500 hover:bg-blue-700 border-blue-700'
      "
    >
      {{ UserRoles.isAdmin ?? false ? "關閉" : "開通" }}管理員
    </button>
  </div>
  <PassportItem :UserData="UserData" />
  {{ UserData }}
  <br />
  {{ UserRoles }}
</template>
<script>
import { useRoute } from "vue-router";

import { computed, onMounted, ref } from "vue";
import { useUserStore } from "../store/user.js";

import { getUserDataHandler, fire, setUserRolesHandler } from "@/api/user";
import PassportItem from "@/components/PassportItem.vue";

import { Toast, Dialog } from "vant";

export default {
  components: {
    PassportItem,
  },
  setup() {
    const userStatus = useUserStore();
    const route = useRoute();
    const findEmail = ref(route.params.email ?? null);
    if (findEmail.value == null) {
      alert("sorry 網頁錯誤");
    }
    findEmail.value = decodeURIComponent(findEmail.value).replace(/DOT/g, ".");

    /**
     * 取得查看者的權限
     */
    const iMAdmin = computed(() => userStatus.get('roles')["isAdmin"] ?? false);

    /**
     * 取得使用這資料
     */
    const UserData = ref({ name: "", email: "" });
    const UserRoles = ref({});
    const getUserData = async (email) => {
      const result = await fire(getUserDataHandler, [email]);
      UserData.value = result["UserData"];
      UserRoles.value = result["UserRoles"];
    };

    /**
     * 開通會員
     */
    const toggleRoleHandler = async (roleName) => {
      Dialog.confirm({
        title: "更新帳號",
        message: `即將修改「${UserData.value.name}」的身分，是否繼續？`,
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then(async () => {
        console.log("即將開通會員權限", UserData.value, UserRoles.value);
        UserRoles.value[`is${roleName}`] = !(
          UserRoles.value[`is${roleName}`] ?? false
        );
        UserRoles.value = await setUserRolesHandler(
          UserData.value.email,
          UserRoles.value
        );
        setTimeout(() => {
          Toast.success({
            message: "更新成功",
            duration: 2000,
          });
        }, 1000);
      });
    };

      getUserData(findEmail.value);
  
    return {
      UserData,
      UserRoles,
      iMAdmin,
      toggleRoleHandler,
    };
  },
};
</script>