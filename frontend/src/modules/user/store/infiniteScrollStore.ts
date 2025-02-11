// stores/infiniteScrollStore.ts
import { defineStore } from 'pinia';

export const useInfiniteScrollStore = defineStore('infiniteScroll', {
  state: () => ({
    newPosts: []
  }),
  actions: {
    addPost(post) {
      this.newPosts = [...this.newPosts, post];
    },

    resetPosts() {
      this.newPosts = [];
    }
  }
});
