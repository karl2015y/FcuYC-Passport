<template>
  <div class="w-screen flex flex-col items-center">
    <h2>抽籤大賞</h2>
    <h1>{{ gameData.name }}</h1>
    <div v-if="gameData.gift.length > 0">
      <div v-if="current_gift">
        <h2>[目前抽出]</h2>
        <h1>{{ current_gift.name }}</h1>
        <img :src="current_gift.img" class="w-56 h-auto" alt="" />
        <h3>剩餘數量：{{ current_gift.count }}</h3>
      </div>
      <br />
      <div class="w-[50vw]" v-show="playing">
        <h2>[中獎人]</h2>
        <swiper :loop="true" :slidesPerView="1">
          <swiper-slide v-for="member in gameData.members" :key="member">
            <div class="hidden">
              <pagectrl
                :pages="gameData.members.length"
                v-model="currentPage"
              />
            </div>
            <h1>{{ member.graduation }}</h1>
            <h1>{{ member.name }}</h1>
            <img
              :src="member.picture"
              class="
                w-56
                h-56
                rounded-full
                shadow
                border-solid border-4
                object-cover
              "
              :class="{
                'border-red-500': member.gender == '女',
                'border-blue-500': member.gender == '男',
              }"
              alt=""
            /> </swiper-slide
        ></swiper>
      </div>
      <button
        v-if="!playing"
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
        @click="randomGiveGift()"
      >
        抽獎
      </button>
    </div>
    <div v-else>抽獎結束</div>
    <!-- 中獎人 -->
    <div v-if="gameData.result.length > 0">
      <h1>已中獎</h1>
      <div class="flex gap-3 justify-around">
        <div v-for="item in gameData.result" :key="item">
          <div>
            <h2>[抽種禮物]</h2>
            <h1>{{ item.gift.name }}</h1>
            <img :src="item.gift.img" class="w-56 h-auto" alt="" />
          </div>
          <div>
            <h2>[中獎人]</h2>
            <h1>
              {{ item.person.graduation }}
            </h1>
            <h1>{{ item.person.name }}</h1>
            <img
              :src="item.person.picture"
              class="
                w-56
                h-56
                rounded-full
                shadow
                border-solid border-4
                object-cover
              "
              :class="{
                'border-red-500': item.person.gender == '女',
                'border-blue-500': item.person.gender == '男',
              }"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <van-popup v-model:show="show_get_give" closeable>
    <div>
      <h2>[抽種禮物]</h2>
      <h1>{{ gameData.result[gameData.result.length - 1].gift.name }}</h1>
      <img
        :src="gameData.result[gameData.result.length - 1].gift.img"
        class="w-56 h-auto"
        alt=""
      />
    </div>
    <div>
      <h2>[中獎人]</h2>
      <h1>
        {{ gameData.result[gameData.result.length - 1].person.graduation }}
      </h1>
      <h1>{{ gameData.result[gameData.result.length - 1].person.name }}</h1>
      <img
        :src="gameData.result[gameData.result.length - 1].person.picture"
        class="w-56 h-56 rounded-full shadow border-solid border-4 object-cover"
        :class="{
          'border-red-500':
            gameData.result[gameData.result.length - 1].person.gender == '女',
          'border-blue-500':
            gameData.result[gameData.result.length - 1].person.gender == '男',
        }"
        alt=""
      />
    </div>
  </van-popup>
</template>


<script>
import { getGameData } from "@/api/game";
import { computed, ref, watch } from "vue";
import { Popup } from "vant";
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";

import pagectrl from "@/components/passport/pagectrl.vue";

export default {
  components: { [Popup.name]: Popup, Swiper, SwiperSlide, pagectrl },
  setup() {
    const gameData = ref({ gift: [], members: [], result: [] });
    const currentPage = ref(1);
    const nextPageHandler = () => {
      const len = gameData.value.members.length;
      currentPage.value =
        currentPage.value + 1 > len ? 1 : currentPage.value + 1;
    };
    getGameData("aczWi3jxDcTT4V7hId67").then((data) => {
      gameData.value = data;
    });

    /**
     * 現在要抽得商品
     */
    const current_gift = computed({
      get() {
        const gifts = gameData.value.gift ?? null;
        if (gifts == null || gifts.length == 0) {
          return null;
        }
        return gifts[0];
      },
    });

    /**
     * 抽籤程式
     */
    const show_get_give = ref(false);
    const playing = ref(false);
    const get_gift_person = ref({
      name: "",
      graduation: "第三屆中逢青",
      gender: "不公開",
      picture: "/logo.jpg",
    });
    const randomGiveGift = (times = 15, waitSec = 0.2) => {
      playing.value = true;
      const array = gameData.value.members;
      const randomIndex = Math.floor(Math.random() * array.length);
      get_gift_person.value = array[randomIndex];
      let i = 0;
      const x = setInterval(() => {
        nextPageHandler();

        i++;
        if (i > times) {
          gameData.value.result.push({
            person: get_gift_person.value,
            gift: current_gift.value,
          });
          show_get_give.value = true;
          array.splice(randomIndex, 1); // 刪除已經中獎的
          current_gift.value.count--; // 刪除商品數量
          if (current_gift.value.count <= 0) {
            console.log("沒禮物了");
            gameData.value.gift.shift();
          }
          get_gift_person.value = {
            name: "",
            graduation: "第三屆中逢青",
            gender: "不公開",
            picture: "/logo.jpg",
          };
          playing.value = false;

          clearInterval(x);
        }
      }, waitSec * 1000);
    };
    return {
      gameData,
      current_gift,
      get_gift_person,
      randomGiveGift,
      playing,
      show_get_give,
      currentPage,
      nextPageHandler,
    };
  },
};
</script>