
import { useUserStore } from "@/store/user";
const userStatus = useUserStore();

import "../tools/firebase";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";


/**
 * 到資料庫確定一下該用戶是否登記過，如果沒有就加上去
 */
export const getDBDataHandler = (email, password, callback = null) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            if (callback) callback();

        })
        .catch((error) => {
            if (error.code == "auth/user-disabled") {
                alert(`該帳號(${email})已被停用，請聯絡中逢青管理員`);
            } else if (error.code == "auth/user-not-found") {
                createUserWithEmailAndPassword(auth, email, password).then(
                    (userCredential) => {
                        const user = userCredential.user;

                        if (callback) callback();

                    }
                );
            } else {
                alert(
                    `好像出錯了，請將此頁截圖，並聯絡中逢青管理員。\nError Code：${error.code}`
                );
            }
        });
};

import { db } from "@/tools/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
export const getMyDataHandler = async (org_template = null) => {
    const template = org_template ? JSON.parse(JSON.stringify(org_template)) : await getUserDataTemplateHandler()
    const docRef = doc(db, "user", userStatus.user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let UserData = docSnap.data();
        console.log("取得資料成功", UserData);
        if (UserData.ver == template.ver) {
            return UserData
        }
        UserData["line_user_id"] = userStatus.user.user_id;
        UserData["email"] = userStatus.user.email;
        UserData["name"] = userStatus.user.name;
        UserData["picture"] = userStatus.user.picture;

        console.log("模板更新，建立對應欄位",);
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
        template["line_user_id"] = userStatus.user.user_id;
        template["email"] = userStatus.user.email;
        template["name"] = userStatus.user.name;
        template["picture"] = userStatus.user.picture;
        console.log(template);
        setDoc(docRef, template);
        console.log("註冊成功");
        return await getMyDataHandler(org_template)
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
    return await getMyDataHandler(org_template)
};

/**
   * 更新會員資料
   */
export const updateUserDataHandler = async (UserData) => {
    const docRef = doc(db, "user", userStatus.user.email);
    setDoc(docRef, UserData);
    console.log("更新成功");
    return await getMyDataHandler()
};



/**
 * 取得特定會員的資料
 */
export const getUserDataHandler = async (email, needRole = true) => {
    const docRef = doc(db, "user", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const UserData = docSnap.data()
        let result = { UserData }
        if (needRole) {
            const UserRoles = await getUserRolesHandler(email);
            result = { UserRoles, UserData }
        }
        console.log("取得資料成功", result);
        return result
    } else {
        console.log("無註冊資料");
    }

};

/**
 * 取得特定會員的角色資料
 */
export const getUserRolesHandler = async (email) => {
    const docRef = doc(db, "roles", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("找不到角色");
        return {
            isMember: false,
        };
    }
};


/**
 * 取得特定會員的資料
 */
export const fire = async (callFunction, paras) => {
    try {
        return await callFunction(...paras)
    } catch (error) {
        if (error.code == "permission-denied") {
            console.log("權限不足");
            alert("權限不足");
            window.location.href = "/"
        }
    }
};