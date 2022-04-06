import { useUserStore } from "../store/user";


import liff from "@line/liff";
liff
    .init({
        liffId: "1657035409-k7dgR7BZ", // Use own liffId
    })
    .then(() => {
        const userStatus = useUserStore();
        const is_dev = import.meta.env.DEV;
        if (is_dev) {
            userStatus.isLogin = true;
            userStatus.user = {
                name: "[test]林裕凱 Karl",
                picture:
                    "https://profile.line-scdn.net/0hs4i7K4gULBtUTgd6NQVTTGgLInYjYCpTLChhf3JHJX8pd21Faixjfncdei5-LG1NaClifHQddnxw",
                user_id: "test_Uc9ea0e6c07eeaf10472cc301a7c47173",
                email: "[test]karl2015y@gmail.com",
            };
        } else {
            userStatus.isLogin = liff.isLoggedIn({ redirectUri: window.location.href });
            if (!userStatus.isLogin) {
                liff.login();
            } else {
                alert("登入成功");
                const { name, picture, sub, email } = liff.getDecodedIDToken();
                userStatus.user = {
                    name: name,
                    picture: picture,
                    user_id: sub,
                    email: email,
                };
            }
        }
    });