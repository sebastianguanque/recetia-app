// src/components/navigation/__tests__/AppTabs.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import AppTabs from "../AppTabs.vue";

// ----------------------
// MOCK DE LAS STORES DE PINIA
// ----------------------
// Configuramos los mocks de las stores para Vitest
const mockAppStore = {
  currentTab: "recipe-creator",
  switchTab: vi.fn(),
};

const mockApiStore = {
  apiKey: "fake-api-key-123",
  setApiKey: vi.fn(),
};

// Usamos vi.mock para reemplazar las implementaciones reales de las stores
vi.mock("@/stores/app", () => ({
  useAppStore: () => mockAppStore,
}));

vi.mock("@/stores/api", () => ({
  useApiStore: () => mockApiStore,
}));

// ----------------------
// MOCK DE FUNCIONES GLOBALES
// ----------------------
// Mockeamos las funciones del navegador para controlar las interacciones
const mockPrompt = vi.spyOn(window, "prompt").mockImplementation(() => "");
const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

// ----------------------
// LIMPIEZA ANTES DE CADA TEST
// ----------------------
beforeEach(() => {
  // Reiniciamos el estado de los mocks antes de cada test
  setActivePinia(createPinia());
  mockAppStore.currentTab = "recipe-creator";
  vi.clearAllMocks();
});

// ----------------------
// TESTS
// ----------------------
describe("AppTabs.vue", () => {
  // Test 1: Comprueba que el componente se renderiza correctamente
  it("debe renderizar los botones de las pestañas y la pestaña activa por defecto", () => {
    const wrapper = mount(AppTabs);

    // Verifica que los tres botones existan
    const buttons = wrapper.findAll(".tab-button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].text()).toContain("Creador de Recetas");
    expect(buttons[1].text()).toContain("Lista de Compras");
    expect(buttons[2].text()).toContain("Configuración");

    // Verifica que la pestaña por defecto esté activa
    expect(wrapper.find("#recipe-creator-tab").classes()).toContain("active");
    expect(wrapper.find("#shopping-list-tab").classes()).not.toContain(
      "active"
    );
  });

  // Test 2: Simula el cambio de pestaña y verifica la llamada a la store
  it("debe llamar a la función switchTab de la store al hacer clic en un botón de pestaña", async () => {
    const wrapper = mount(AppTabs);

    // Simula un clic en el botón de "Lista de Compras"
    const shoppingListButton = wrapper.find("#shopping-list-tab");
    await shoppingListButton.trigger("click");

    // Verifica que switchTab fue llamado con el valor correcto
    expect(mockAppStore.switchTab).toHaveBeenCalledTimes(1);
    expect(mockAppStore.switchTab).toHaveBeenCalledWith("shopping-list");
  });

  // Test 3: Verifica la funcionalidad de "Configuración" cuando se cancela el prompt
  it("no debe actualizar la API key si el usuario cancela el prompt", async () => {
    const wrapper = mount(AppTabs);

    // Mockeamos el prompt para que devuelva null (cancelar)
    mockPrompt.mockReturnValue(null);

    const settingsButton = wrapper.find(
      '.tab-button[aria-label="Configuración de la aplicación"]'
    );
    await settingsButton.trigger("click");

    // La función setApiKey no debería ser llamada
    expect(mockApiStore.setApiKey).not.toHaveBeenCalled();
    // La alerta no debería ser llamada
    expect(mockAlert).not.toHaveBeenCalled();
  });

  // Test 4: Verifica la funcionalidad de "Configuración" cuando se ingresa una nueva key
  it("debe actualizar la API key si el usuario ingresa un valor válido en el prompt", async () => {
    const wrapper = mount(AppTabs);
    const newApiKey = "nueva-key-de-ejemplo";

    // Mockeamos el prompt para que devuelva un nuevo valor
    mockPrompt.mockReturnValue(newApiKey);

    const settingsButton = wrapper.find(
      '.tab-button[aria-label="Configuración de la aplicación"]'
    );
    await settingsButton.trigger("click");

    // La función setApiKey debería ser llamada con el valor correcto
    expect(mockApiStore.setApiKey).toHaveBeenCalledTimes(1);
    expect(mockApiStore.setApiKey).toHaveBeenCalledWith(newApiKey);

    // La alerta de éxito debería ser llamada
    expect(mockAlert).toHaveBeenCalledWith("API Key actualizada correctamente");
  });

  // Test 5: Verifica que la API key no se actualiza si el valor es un string vacío
  it("no debe actualizar la API key si el valor del prompt es un string vacío o solo espacios", async () => {
    const wrapper = mount(AppTabs);

    // Mockeamos el prompt con un string de espacios en blanco
    mockPrompt.mockReturnValue("   ");

    const settingsButton = wrapper.find(
      '.tab-button[aria-label="Configuración de la aplicación"]'
    );
    await settingsButton.trigger("click");

    // La función setApiKey no debería ser llamada porque el valor es inválido
    expect(mockApiStore.setApiKey).not.toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalled();
  });
});
