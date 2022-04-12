<template>
  <!-- 自己跟管理員才能看和編輯的護照 -->
  <!-- {{ UserData }}
  <br />
  {{ userStatus.roles }} -->
  <PassportItem
    :UserData="UserData"
    :UserDataTemplate="UserDataTemplate"
    :roles="roles"
  />

  <div class="w-full text-center">
    <button
      @click="show_edit_area = !show_edit_area"
      class="
        mx-auto
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        border border-blue-700
        rounded
        w-2/3
      "
    >
      編輯資料
    </button>

    <van-popup v-model:show="show_edit_area" closeable>
      <UpdatePassport
        v-if="UserData && UserDataTemplate"
        v-model="UserData"
        :UserDataTemplate="UserDataTemplate"
      />
    </van-popup>
  </div>
</template>
<script>
import { useUserStore } from "../store/user.js";

import { ref, onBeforeMount, computed } from "vue";

import { getUserDataTemplateHandler, getMyDataHandler } from "@/api/user";
import { Popup } from "vant";

import PassportItem from "@/components/PassportItem.vue";
import UpdatePassport from "@/components/UpdatePassport.vue";

export default {
  components: { PassportItem, UpdatePassport, [Popup.name]: Popup },
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


    /**
     * 顯示編輯區
     */
    const show_edit_area = ref(false);

    getUserData();
    return {
      userStatus,
      UserData,
      UserDataTemplate,
      show_edit_area,
      roles
    };
  },
};
</script>

