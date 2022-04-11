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
            console.log("開發模式 給假資料");
            userStatus.isLogin = true;
            userStatus.user = {
                name: "[test]林裕凱 Karl",
                picture:
                    "https://profile.line-scdn.net/0hs4i7K4gULBtUTgd6NQVTTGgLInYjYCpTLChhf3JHJX8pd21Faixjfncdei5-LG1NaClifHQddnxw",
                user_id: "test_Uc9ea0e6c07eeaf10472cc301a7c47173",
                email: "test.karl2015y@gmail.com",
            };
        } else {
            userStatus.isLogin = liff.isLoggedIn();

            if (!userStatus.isLogin) {
                console.log("沒登入跳去LINE");
                liff.login({ redirectUri: window.location.href });
            } else {
                console.log("已經登入了");

                const liff_user = userStatus.get('user')

                if (liff_user == undefined) {
                    console.log("完全沒有緩存 要等等");
                    const { name, picture, sub, email } = liff.getDecodedIDToken();
                    userStatus.set('user', {
                        name: name,
                        picture: picture,
                        user_id: sub,
                        email: email,
                    })
                } else {
                    console.log("有緩存 先進 資料等等更新");
                    userStatus.set('user', liff_user)
                    setTimeout(() => {
                        const { name, picture, sub, email } = liff.getDecodedIDToken();
                        userStatus.set('user', {
                            name: name,
                            picture: picture,
                            user_id: sub,
                            email: email,
                        })
                    }, 10);

                }



            }
        }
    });