<template>
    <div>

    </div>
</template>

<script setup lang="ts">

import { db } from "../tools/firebase";
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { doc } from "firebase/firestore";
import { watchEffect } from "vue";
import { useUserStore } from "../store/user";
const userStatus = useUserStore();

/**
 * 取得角色資料 
 */
const roles = useFirestore(doc(db, "roles", userStatus.get('user').email), { isMember: false })
watchEffect(() => {
    if (roles.value) {
        userStatus.set('roles', roles.value)
    }
})

</script>

<style scoped>
</style>