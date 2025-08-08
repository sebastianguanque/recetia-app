// src/stores/__tests__/app.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAppStore } from "@/stores/app";

describe("useAppStore", () => {
  let store;

  beforeEach(() => {
    // Crea una instancia de Pinia y actívala antes de cada prueba
    setActivePinia(createPinia());
    store = useAppStore();
  });

  it("debería tener un estado inicial correcto", () => {
    // Comprueba el estado inicial de la tienda
    expect(store.isLoading).toBe(false);
    expect(store.currentTab).toBe("recipe-creator");
  });

  it("debería establecer el estado de carga correctamente", () => {
    // Comprueba que setLoading cambia el valor de isLoading
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it("debería cambiar la pestaña actual correctamente", () => {
    // Comprueba que switchTab cambia el valor de currentTab
    store.switchTab("shopping-list");
    expect(store.currentTab).toBe("shopping-list");
    store.switchTab("saved-recipes");
    expect(store.currentTab).toBe("saved-recipes");
  });

  it("initializeApp debería ejecutar lógica de inicialización (si la hubiera)", () => {
    // Dado que initializeApp está vacío, solo comprobamos que se pueda llamar
    // sin errores. En un futuro, si añades lógica, este test podría
    // modificarse para comprobar los efectos de esa lógica.
    expect(() => store.initializeApp()).not.toThrow();
  });
});
