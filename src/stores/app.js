import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const isLoading = ref(false);
  const currentTab = ref("recipe-creator");

  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  const switchTab = (tab) => {
    currentTab.value = tab;
  };

  const initializeApp = () => {};

  return {
    isLoading,
    currentTab,
    setLoading,
    switchTab,
    initializeApp,
  };
});
