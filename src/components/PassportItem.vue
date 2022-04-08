<template>
  <img v-if="UserData" :src="UserData.picture" alt="" />
</template>
<script>
import { computed } from "vue";

export default {
  props: ["UserData"],
  setup(props) {
    const UserData = computed(() => props.UserData);
    return {
      UserData,
    };
  },
};
</script>