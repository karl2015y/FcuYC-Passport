

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
  {{ text }}
  {{ userStatus.isLogin }}
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { userStore } from "./store/user.js";
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
const userStatus = userStore();
const text = ref("huhuh");
// text.value = liff.getLanguage();
</script>