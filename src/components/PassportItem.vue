<template>
  <!-- banner -->
  <banner :UserData="UserData" :roles="roles" />

  <div
    class="
      relative
      bg-white
      flex flex-col
      justify-center
      items-center
      mx-[7.692vw]
      rounded-[33px] rounded-t-none
      shadow-[0_0_40px_#00000029]
    "
  >
    <!-- <div class="px-4 flex items-center justify-around">
      <div class="w-full">
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
    </div> -->
    <!-- 首頁 -->
    <div class="w-full px-[9.744vw]">
      <div class="mt-[6.154vw] flex justify-between">
        <div
          class="text-[4.872vw] leading-[6.923vw] font-bold text-[#707070]"
          v-if="UserData.name ?? false"
        >
          {{ UserData.name }}
        </div>
        <div>
          <UpdatePassport
            :UserData="UserData"
            :UserDataTemplate="UserDataTemplate"
          />
        </div>
      </div>


      <div class="mt-[14.615vw] mb-[3.846vw]">
        <pagectrl :pages="2" :current-page="1" />
      </div>
    </div>

    <!-- 資料表 -->
    <div class="w-full px-[9.744vw]">
      <div class="mt-[6.154vw] flex justify-between">
        <div
          class="text-[4.872vw] leading-[6.923vw] font-bold text-[#707070]"
          v-if="UserData.name ?? false"
        >
          {{ UserData.name }}
        </div>
        <div>
          <UpdatePassport
            :UserData="UserData"
            :UserDataTemplate="UserDataTemplate"
          />
        </div>
      </div>
      <div class="mx-[2.051vw]">
        <userdataTable
          :UserData="UserData"
          :UserDataTemplate="UserDataTemplate"
        />
      </div>

      <div class="mt-[14.615vw] mb-[3.846vw]">
        <pagectrl :pages="2" :current-page="2" />
      </div>
    </div>

    <!-- <div id="qrcode" class="flex justify-center">
      <img src="/qrcode-loading.jpg" />
    </div> -->
  </div>
</template>
<script>
import { computed, onBeforeMount, watch } from "vue";
import { Dialog } from "vant";
import { useUserStore } from "../store/user.js";
import { initQrcodeHandler, generateQrcodeHandler } from "@/tools/qrcode";
import { useRouter } from "vue-router";
import banner from "./passport/banner.vue";
import userdataTable from "./passport/userdata-table.vue";
import UpdatePassport from "@/components/UpdatePassport.vue";
import pagectrl from "./passport/pagectrl.vue";

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
    banner,
    userdataTable,
    UpdatePassport,
    pagectrl,
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