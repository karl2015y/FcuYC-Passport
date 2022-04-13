<template>
  <template v-for="(value, key) in UserDataTemplate" :key="key">
    <div
      v-if="value.length >= 3 && key != 'name'"
      class="
        flex
        items-center
        justify-between
        text-[3.59vw]
        leading-[5.128vw]
        text-[#707070]
        mt-[6.923vw]
      "
    >
      <h2 class="">
        {{ value[1] }}
      </h2>

      <div class="">
        {{ UserData[key] ?? false ? UserData[key] : "無資料" }}
      </div>
    </div>
  </template>
</template>
<script>
import { computed } from "vue";

export default {
  props: ["UserDataTemplate", "UserData"],
  setup(props) {
    const UserDataTemplate = computed(() => props.UserDataTemplate);
    const UserData = computed(() => props.UserData);
    return {
      UserDataTemplate,
      UserData,
    };
  },
};
</script>