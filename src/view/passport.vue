<template>
  <!-- 自己跟管理員才能看和編輯的護照 -->
  <!-- {{ UserData }}
  <br />
  {{ userStatus.roles }} -->
  <div class="fixed top-0 left-0 z-10 w-screen h-screen flex flex-col justify-center">
    <PassportItem v-if="UserData && UserDataTemplate && roles"
    :UserData="UserData"
    :UserDataTemplate="UserDataTemplate"
      :roles="roles" />
  </div>

</template>
<script>
import { useUserStore } from "../store/user.js";

import { ref, onBeforeMount, computed } from "vue";

import {
  getUserDataTemplateHandler,
  getMyDataHandler,
  subscribeMyRoles,
} from "@/api/user";

import PassportItem from "@/components/PassportItem.vue";
import UpdatePassport from "@/components/UpdatePassport.vue";

export default {
  components: { PassportItem, UpdatePassport },
  setup() {
    const userStatus = useUserStore();

    const UserDataTemplate = computed(() => userStatus.get("UserDataTemplate"));
    /**
     * 取得使用這資料
     */
    const UserData = computed(() => userStatus.get("UserData"));
    const getUserData = async () => {
      const template = await getUserDataTemplateHandler();
      userStatus.set("UserDataTemplate", template);
      userStatus.set("UserData", await getMyDataHandler(template));
    };
    const roles = computed(() => userStatus.get("roles"));
    subscribeMyRoles((data) => {
      userStatus.set("roles", data);
    });

    getUserData();
    return {
      userStatus,
      UserData,
      UserDataTemplate,
      roles,
    };
  },
};
</script>

