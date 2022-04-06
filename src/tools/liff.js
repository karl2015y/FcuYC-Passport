import liff from '@line/liff';
import { userStore } from "../store/user.js";


liff.init({
    liffId: '1657035409-k7dgR7BZ', // Use own liffId
}).then(() => {
    const userStatus = userStore();
    userStatus.isLogin = liff.isLoggedIn()
    if (!userStatus.isLogin) {
        liff.login()
    } else {
        alert("登入成功")
        const { name, picture, sub, email } = liff.getDecodedIDToken();
        userStatus.user = {
            name: name,
            picture: picture,
            user_id: sub,
            email: email
        }



    }
});