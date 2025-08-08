// src/components/navigation/__tests__/AppTabs.snapshot.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia, defineStore } from "pinia";
import AppTabs from "../AppTabs.vue";

describe("Snapshot visual: AppTabs.vue", () => {
  let pinia;
  let useAppStore;
  let useApiStore;
  let appStore;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    useAppStore = defineStore("app", {
      state: () => ({
        currentTab: "recipe-creator",
      }),
      actions: {
        switchTab(tabName) {
          this.currentTab = tabName;
        },
      },
    });

    useApiStore = defineStore("api", {
      state: () => ({
        apiKey: "clave-inicial",
      }),
      actions: {
        setApiKey(newKey) {
          this.apiKey = newKey;
        },
      },
    });

    // Inicializamos las stores para asegurar estado
    appStore = useAppStore();
    useApiStore();
  });

  it("estructura inicial con pestaña 'recipe-creator' activa coincide con el snapshot", () => {
    const wrapper = mount(AppTabs, {
      global: { plugins: [pinia] },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("estructura con pestaña 'shopping-list' activa coincide con el snapshot", () => {
    appStore.switchTab("shopping-list");

    const wrapper = mount(AppTabs, {
      global: { plugins: [pinia] },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
