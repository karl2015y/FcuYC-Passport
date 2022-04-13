
import { useUserStore } from "@/store/user";
const userStatus = useUserStore();

import "../tools/firebase";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";


const startloadHandler = () => {
    const now = new Date().getTime()
    userStatus.loading.push(now);
}
const stopLoadHandler = () => {
    setTimeout(() => {
        if (userStatus.loading.length > 0) userStatus.loading.shift();
    }, 66);
}
/**
 * 到資料庫確定一下該用戶是否登記過，如果沒有就加上去
 */
export const getDBDataHandler = async (email, password, callback = null) => {
    if (callback) callback();
    userStatus.set('roles', await getUserRolesHandler(email))
    console.log("取得角色", userStatus.roles);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("確定該email已註冊");
        })
        .catch((error) => {
            if (error.code == "auth/user-disabled") {
                alert(`該帳號(${email})已被停用，請聯絡中逢青管理員`);
            } else if (error.code == "auth/user-not-found") {
                createUserWithEmailAndPassword(auth, email, password).then(
                    () => {
                        console.log("沒註冊，但已經登記");
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
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment } from "firebase/firestore";


/**
 * 監聽註冊人數
 */
let current_user_number = 0
const counter_userRef = doc(db, "counter", "user");
onSnapshot(counter_userRef, (doc) => {
    const data = doc.data()
    if ('current' in data) {
        current_user_number = data['current']
        console.log("current_user_number", current_user_number);
    }
});


// 更新註冊人數
const addUserCounter = () => {
    updateDoc(counter_userRef, {
        current: increment(1)
    });
}

// 亂數英文字
const getRandomLetter = (max, possible = "ABEFGHKMNPQRSTWXYZ") => {
    var text = "";
    for (var i = 0; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

// 取得ID
const getUserId = () => {
    return getRandomLetter(1) + getRandomLetter(1, "0123456789") + String(current_user_number).padStart(2, '0')
}

// 監聽角色變化
export const subscribeMyRoles = (callback = null) => {
    console.log('subscribeMyRoles');
    onSnapshot(doc(db, "roles", userStatus.user.email), (doc) => {
        const data = doc.data()
        if (data) {
            console.log('subscribeMyRoles updated', data);
            if (callback) callback(data)
        }

        // if ('current' in data) {
        //     current_user_number = data['current']
        //     console.log("current_user_number", current_user_number);
        // }
    });
}


/**
 * 取得初始化模板
 */
export const getUserDataTemplateHandler = async () => {
    // startloadHandler()
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
        // stopLoadHandler()
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
    // startloadHandler()
    const template = org_template ? JSON.parse(JSON.stringify(org_template)) : await getUserDataTemplateHandler()
    const docRef = doc(db, "user", userStatus.user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let UserData = docSnap.data();
        console.log("取得資料成功", UserData);
        if (UserData.ver == template.ver) {
            // stopLoadHandler()
            return UserData
        }
        UserData["line_user_id"] = userStatus.user.user_id;
        UserData["email"] = userStatus.user.email;
        UserData["name"] = userStatus.user.name;
        UserData["picture"] = userStatus.user.picture;
        if (!("user_id" in UserData)) {
            UserData["user_id"] = getUserId();
            addUserCounter();

        }

        console.log("模板更新，建立對應欄位",);
        UserData = await updateUserDataFromTemplate(
            docRef,
            UserData,
            org_template
        );
        console.log("已建立對應欄位");
        // stopLoadHandler()
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
        template["user_id"] = getUserId();
        addUserCounter()

        console.log(template);
        setDoc(docRef, template);
        console.log("註冊成功");
        // stopLoadHandler()
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
    stopLoadHandler()
    return await getMyDataHandler(org_template)
};

/**
   * 更新會員資料
   */
export const updateUserDataHandler = async (UserData) => {
    startloadHandler()
    const docRef = doc(db, "user", userStatus.user.email);
    setDoc(docRef, UserData);
    console.log("更新成功");
    stopLoadHandler()
    return await getMyDataHandler()
};



/**
 * 取得特定會員的資料
 */
export const getUserDataHandler = async (email, needRole = true) => {
    startloadHandler()
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
        stopLoadHandler()
        return result
    } else {
        console.log("無註冊資料");
    }

};

/**
 * 取得特定會員的角色資料
 */
export const getUserRolesHandler = async (email) => {
    // startloadHandler()
    const docRef = doc(db, "roles", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        stopLoadHandler()
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("找不到角色");
        // stopLoadHandler()
        return {
            isMember: false,
        };
    }
};


/**
 * 修改會員的角色資料
 */
export const setUserRolesHandler = async (email, roleData) => {
    startloadHandler()
    const docRef = doc(db, "roles", email);
    setDoc(docRef, roleData);
    console.log("更新成功");
    stopLoadHandler()
    return await getUserRolesHandler(email)
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