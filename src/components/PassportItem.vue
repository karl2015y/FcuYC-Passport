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
        <div class="mt-2" v-if="roles">
          <button @click="scan()" v-if="roles.isAdmin">
            <span class="border border-solid p-0.5 rounded shadow mx-0.5">
              🧙管理員</span
            >
          </button>
          <span
            class="border border-solid p-0.5 rounded shadow mx-0.5"
            v-if="roles.isMember"
            >🏅會員</span
          >
        </div>
      </div>
      <div id="qrcode" class="flex justify-center" >
        <img src="/qrcode-loading.jpg">
      </div>
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
import { computed, onBeforeMount, watch } from "vue";
import { Dialog } from "vant";
import { useUserStore } from "../store/user.js";
import { initQrcodeHandler, generateQrcodeHandler } from "@/tools/qrcode";
import { useRouter } from "vue-router";

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  props: ["UserData", "UserDataTemplate"],
  setup(props) {
    const router = useRouter();

    const UserData = computed(() => props.UserData);
    const UserDataTemplate = computed(() => props.UserDataTemplate);

    const userStatus = useUserStore();
    const roles = computed(() => userStatus.get("roles"));
    const scan = async () => {
      try {
        const result = await liff.scanCodeV2();
        console.log("scanCodeV2 result", result.value);
        const path = "/passport/";
        const email =
          result.value.indexOf(path) > 0 ? result.value.split(path)[1] : null;
        console.log("get code", email);
        if (email) {
          router.push({ name: "findPassport", params: { email } });
        } else {
          alert("錯誤QRcdoe");
          console.log("錯誤QRcdoe");
        }
      } catch (error) {
        console.log("scanCodeV2 error", error);
      }
    };

    watch(
      () => UserData.value,
      () => {
        // 產生Qrcode
        generateQrcodeHandler(
          `${window.location.origin}/passport/${encodeURIComponent(
            UserData.value["email"]
          ).replace(/\./g, "DOT")}`,
          "qrcode"
        );
        // initQrcodeHandler().then(() => {

        // });
      }
    );

    
    onBeforeMount(() => {
      initQrcodeHandler();
    });

    return {
      UserDataTemplate,
      UserData,
      roles,
      scan,
    };
  },
};
</script>