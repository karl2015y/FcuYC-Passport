import { defineStore } from 'pinia'

export  const useUserStore = defineStore('userStatus', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      isLogin: false,
      user: null,
      loading:[],
      roles: null,
    }
  },
})