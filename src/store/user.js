import { defineStore } from 'pinia'


const defVal = (key, val) => (localStorage.getItem(key) === null || localStorage.getItem(key) == 'undefined') ? val : JSON.parse(localStorage.getItem(key));



export const useUserStore = defineStore('userStatus', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      isLogin: false,
      loading: [],
      user: defVal('user', null),
      roles: defVal('roles', null),
      UserData: defVal('UserData', null),
      UserDataTemplate: defVal('UserDataTemplate', null),
    }
  },
  getters: {
    get: (state) => {
      return (key) => (state[key] ?? null)
    },
  },
  actions: {
    set(key, val) {
      console.log('set', 1, key, val);
      localStorage.setItem(key, JSON.stringify(val));// 存到localStorage
      if (key in this) {
        console.log('set', 2, key, this[key]);
        this[key] = val; // 修改store裡面的值
        console.log('set', 3, key, this[key]);
      }


    },

  },
})