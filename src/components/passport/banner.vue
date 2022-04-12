<template>
  <div
    v-if="UserData"
    class="
      mx-[7.692vw]
      rounded-[33px] rounded-b-none
      bg-clip-padding
      shadow-[0_0_40px_#00000029]
      relative
    "
    :class="roles.isMember ? 'bg-[#785BEC]' : 'bg-[#5BB4EC]'"
  >
    <!-- 頭貼 -->
    <div class="flex justify-center">
      <img
        :src="UserData.picture"
        alt=""
        class="
          -mt-[8.6vw]
          w-[15.64vw]
          h-[15.64vw]
          rounded-full
          shadow
          border-solid
          object-cover
          border-[0.77vw] border-white
        "
        :class="{
          'border-red-500': UserData.gender == '女',
          'border-blue-500': UserData.gender == '男',
        }"
      />
    </div>
    <div class="flex h-[32vw] overflow-hidden">
      <div class="w-3/5 pl-[5.897vw]">
        <div>
          <picture>
            <source
              srcset="/design/badge_third/badge_third@2x.png"
              media="(min-width: 500px)"
            />
            <img src="/design/badge_third/badge_third.png" alt="第三屆標籤" />
          </picture>
        </div>

        <transition
          enter-active-class="animate__animated animate__fadeInLeft animate__faster"
          leave-active-class="animate__animated hidden absolute"
        >
          <div
            v-if="currentPage == 1"
            class="
              mt-[1.5vw]
              font-black
              text-white text-[8.461vw]
              leading-[12.307vw]
            "
          >
            中逢青{{ roles.isMember ? "團員" : "護照" }}
          </div>
        </transition>

        <transition
          enter-active-class="animate__animated animate__fadeInRight animate__faster"
          leave-active-class="animate__animated hidden absolute"
        >
          <div
            v-if="currentPage == 2"
            class="
              mt-[1.5vw]
              font-black
              text-white text-[7.3vw]
              leading-[12.307vw]
            "
          >
            {{ roles.isMember ? "團員" : "" }}基本資料
          </div>
        </transition>

        <div class="mt-[0.769vw] font-black text-white flex items-end">
          <div class="text-[3.888vw] leading-[5.128vw]">#A001</div>
          <div
            v-if="!roles.isMember"
            class="
              scale-75
              text-[3.076vw]
              leading-[3.9vw]
              whitespace-nowrap
              -ml-[2vw]
            "
          >
            若已加入，請稍候管理員開通。
          </div>
        </div>
      </div>
      <div class="w-2/5">
        <!-- 首頁 -->
        <transition
          enter-active-class="animate__animated animate__fadeInLeft animate__faster"
          leave-active-class="animate__animated hidden absolute"
        >
          <div v-show="currentPage == 1">
            <picture class="w-full h-auto">
              <source
                srcset="/design/banner_man/banner_man@2x.png"
                media="(min-width: 500px)"
              />
              <img src="/design/banner_man/banner_man.png" alt="會員" />
            </picture>
          </div>
        </transition>
        <!-- 資料表 -->
        <transition
          enter-active-class="animate__animated animate__fadeInRight animate__faster"
          leave-active-class="animate__animated hidden "
        >
          <div v-show="currentPage == 2">
            <picture class="w-full h-auto">
              <source
                srcset="/design/banner_girl/banner_girl@2x.png"
                media="(min-width: 500px)"
              />
              <img src="/design/banner_girl/banner_girl.png" alt="會員" />
            </picture>
          </div>
        </transition>
      </div>
    </div>
  </div>

</template>

<script>
import { computed } from "vue";

export default {
  props: ["current-page", "UserData", "roles"],
  setup(props) {
    const UserData = computed(() => props.UserData);
    const roles = computed(() => props.roles);
    const currentPage = computed(() => props.currentPage);

    return {
      UserData,
      roles,
      currentPage,
    };
  },
};
</script>