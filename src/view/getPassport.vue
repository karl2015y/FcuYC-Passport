<template>
  <div class="fixed top-0 left-0 z-10 w-screen h-screen flex flex-col justify-center">
    <PassportItem type="get" v-if="UserData && UserDataTemplate && UserRoles" :UserData="UserData"
      :UserDataTemplate="UserDataTemplate" :roles="UserRoles">
      <template v-if="iMAdmin" #vip>

        <van-search v-model="vip" class="mt-3" left-icon leftIcon="award" show-action placeholder="輸入勳章">
          <template #action>
            <div @click="addVip">新增</div>
          </template>
        </van-search>
        <ul>
          <template v-for="(item, index) in UserRoles['vip']" :key="item">
            <li class="p-2 shadow" @click="removeVip(index, item)">
              刪除「 {{ item }} 」勳章
            </li>
          </template>
        </ul>
      </template>


      <template v-if="iMAdmin" #decoration>

        <van-search v-model="decoration" class="mt-3" left-icon leftIcon="award" show-action placeholder="輸入勳章">
          <template #action>
            <div @click="addDecoration">新增</div>
          </template>
        </van-search>
        <ul>
          <template v-for="(item, index) in UserRoles['decoration']" :key="item">
            <li class="p-2 shadow" @click="removeDecoration(index, item)">
              刪除「 {{ item }} 」勳章
            </li>
          </template>
        </ul>
      </template>


      <div v-if="iMAdmin" class="mt-[6.154vw] flex justify-between">
        <div>
          <div class="text-[3.077vw] leading-[4.359vw] text-[#707070]">
            權限開通
          </div>
          <div class="ml-[8.205vw] text-[4.103vw] leading-[6.154vw] text-[#707070]">
            <div class="mt-2 flex gap-2 flex-wrap">
              <div>
                <button @click="toggleRoleHandler('Member')"
                  class="m-2 text-white font-bold py-2 px-4 border rounded w-36" :class="
                    (UserRoles.isMember ?? false)
                      ? 'bg-red-400 hover:bg-red-500 border-red-500'
                      : ' bg-blue-500 hover:bg-blue-700 border-blue-700'
                  ">
                  {{ (UserRoles.isMember ?? false) ? "關閉" : "開通" }}會員
                </button>

                <button @click="toggleRoleHandler('Admin')"
                  class="m-2 text-white font-bold py-2 px-4 border rounded w-36" :class="
                    UserRoles.isAdmin ?? false
                      ? 'bg-red-400 hover:bg-red-500 border-red-500'
                      : ' bg-blue-500 hover:bg-blue-700 border-blue-700'
                  ">
                  {{ UserRoles.isAdmin ?? false ? "關閉" : "開通" }}管理員
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PassportItem>
  </div>


</template>
<script>
import { useRoute } from "vue-router";

import { computed, onMounted, ref, watchEffect } from "vue";
import { useUserStore } from "../store/user.js";

import { getUserDataHandler, fire, setUserRolesHandler } from "@/api/user";
import PassportItem from "@/components/PassportItem.vue";

import { Toast, Dialog, Search } from "vant";
import { db } from "@/tools/firebase";
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { doc } from "firebase/firestore";
export default {
  components: {
    PassportItem,
    [Search.name]: Search,
    [Toast.name]: Toast,
  },
  setup() {
    const userStatus = useUserStore();
    const route = useRoute();
    const findEmail = ref(route.params.email ?? null);
    if (findEmail.value == null) {
      alert("sorry 網頁錯誤");
    }
    findEmail.value = decodeURIComponent(findEmail.value).replace(/DOT/g, ".");

    /**
     * 取得查看者的權限
     */
    const iMAdmin = computed(() => userStatus.get("roles")["isAdmin"] ?? false);

    /**
     * 取得使用這資料
     */
    const UserData = useFirestore(doc(db, "user", findEmail.value))
    const UserRoles = useFirestore(doc(db, "roles", findEmail.value), {
      isAdmin: false,
      isMember: false,
    })
    watchEffect(() => {
      if (UserRoles.value === null) {
        setUserRolesHandler(findEmail.value, { isMember: false })
      }
    })
    // const getUserData = async (email) => {
    //   const result = await fire(getUserDataHandler, [email]);
    //   UserData.value = result["UserData"];
    //   UserRoles.value = result["UserRoles"];
    // };
    const UserDataTemplate = computed(() => userStatus.get("UserDataTemplate"));

    /**
     * 開通會員
     */
    const toggleRoleHandler = async (roleName) => {
      Dialog.confirm({
        title: "更新帳號",
        message: `即將修改「${UserData.value.name}」的身分，是否繼續？`,
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then(async () => {
        console.log("即將開通會員權限", UserData.value, UserRoles.value);
        UserRoles.value[`is${roleName}`] = !(
          UserRoles.value[`is${roleName}`] ?? false
        );
        UserRoles.value = await setUserRolesHandler(
          UserData.value.email,
          UserRoles.value
        );
        setTimeout(() => {
          Toast.success({
            message: "更新成功",
            duration: 2000,
          });
        }, 1000);
      });
    };
    /**
     *  新增勳章
     */
    const decoration = ref("");
    const addDecoration = async () => {
      console.log(decoration.value);
      if (UserRoles.value["decoration"]) {
        UserRoles.value["decoration"].push(decoration.value);
      } else {
        UserRoles.value["decoration"] = [decoration.value];
      }
      UserRoles.value = await setUserRolesHandler(
        UserData.value.email,
        UserRoles.value
      );
      decoration.value = "";
      setTimeout(() => {
        Toast.success({
          message: "更新成功",
          duration: 2000,
        });
      }, 1000);
    };
    const removeDecoration = async (index, name) => {
      if (!confirm(`是否刪除${name}`)) {
        return;
      }
      UserRoles.value["decoration"].splice(index, 1);
      UserRoles.value = await setUserRolesHandler(
        UserData.value.email,
        UserRoles.value
      );
      decoration.value = "";
      setTimeout(() => {
        Toast.success({
          message: "更新成功",
          duration: 2000,
        });
      }, 1000);
    };

    /**
 *  新增職稱
 */
    const vip = ref("");
    const addVip = async () => {
      if (UserRoles.value["vip"]) {
        UserRoles.value["vip"].push(vip.value);
      } else {
        UserRoles.value["vip"] = [vip.value];
      }
      UserRoles.value = await setUserRolesHandler(
        UserData.value.email,
        UserRoles.value
      );
      vip.value = "";
      setTimeout(() => {
        Toast.success({
          message: "更新成功",
          duration: 2000,
        });
      }, 1000);
    };
    const removeVip = async (index, name) => {
      if (!confirm(`是否刪除${name}`)) {
        return;
      }
      UserRoles.value["vip"].splice(index, 1);
      UserRoles.value = await setUserRolesHandler(
        UserData.value.email,
        UserRoles.value
      );
      vip.value = "";
      setTimeout(() => {
        Toast.success({
          message: "更新成功",
          duration: 2000,
        });
      }, 1000);
    };


    return {
      UserData,
      UserRoles,
      iMAdmin,
      toggleRoleHandler,
      UserDataTemplate,
      decoration,
      addDecoration,
      removeDecoration,
      vip,
      addVip,
      removeVip,
    };
  },
};
</script>