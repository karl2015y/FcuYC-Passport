import { defineStore } from 'pinia'

export  const userStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      isLogin: false,
      name: '',
      isAdmin: false,
    }
  },
})