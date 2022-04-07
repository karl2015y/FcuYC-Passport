<template>
  自己跟管理員才能看和編輯的護照
  <!-- {{ UserData }}
  <br />
  {{ userStatus.roles }} -->
  <img v-if="UserData" :src="UserData.picture" alt="" />
  <div id="qrcode" class="flex justify-center" />

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
        w-96
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

import { ref, onBeforeMount } from "vue";
import { initQrcodeHandler, generateQrcodeHandler } from "@/tools/qrcode";
import UpdatePassport from "@/components/UpdatePassport.vue";
import { getUserDataTemplateHandler, getUserDataHandler } from "@/api/user";
import { Popup } from "vant";

export default {
  components: { UpdatePassport, [Popup.name]: Popup },
  setup() {
    const userStatus = useUserStore();

    const UserDataTemplate = ref(null);
    /**
     * 取得使用這資料
     */
    const UserData = ref(null);
    const getUserData = async () => {
      const template = await getUserDataTemplateHandler();
      UserDataTemplate.value = template;
      UserData.value = await getUserDataHandler(template);

      // 產生Qrcode
      generateQrcodeHandler(
        `${window.location.origin}/passport/${encodeURIComponent(
          userStatus.user.email
        ).replace(/\./g, "DOT")}`,
        "qrcode"
      );
    };

    /**
     * 顯示編輯區
     */
    const show_edit_area = ref(false);

    onBeforeMount(() => {
      initQrcodeHandler(); // 初始化QRcode產生器
    });

    getUserData();
    return {
      userStatus,
      UserData,
      UserDataTemplate,
      show_edit_area,
    };
  },
};
</script>


<style scoped>
input[type="date"][val=""]:before {
  color: lightgrey;
  content: attr(placeholder) !important;
  margin-right: 0.5em;
}
/* input[type="date"]:before {
  content: none !important;;
} */
</style>