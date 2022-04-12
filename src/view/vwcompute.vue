<template>
  <div class="flex justify-around border-b pb-1 mb-1 shadow">
    <div class="text-center">基礎寬度</div>
    <input class="px-2 shadow rounded" type="number" v-model.number="width" />
  </div>
  <div class="flex justify-around">
    <div class="text-center">PX</div>
    <div class="text-center">VW</div>
  </div>
  <template v-for="px in width" :key="px">
    <div
      v-if="mark[px]"
      class="flex justify-around border-b pb-1 mb-1 shadow-sm"
      @click="markHandler(px)"
      :class="{ 'bg-yellow-100': mark[px] }"
    >
      <div class="text-center">{{ px }} px</div>
      <div class="text-center">{{ vw(px) }} VW</div>
    </div>
  </template>

  <template v-for="px in width" :key="px">
    <div
      v-if="!mark[px]"
      class="flex justify-around border-b pb-1 mb-1 shadow-sm"
      @click="markHandler(px)"
    >
      <div class="text-center">{{ px }} px</div>
      <div class="text-center">{{ vw(px) }} VW</div>
    </div>
  </template>
</template>
<script>
import { computed, ref } from "vue";

export default {
  setup() {
    const width = ref(390);
    const vw = computed(
      () => (px) => Math.round((px / width.value) * 100000) / 1000
    );
    const mark = ref({});
    const markHandler = (px) => {
      mark.value[px] = !(mark.value[px] ?? false);
    };
    return {
      width,
      vw,
      mark,
      markHandler,
    };
  },
};
</script>