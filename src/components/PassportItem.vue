<template>
  <!-- banner -->
  <banner :UserData="UserData" :roles="roles" :current-page="currentPage" />

  <div @touchstart="
    (e) => {
      touchX = e.touches[0].clientX;
    }
  " @touchmove="
  (e) => {
    touchX = e.touches[0].clientX;
  }
" class="
      relative
      bg-white
      flex flex-col
      justify-center
      items-center
      mx-[7.692vw]
      rounded-[33px] rounded-t-none
      shadow-[0_0_40px_#00000029]
    ">
    <swiper slides-per-view="1" class="w-full" @slideChange="
      (e) => {
        currentPage = e.activeIndex + 1;
      }
    ">
      <swiper-slide>
        <!-- 首頁 -->
        <div class="w-full px-[8.205vw] h-full">
          <!-- 名字 -->
          <div class="mt-[6.154vw] flex justify-between">
            <div v-if="UserData.name ?? false">
              <div class="text-[3.077vw] leading-[4.359vw] text-[#707070]">
                姓名
              </div>
              <div class="
                  ml-[8.205vw]
                  text-[4.103vw]
                  leading-[6.154vw]
                  text-[#707070]
                ">
                {{ UserData.name }}
              </div>
            </div>
            <div class="w-[9.744vw]">
              <picture class="w-full h-auto">
                <source s0rcset="/design/logo/logo@2x.png" media="(min-width: 500px)" />
                <img src="/design/logo/logo.png" alt="logo" />
              </picture>
            </div>
          </div>

          <!-- 職稱 -->
          <div v-if="
            (roles.vip && roles.vip.length > 0)
          " class="mt-[6.154vw] flex justify-between">
            <div>
              <div class="text-[3.077vw] leading-[4.359vw] text-[#707070]">
                職稱
              </div>
              <div class="
                  ml-[8.205vw]
                  text-[4.103vw]
                  leading-[6.154vw]
                  text-[#707070]
                ">
                <div class="mt-2 flex gap-2 flex-wrap" v-if="roles">

                  <template v-if="roles.vip">
                    <span v-for="item in roles.vip" :key="item" v-text="item"
                      class="border border-solid py-0.5 px-1 rounded shadow mx-0.5" />
                  </template>
                </div>
              </div>
            </div>
          </div>
          <slot name="vip"></slot>

          <!-- 開始設定資料，取得完整功能 -->
          <div v-if="type == 'default' && !allcomplete" class="mt-[5vw] flex justify-center">
            <button @click="currentPage = 2" class="
                w-[49.744vw]
                h-[6.923vw]
                rounded-[5.641vw]
                text-[3.333vw]
                leading-[4.872vw]
                font-bold
                text-white
                shadow-[0_0.769vw_1.538vw_#00000029]
              " :class="roles.isMember ? 'bg-[#9580E8]' : 'bg-[#6AB7E6]'">
              開始設定資料，取得完整功能
            </button>
          </div>
          <!-- Qrcode -->
          <div v-if="type == 'default'">
            <div id="qrcode" class="flex justify-center">
              <img src="/qrcode-loading.jpg" class="w-[50vw] h-[50vw]" />
            </div>
          </div>
          <!-- 勳章 -->
          <div v-if="
            (roles.isMember ?? false) ||
            (roles.isAdmin ?? false) ||
            (roles.decoration && roles.decoration.length > 0)
          " class="mt-[6.154vw] flex justify-between">
            <div>
              <div class="text-[3.077vw] leading-[4.359vw] text-[#707070]">
                逢青勳章
              </div>
              <div class="
                  ml-[8.205vw]
                  text-[4.103vw]
                  leading-[6.154vw]
                  text-[#707070]
                ">
                <div class="mt-2 flex gap-2 flex-wrap" v-if="roles">
                  <button @click="scan()" v-if="roles.isAdmin"
                    class="border border-solid py-0.5 px-1 rounded shadow mx-0.5">
                    <span> 🧙管理員</span>
                  </button>
                  <span class="border border-solid py-0.5 px-1 rounded shadow mx-0.5" v-if="roles.isMember">🏅會員</span>
                  <template v-if="roles.decoration">
                    <span v-for="item in roles.decoration" :key="item" v-text="item"
                      class="border border-solid py-0.5 px-1 rounded shadow mx-0.5" />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <slot name="decoration"></slot>

          <slot></slot>
          <!-- 頁面選擇 -->
          <div class="hidden">
            <pagectrl :pages="2" v-model="currentPage" />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide v-if="type == 'default'">
        <!-- 資料表 -->
        <div class="w-full px-[9.744vw]">
          <div class="mt-[6.154vw] flex justify-between">
            <div class="text-[4.872vw] leading-[6.923vw] font-bold text-[#707070]" v-if="UserData.name ?? false">
              {{ UserData.name }}
            </div>
            <div>
              <UpdatePassport :roles="roles" :UserData="UserData" :UserDataTemplate="UserDataTemplate" />
            </div>
          </div>
          <div id="userdataTable" class="mx-[2.051vw]">
            <userdataTable :UserData="UserData" :UserDataTemplate="UserDataTemplate" />
          </div>
          <!-- 頁面選擇 -->
          <div class="hidden">
            <pagectrl :pages="2" v-model="currentPage" />
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <!-- 頁面選擇 -->
    <div class="mt-[10vw] mb-[5vw]">
      <pagectrl v-if="type == 'default'" :pages="2" v-model="currentPage" />
    </div>
  </div>
</template>
<script>
import { computed, onBeforeMount, ref, watch } from "vue";
import { Dialog } from "vant";
import 'vant/es/dialog/style/index';
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
  props: ["UserData", "UserDataTemplate", "roles", "type"],
  setup(props) {
    const router = useRouter();
    const type = computed(() => props.type ?? "default");
    const UserData = computed(() => props.UserData);
    console.log(UserData.value);
    const UserDataTemplate = computed(() => props.UserDataTemplate);

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

    if (type.value == "default") {
      // 處理QRcode 產生器
      const generateQrcode = setInterval(() => {
        if (UserData && UserData.value && UserData.value["email"]) {
          // 產生Qrcode
          generateQrcodeHandler(
            `${window.location.origin}/passport/${encodeURIComponent(
              UserData.value["email"]
            ).replace(/\./g, "DOT")}`,
            "qrcode"
          );
          clearInterval(generateQrcode);
        }
      }, 10);
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
        }
      );
    }

    // 檢查資料是否填寫完畢
    const allcomplete = computed(() => {
      return Object.values(UserData.value).indexOf("") == -1;
    });

    onBeforeMount(() => {
      initQrcodeHandler();
    });

    return {
      UserDataTemplate,
      UserData,
      roles,
      scan,
      currentPage,
      allcomplete,
      type,
    };
  },
};
</script>