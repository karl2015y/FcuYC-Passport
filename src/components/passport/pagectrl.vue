<template>
  <div class="flex  justify-center">
    <template v-for="page in pages" :key="page">
      <div
        @click="currentPage = page"
        class="
          w-[2.564vw]
          h-[2.564vw]
          shadow-[0_0_1.538vw_#0000004D]
          rounded-full
          mr-[3.333vw]
        "
        :class="page == currentPage ? 'bg-[#D7D7D7]' : 'bg-white'"
      />
    </template>
  </div>
</template>
<script>
import { computed, watch } from "vue";
import { useSwiper } from "swiper/vue";

export default {
  props: ["modelValue", "pages"],
  setup(props, content) {
    const swiper = useSwiper();

    const pages = computed(() => props.pages);
    const currentPage = computed({
      get: () => props.modelValue,
      set: (val) => {
        if (swiper) {
          swiper.value.slideTo(val - 1);
        } else {
          content.emit("update:modelValue", val);
        }
      },
    });

    watch(
      () => currentPage.value,
      (val) => {
        if (swiper) {
          swiper.value.slideTo(val - 1);
        }
      }
    );

    return {
      pages,
      currentPage,
    };
  },
};
</script>