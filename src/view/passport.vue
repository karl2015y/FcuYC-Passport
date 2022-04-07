<template>
  自己跟管理員才能看和編輯的護照
  {{ UserData }}
  <br />
  {{ userStatus.roles }}
  <img v-if="UserData" :src="UserData.picture" alt="" />
  <div v-show="generate_link_show">
    <canvas style="display: none" id="canvas" />
    <img src="" alt="" id="image" />
  </div>
  <div v-if="UserData" class="p-5">
    <h1 class="font-bold text-2xl">編輯區</h1>
    <div
      v-for="(value, key) in UserDataTemplate"
      :key="key"
      class="flex items-center gap-3"
    >
      <template v-if="value.length >= 3">
        <h2 class="w-20 px-2 mb-2" style="text-align-last: justify">
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
            :type="value[0]"
            :placeholder="value[2]"
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
      @click="updateUserDataHandler()"
      class="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        border border-blue-700
        rounded
        w-96
      "
    >
      更新
    </button>
  </div>
</template>
<script>
import { useUserStore } from "../store/user.js";

import { db } from "../tools/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, onMounted, computed, onBeforeMount } from "vue";

export default {
  setup() {
    const userStatus = useUserStore();
    /**
     * 取得初始化模板
     */
    const UserDataTemplate = ref(null);
    const getUserDataTemplate = async () => {
      const docRef = doc(db, "template", "signup");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const template = JSON.parse(docSnap.data().data);
        Object.keys(template).forEach((key) => {
          if (key != "ver") {
            template[key] = template[key].split(":");
            if (template[key].length >= 4 && template[key][0] == "select") {
              template[key][3] = template[key][3].split(",");
            }
          }
        });
        return template;
      } else {
        // doc.data() will be undefined in this case
        console.log("找不到模板");
      }
    };
    /**
     * 取得使用這資料
     */
    const UserData = ref(null);
    const UserDataRef = ref(null);
    const getUserData = async () => {
      const template = await getUserDataTemplate();
      UserDataTemplate.value = template;
      const docRef = doc(db, "user", userStatus.user.email);
      UserDataRef.value = docRef;
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        UserData.value = docSnap.data();
        console.log("取得資料成功", UserData.value);
        generateLinkHandler();
        if (UserData.value.ver != template.ver) {
          console.log("模板更新，建立對應欄位");
          UserData.value = await updateUserDataFromTemplate(
            docRef,
            UserData.value,
            template
          );
          console.log("已建立對應欄位");
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("無註冊資料，使用初始模板建立會員資料");

        Object.keys(template).forEach((key) => {
          if (key != "ver") {
            template[key] = "";
          }
        });
        template["email"] = userStatus.user.email;
        template["name"] = userStatus.user.name;
        template["picture"] = userStatus.user.picture;
        console.log(template);
        setDoc(docRef, template);
        console.log("註冊成功");
        getUserData();
      }
    };

    /**
     * 更新模板
     */
    const updateUserDataFromTemplate = async (docRef, UserData, template) => {
      console.log(template);
      Object.keys(template).forEach((key) => {
        if (!UserData.hasOwnProperty(key)) {
          UserData[key] = "";
        }
      });
      UserData["ver"] = template["ver"];
      setDoc(docRef, UserData);
      return UserData;
    };
    /**
     * 更新會員資料
     */
    const updateUserDataHandler = () => {
      setDoc(UserDataRef.value, UserData.value);
      console.log("更新成功");
      getUserData();
    };

    /**
     * 生成QRcode
     */

    const generate_link_show = ref(false);
    const generate_link = computed(() => {
      return `${window.location.origin}/passport/${encodeURIComponent(
        userStatus.user.email
      ).replace(/\./g, "DOT")}`;
    });
    const generateLinkHandler = () => {
      generate_link_show.value = true;
      const log = new QrCodeWithLogo({
        canvas: document.getElementById("canvas"),
        content: generate_link.value,
        width: 380,
        // download: true,
        image: document.getElementById("image"),
        logo: {
          src: "/logo.jpg",
        },
      })
        .toImage()
        .then((item) => {
          console.log(item);
        });
    };

    onBeforeMount(() => {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "/qrcode-with-logo.min.js";
      document.head.appendChild(script);
    });

    getUserData();
    return {
      userStatus,
      UserData,
      UserDataTemplate,
      updateUserDataHandler,
      generate_link_show,
    };
  },
};
</script>