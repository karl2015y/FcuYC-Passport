<template>
  <div class="flex gap-[3.333vw] justify-center">
    <template v-for="page in pages" :key="page">
      <div
        class="w-[2.564vw] h-[2.564vw] shadow-[0_0_1.538vw_#0000004D] rounded-full"
        :class="page == currentPage ? 'bg-[#D7D7D7]' : 'bg-white'"
      />
    </template>
  </div>
</template>
<script>
import { computed } from "vue";

export default {
  props: ["current-page", "pages"],
  setup(props) {
    const pages = computed(() => props.pages);
    const currentPage = computed(() => props.currentPage);
    return {
      pages,
      currentPage,
    };
  },
};
</script>