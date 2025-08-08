// src/components/navigation/__tests__/AppTabs.integration.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia, defineStore } from "pinia";
import AppTabs from "../AppTabs.vue";

describe("Integración: AppTabs.vue con Pinia real", () => {
  let useAppStore;
  let useApiStore;
  let pinia;
  let appStore;
  let apiStore;

  beforeEach(() => {
    // Creamos un Pinia limpio para cada test
    pinia = createPinia();
    setActivePinia(pinia);

    // Definimos stores reales pero simplificadas
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

    // Creamos instancias nuevas de las stores
    appStore = useAppStore();
    apiStore = useApiStore();

    // Reseteamos estado por si acaso
    appStore.currentTab = "recipe-creator";
    apiStore.apiKey = "clave-inicial";

    // Mocks de funciones globales
    vi.restoreAllMocks();
    vi.spyOn(window, "prompt").mockImplementation(() => "");
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("cambia la pestaña activa al hacer clic (flujo real con store)", async () => {
    const wrapper = mount(AppTabs, {
      global: { plugins: [pinia] },
    });

    expect(appStore.currentTab).toBe("recipe-creator");
    expect(wrapper.find("#recipe-creator-tab").classes()).toContain("active");

    await wrapper.find("#shopping-list-tab").trigger("click");

    expect(appStore.currentTab).toBe("shopping-list");
    expect(wrapper.find("#shopping-list-tab").classes()).toContain("active");
  });

  it("actualiza la API key correctamente con flujo real", async () => {
    const wrapper = mount(AppTabs, {
      global: { plugins: [pinia] },
    });

    const nuevaKey = "nueva-clave-real";
    window.prompt.mockReturnValue(nuevaKey);

    await wrapper
      .find('.tab-button[aria-label="Configuración de la aplicación"]')
      .trigger("click");

    expect(apiStore.apiKey).toBe(nuevaKey);
    expect(window.alert).toHaveBeenCalledWith(
      "API Key actualizada correctamente"
    );
  });

  it("no actualiza la API key si el prompt es cancelado o vacío", async () => {
    const wrapper = mount(AppTabs, {
      global: { plugins: [pinia] },
    });

    // Prompt devuelve null → cancelado
    window.prompt.mockReturnValue(null);
    await wrapper
      .find('.tab-button[aria-label="Configuración de la aplicación"]')
      .trigger("click");
    expect(apiStore.apiKey).toBe("clave-inicial");

    // Prompt devuelve solo espacios
    window.prompt.mockReturnValue("   ");
    await wrapper
      .find('.tab-button[aria-label="Configuración de la aplicación"]')
      .trigger("click");
    expect(apiStore.apiKey).toBe("clave-inicial");
  });
});
