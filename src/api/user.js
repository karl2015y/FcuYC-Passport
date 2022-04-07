import { db } from "@/tools/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUserStore } from "@/store/user";
const userStatus = useUserStore();
/**
 * 取得初始化模板
 */
export const getUserDataTemplateHandler = async () => {
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
export const getUserDataHandler = async (org_template = null) => {
    const template = org_template ? JSON.parse(JSON.stringify(org_template)) : await getUserDataTemplateHandler()
    const docRef = doc(db, "user", userStatus.user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let UserData = docSnap.data();
        console.log("取得資料成功", UserData);
        if (UserData.ver == template.ver) {
            return UserData
        }
        console.log("模板更新，建立對應欄位");
        UserData = await updateUserDataFromTemplate(
            docRef,
            UserData,
            org_template
        );
        console.log("已建立對應欄位");
        return UserData
    } else {
        // doc.data() will be undefined in this case
        console.log("無註冊資料，使用初始模板建立會員資料", template);

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
        return await getUserDataHandler(org_template)
    }
};

/**
 * 補上新版模板上的參數
 */
const updateUserDataFromTemplate = async (docRef, UserData, org_template) => {
    const template = org_template ? JSON.parse(JSON.stringify(org_template)) : await getUserDataTemplateHandler()
    Object.keys(template).forEach((key) => {
        if (!UserData.hasOwnProperty(key)) {
            UserData[key] = "";
        }
    });
    UserData["ver"] = template["ver"];
    setDoc(docRef, UserData);
    // return UserData;
    return await getUserDataHandler(org_template)
};

/**
   * 更新會員資料
   */
export const updateUserDataHandler = async (UserData) => {
    const docRef = doc(db, "user", userStatus.user.email);
    setDoc(docRef, UserData);
    console.log("更新成功");
    return await getUserDataHandler()
};