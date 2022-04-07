<template>
  <div v-if="UserData" class="p-5 w-96 mx-auto  m-3 bg-white">
    <h1 class="font-bold text-2xl mb-3">編輯個人資料</h1>
    <div
      v-for="(value, key) in UserDataTemplate"
      :key="key"
      class="flex items-center gap-3"
    >
      <template v-if="value.length >= 3">
        <h2 class="w-24 px-2 mb-2" style="text-align-last: justify">
          {{ value[1] }}
        </h2>
        <div
          v-if="value[0] == `select` && value.length >= 4"
          class="inline-block relative w-72 mb-2"
        >
          <select
            :name="key"
            v-model="UserData[key]"
            class="
              shadow
              appearance-none
              border
              rounded
              w-full
              py-2
              px-3
              text-gray-700
              leading-tight
              focus:outline-none focus:shadow-outline
            "
          >
            <option value="" disabled>{{ value[2] }}</option>
            <option v-for="item in value[3]" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
          <div
            class="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              flex
              items-center
              px-2
              text-gray-700
            "
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
        <div v-else class="w-72 mb-2">
          <input
            v-model="UserData[key]"
            :placeholder="value[2]"
            :type="value[0]"
            :val="UserData[key]"
            class="
              shadow
              appearance-none
              border
              rounded
              w-full
              py-2
              px-3
              text-gray-700
              leading-tight
              focus:outline-none focus:shadow-outline
            "
          />
        </div>
      </template>
    </div>

    <button
      @click="updateUserData()"
      class="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        border border-blue-700
        rounded
        w-full
      "
    >
      儲存
    </button>
  </div>
</template>

<script>
import { updateUserDataHandler } from "@/api/user";
import { ref, watch } from "vue";
import { Toast } from 'vant';

export default {
  props: ["modelValue", "UserDataTemplate"],
  components: { [Toast.name]: Toast },
  setup(props, content) {
    //   雙向value
    const UserData = ref(props.modelValue);
    watch(
      () => props.modelValue,
      (val) => {
        UserData.value = val;
      }
    );
    watch(UserData, (val) => {
      content.emit("update:modelValue", val);
    });

    const UserDataTemplate = ref(props.UserDataTemplate);

    /**
     * 更新會員資料
     */
    const updateUserData = async () => {
        UserData.value = await updateUserDataHandler(UserData.value);
        Toast.success('更新成功');

    };
    return {
      updateUserData,
      UserData,
      UserDataTemplate,
    };
  },
};
</script>