
import { useUserStore } from "../store/user";
import { createRouter, createWebHistory } from 'vue-router'

const route_name = "中逢青-"

const routes = [
    {
        name: "Login", path: '/', component: () => import('../view/login.vue'),
        meta: {
            title: '會員登入'
        }
    },
    {
        name: "Passport", path: '/passport', component: () => import('../view/passport.vue'),
        meta: {
            title: '會員護照'
        }
    },
    {
        name: "findPassport", path: '/passport/:email', component: () => import('../view/getPassport.vue'),
        meta: {
            title: '會員護照'
        }
    }, {
        name: "game", path: '/game', component: () => import('../view/game.vue'),
        meta: {
            title: '抽籤大賞'
        }
    },

]


export const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach((to, from, next) => {
    const UserStore = useUserStore();
    // 如果沒有登入就轉登入頁
    if (to.name != "Login" && !UserStore.isLogin) {
        const fromPath = window.location.href.replace(window.location.origin, "");
        console.log("先去登入頁面確定是否已經登入", fromPath);
        next({ name: 'Login', query: { to: encodeURIComponent(fromPath) } })
    }
    if (to.meta.title) {
        document.title = route_name + to.meta.title
    }
    next();
})