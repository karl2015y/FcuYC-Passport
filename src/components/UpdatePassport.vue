<template>
  <button
    @click="show_edit_area = !show_edit_area"
    :class="roles.isMember ? 'bg-[#9580E8]' : 'bg-[#6AB7E6]'"
    class="
      bg-center bg-no-repeat bg-clip-padding bg-origin-padding
      shadow-[0_0.769vw_1.538vw_#00000029]
      rounded-[5.641vw]
      text-[3.333vw]
      leading-[4.872vw]
      text-white
      w-[18.718vw]
      h-[6.923vw]
    "
  >
    編輯資料
  </button>

  <van-popup v-model:show="show_edit_area" closeable teleport="body" position="bottom">
    <div v-if="UserData" class="p-5 mx-auto m-3 bg-white min-w-full w-[90vw]">
      <h1 class="font-bold text-2xl mb-3">編輯個人資料</h1>
      <div
        v-for="(value, key) in UserDataTemplate"
        :key="key"
        class="flex items-center flex-col"
      >
        <template v-if="value.length >= 3">
          <h2 class="w-full mt-2 mb-1">
            {{ value[1] }}
          </h2>
          <div
            v-if="value[0] == `select` && value.length >= 4"
            class="inline-block relative w-full mb-2"
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
          <div v-else class="w-full mb-2">
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
        :class="roles.isMember ? 'bg-[#9580E8]' : 'bg-[#6AB7E6]'"
        class="
          mt-3
          bg-center bg-no-repeat bg-clip-padding bg-origin-padding
          shadow-[0_0.769vw_1.538vw_#00000029]
          rounded-[5.641vw]
          text-[5vw]
          font-bold
          text-white
          w-full
          h-[10vw]
        "
      >
        編輯資料
      </button>
    </div>
  </van-popup>
</template>

<script>
import { updateUserDataHandler } from "@/api/user";
import { computed, ref, watch } from "vue";
import { useUserStore } from "../store/user.js";
import { Toast } from "vant";
import { Popup } from "vant";

export default {
  props: ["UserData", "UserDataTemplate", "roles"],
  components: { [Toast.name]: Toast, [Popup.name]: Popup },
  setup(props, content) {
    const userStatus = useUserStore();
    const roles = computed(() => props.roles);

    const UserData = computed(() => props.UserData);
    const UserDataTemplate = computed(() => props.UserDataTemplate);

    const show_edit_area = ref(false);
    /**
     * 更新會員資料
     */
    const updateUserData = async () => {
      userStatus.set("UserData", await updateUserDataHandler(UserData.value));
      show_edit_area.value = false;
      setTimeout(() => {
        Toast.success({
          message: "更新成功",
          duration: 2000,
        });
      }, 1000);
    };

    return {
      updateUserData,
      UserData,
      UserDataTemplate,
      show_edit_area,
      roles,
    };
  },
};
</script>


<style scoped>
input[type="date"][val=""]:before {
  color: lightgrey;
  content: attr(placeholder) !important;
  margin-right: 0.5em;
}
</style>
