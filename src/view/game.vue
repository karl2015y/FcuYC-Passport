<template>
  <div class="w-screen h-screen flex justify-center items-center flex-col">
    <h2>抽籤大賞</h2>
    <h1>{{ gameData.name }}</h1>
    <div v-if="gameData.gift.length > 0">
      <div v-if="current_gift">
        <h2>[目前抽出]</h2>
        <h1>{{ current_gift.name }}</h1>
        <h3>剩餘數量：{{ current_gift.count }}</h3>
      </div>
      <div>
        <h2>[中獎人]</h2>
        <h1>{{ get_gift_person.graduation }}</h1>
        <h1>{{ get_gift_person.name }}</h1>
        <img
          :src="get_gift_person.picture"
          class="
            w-56
            h-56
            rounded-full
            shadow
            border-solid border-4
            object-cover
          "
          :class="{
            'border-red-500': get_gift_person.gender == '女',
            'border-blue-500': get_gift_person.gender == '男',
          }"
          alt=""
        />
      </div>
      <button v-if="!playing" @click="randomGiveGift(30)">抽獎</button>
    </div>
    <div v-else>抽獎結束</div>
  </div>
</template>


<script>
import { getGameData } from "@/api/game";
import { computed, ref } from "vue";
export default {
  setup() {
    const gameData = ref({ gift: [], members: [] });
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
     * 中獎人
     */
    const playing = ref(false);
    const get_gift_person = ref({
      name: "",
      graduation: "第三屆中逢青",
      gender: "不公開",
      picture: "/logo.jpg",
    });
    const randomGiveGift = (times, waitSec = 0.1) => {
      playing.value = true;
      const array = gameData.value.members;
      let i = 0;
      const x = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * array.length);
        get_gift_person.value = array[randomIndex];

        i++;
        if (i > times) {
          console.log(get_gift_person.value, current_gift.value);
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
    };
  },
};
</script>