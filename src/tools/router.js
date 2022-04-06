
import { useUserStore } from "../store/user";
import { createRouter, createWebHistory } from 'vue-router'

const route_name = "中逢青-"

const routes = [
    {
        name: "Passport", path: '/', component: () => import('../view/passport.vue'),
        meta: {
            title: '會員護照'
        }
    },
    {
        name: "Login", path: '/login', component: () => import('../view/login.vue'),
        meta: {
            title: '會員登入'
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
    if (to.name != "Login" && !UserStore.isLogin) next({ name: 'Login', query: { from: encodeURIComponent(window.location.href)} })
    if (to.meta.title) {
        document.title = route_name + to.meta.title
    }
    next();
})