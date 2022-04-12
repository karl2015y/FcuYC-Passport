<template>
  <!-- banner -->
  <banner :UserData="UserData" :roles="roles" :current-page="currentPage" />

  <div
    @touchstart="
      (e) => {
        touchX = e.touches[0].clientX;
      }
    "
    @touchmove="
      (e) => {
        touchX = e.touches[0].clientX;
      }
    "
    class="
      relative
      bg-white
      flex flex-col
      justify-center
      items-center
      mx-[7.692vw]
      rounded-[33px] rounded-t-none
      shadow-[0_0_40px_#00000029]
      pb-10
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
    <swiper
      slides-per-view="1"
      class="w-full"
      @slideChange="
        (e) => {
          currentPage = e.activeIndex + 1;
        }
      "
    >
      <swiper-slide>
        <!-- 首頁 -->
        <div class="w-full px-[8.205vw] h-full">
          <!-- 名字 -->
          <div class="mt-[6.154vw] flex justify-between">
            <div v-if="UserData.name ?? false">
              <div class="text-[3.077vw] leading-[4.359vw] text-[#707070]">
                姓名
              </div>
              <div
                class="
                  ml-[8.205vw]
                  text-[4.103vw]
                  leading-[6.154vw]
                  text-[#707070]
                "
              >
                {{ UserData.name }}
              </div>
            </div>
            <div class="w-[9.744vw]">
              <picture class="w-full h-auto">
                <source
                  s0rcset="/design/logo/logo@2x.png"
                  media="(min-width: 500px)"
                />
                <img src="/design/logo/logo.png" alt="logo" />
              </picture>
            </div>
          </div>
          <!-- 開始設定資料，取得完整功能 -->
          <div class="mt-[10.513vw] flex justify-center">
            <button
              @click="currentPage = 2"
              class="
                w-[49.744vw]
                h-[6.923vw]
                rounded-[5.641vw]
                text-[3.333vw]
                leading-[4.872vw]
                font-bold
                text-white
                shadow-[0_0.769vw_1.538vw_#00000029]
              "
              :class="roles.isMember ? 'bg-[#9580E8]' : 'bg-[#6AB7E6]'"
            >
              開始設定資料，取得完整功能
            </button>
          </div>
          <!-- Qrcode -->
          <div class="mt-[4vw]">
            <div id="qrcode" class="flex justify-center">
              <img src="/qrcode-loading.jpg" class="w-[38vw] h-[38vw]" />
            </div>
          </div>
          <!-- 頁面選擇 -->
          <div class="hidden">
            <pagectrl :pages="2" v-model="currentPage" />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide
        ><!-- 資料表 -->
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
                :roles="roles"
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
          <!-- 頁面選擇 -->
          <div class="hidden">
            <pagectrl :pages="2" v-model="currentPage" />
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <!-- 頁面選擇 -->
    <div class="mt-[14.615vw] mb-[3.846vw]">
      <pagectrl :pages="2" v-model="currentPage" />
    </div>
  </div>
</template>
<script>
import { computed, onBeforeMount, ref, watch } from "vue";
import { Dialog } from "vant";
import { useUserStore } from "../store/user.js";
import { initQrcodeHandler, generateQrcodeHandler } from "@/tools/qrcode";
import { useRouter } from "vue-router";
import banner from "@/components/passport/banner.vue";
import userdataTable from "@/components/passport/userdata-table.vue";
import UpdatePassport from "@/components/UpdatePassport.vue";
import pagectrl from "@/components/passport/pagectrl.vue";

import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
    banner,
    userdataTable,
    UpdatePassport,
    pagectrl,
    Swiper,
    SwiperSlide,
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

    const currentPage = ref(1);

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
      currentPage,
    };
  },
};
</script>