<template>
    <div v-show="showFireworks" class="
      w-screen
      h-screen
      z-[9999]
      fixed
      top-0
      left-0
      flex flex-col
      justify-center
      items-center
      bg-white bg-opacity-95
    ">
        <lottie-player class="-mt-40 w-96 h-96" autoplay loop mode="normal" src="/fireworks.json"></lottie-player>
        {{ fireworksText }}
        <div>
            <button v-show="showCloseBtn" @click="handleClose()" class="
          mt-5
          px-5
          bg-center bg-no-repeat bg-clip-padding bg-origin-padding
          shadow-[0_0.769vw_1.538vw_#00000029]
          rounded-[5.641vw]
          text-[3vw]
          font-bold
          w-full
          h-[10vw]
        ">
                關閉
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { db } from "../tools/firebase";
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { doc } from "firebase/firestore";
import { ref, watch, watchEffect } from "vue";
import { useUserStore } from "../store/user";
const userStatus = useUserStore();

/**
 * 取得角色資料 
 */
const roles = useFirestore(doc(db, "roles", userStatus.get('user').email), { isMember: false, isAdmin: false, vip: null, decoration: null })
watchEffect(() => {
    if (roles.value) {
        userStatus.set('roles', roles.value)
    }
})

const showFireworks = ref(false);
const fireworksText = ref('');
watch(() => userStatus.roles.vip, (newVips, oldVips) => {
    console.log('newVips', newVips, 'oldVips', oldVips);
    if ((newVips && newVips.length > 0 && oldVips === undefined) || (newVips && oldVips && newVips.length > oldVips.length )) {
        fireworksText.value = `歡迎「${newVips[newVips.length - 1]}」蒞臨中區逢甲校友青年團`
        showFireworks.value = true
        setTimeout(() => {
            showCloseBtn.value = true
        }, 3500);
        setTimeout(() => {
            showFireworks.value = false
            showCloseBtn.value = false
        }, 10000);

    }
})

watch(() => userStatus.roles.decoration, (newDecorations, oldDecorations) => {
    console.log('newDecorations', newDecorations, 'oldDecorations', oldDecorations);
    if ((newDecorations && newDecorations.length > 0 && oldDecorations === undefined) || (newDecorations && oldDecorations && newDecorations.length > oldDecorations.length )) {
        fireworksText.value = `恭喜獲得「${newDecorations[newDecorations.length - 1]}」勳章`
        showFireworks.value = true
        setTimeout(() => {
            showCloseBtn.value = true
        }, 3500);
        setTimeout(() => {
            showFireworks.value = false
            showCloseBtn.value = false
        }, 10000);

    }
})

const showCloseBtn = ref(false);
const handleClose = () => {
    showFireworks.value = false
    showCloseBtn.value = false
}

</script>

<style scoped>
</style>