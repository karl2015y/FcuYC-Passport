<template>
  自己跟管理員才能看和編輯的護照
  {{ UserData }}
  <br>
  {{userStatus.roles}}
  <img v-if="UserData" :src="UserData.picture" alt="">

  <h1>編輯區</h1>
  <div v-if="UserData">
    <div
      v-for="(value, key) in UserDataTemplate"
      :key="key"
      style="display: flex; justify-content: flex-start; align-items: center"
    >
      <template v-if="value.length >= 3">
        <h2>{{ value[1] }}</h2>
        <div v-if="value[0] == `select` && value.length >= 4">
          <select :name="key" v-model="UserData[key]">
            <option value="" disabled>{{ value[2] }}</option>
            <option v-for="item in value[3]" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div v-else>
          <input
            v-model="UserData[key]"
            :type="value[0]"
            :placeholder="value[2]"
          />
        </div>
      </template>
    </div>

    <button @click="updateUserDataHandler()">更新</button>
  </div>
</template>
<script>
import { useUserStore } from "../store/user.js";

import { db } from "../tools/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref } from "vue";

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

    getUserData();
    return {
      userStatus,
      UserData,
      UserDataTemplate,
      updateUserDataHandler,
    };
  },
};
</script>