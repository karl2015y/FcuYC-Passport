<template>
  <!-- banner -->
  <banner :UserData="UserData" :roles="roles" />

  <div class="bg-white flex flex-col justify-center items-center mx-[7.692vw] px-[8.205vw]">
    <div class="px-4 flex items-center justify-around">
      <div class="w-full">
        <!-- <div class="mt-2" v-if="roles">
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
        </div> -->
      </div>
    </div>
    <div v-if="UserData" class="w-full">
      <div
        v-for="(value, key) in UserDataTemplate"
        :key="key"
        class="flex items-center justify-between"
      >
        <template v-if="value.length >= 3">
          <h2 class="text-[3.076vw] leading-[4.358vw]">
            {{ value[1] }}
          </h2>

          <div class="">
            {{ UserData[key] ?? false ? UserData[key] : "無" }}
          </div>
        </template>
      </div>
    </div>

    <div id="qrcode" class="flex justify-center">
      <img src="/qrcode-loading.jpg" />
    </div>
  </div>
</template>
<script>
import { computed, onBeforeMount, watch } from "vue";
import { Dialog } from "vant";
import { useUserStore } from "../store/user.js";
import { initQrcodeHandler, generateQrcodeHandler } from "@/tools/qrcode";
import { useRouter } from "vue-router";
import banner from "./passport/banner.vue";

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
    banner,
  },
  props: ["UserData", "UserDataTemplate", "roles"],
  setup(props) {
    const router = useRouter();

    const UserData = computed(() => props.UserData);
    const UserDataTemplate = computed(() => props.UserDataTemplate);

    const userStatus = useUserStore();
    const roles = computed(() => props.roles);
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