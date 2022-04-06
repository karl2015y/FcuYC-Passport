<template>passport
{{userStatus.user}}
</template>
<script>
import { useUserStore } from "../store/user.js";

export default {
  setup() {
    const userStatus = useUserStore();
    return {
        userStatus
    }
  },
};
</script>