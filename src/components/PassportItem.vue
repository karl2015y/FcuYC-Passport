<template>
  <div class="flex gap-3 flex-col md:flex-row justify-center items-center">
    <div class="px-4 flex items-center justify-around">
      <div class="w-full">
        <img
          v-if="UserData"
          :src="UserData.picture"
          alt=""
          class="
            w-36
            h-36
            rounded-full
            shadow
            border-solid border-4
            object-cover
          "
          :class="{
            'border-red-500': UserData.gender == '女',
            'border-blue-500': UserData.gender == '男',
          }"
        />
        <div class="mt-2">
          <span class="border border-solid p-0.5 rounded shadow mx-0.5" v-if="roles.isAdmin">🧙管理員</span>
          <span class="border border-solid p-0.5 rounded shadow mx-0.5" v-if="roles.isMember">🏅會員</span>
        </div>
      </div>
      <div id="qrcode" class="flex justify-center" />
    </div>
    <div v-if="UserData">
      <div
        v-for="(value, key) in UserDataTemplate"
        :key="key"
        class="flex items-center gap-3"
      >
        <template v-if="value.length >= 3">
          <h2 class="w-24 px-2 mb-2" style="text-align-last: justify">
            {{ value[1] }}
          </h2>

          <div class="w-52 mb-2 text-right">
            {{ UserData[key] ?? false ? UserData[key] : "無" }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from "vue";
import { Dialog } from "vant";
import { useUserStore } from "../store/user.js";
import { initQrcodeHandler, generateQrcodeHandler } from "@/tools/qrcode";

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  props: ["UserData", "UserDataTemplate"],
  setup(props) {
    const UserData = computed(() => props.UserData);
    const userStatus = useUserStore();
    const roles = computed(() => userStatus.roles);
    onMounted(() => {
      // 產生Qrcode
      initQrcodeHandler().then(() => {
        generateQrcodeHandler(
          `${window.location.origin}/passport/${encodeURIComponent(
            userStatus.user.email
          ).replace(/\./g, "DOT")}`,
          "qrcode"
        );
      });
    });

    return {
      UserData,
      roles,
    };
  },
};
</script>