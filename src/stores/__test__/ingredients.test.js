// src/stores/__tests__/ingredients.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useIngredientsStore } from "@/stores/ingredients";

// Mock del composable useLocalStorage
vi.mock("@/composables/useLocalStorage", () => {
  let storage = {};
  return {
    useLocalStorage: () => ({
      getItem: (key, defaultValue = []) => storage[key] ?? defaultValue,
      setItem: (key, value) => {
        storage[key] = value;
      },
    }),
  };
});

describe("useIngredientsStore", () => {
  let store;

  beforeEach(() => {
    // Crea una instancia de Pinia y actívala antes de cada prueba
    setActivePinia(createPinia());
    store = useIngredientsStore();
    // Limpia el almacenamiento mockeado antes de cada test para aislar las pruebas
    store.clearAllIngredients();
  });

  it("debería inicializar la lista de ingredientes como un array vacío", () => {
    expect(store.ingredients.length).toBe(0);
    expect(store.ingredients).toEqual([]);
  });

  it("debería añadir un nuevo ingrediente y guardarlo en el localStorage", () => {
    store.addIngredient("pollo ");
    expect(store.ingredients).toEqual(["pollo"]);

    // Comprueba que los espacios se normalizan y que los duplicados no se añaden
    store.addIngredient("Pollo");
    expect(store.ingredients).toEqual(["pollo"]);

    store.addIngredient("arroz");
    expect(store.ingredients).toEqual(["pollo", "arroz"]);
  });

  it("debería eliminar un ingrediente por su índice", () => {
    store.addIngredient("zanahoria");
    store.addIngredient("tomate");
    store.addIngredient("cebolla");

    store.removeIngredient(1); // Elimina "tomate"
    expect(store.ingredients).toEqual(["zanahoria", "cebolla"]);
  });

  it("debería borrar todos los ingredientes", () => {
    store.addIngredient("carne");
    store.addIngredient("leche");

    store.clearAllIngredients();
    expect(store.ingredients).toEqual([]);
  });

  it("debería categorizar los ingredientes correctamente", () => {
    store.addIngredient("pollo");
    store.addIngredient("zanahoria");
    store.addIngredient("arroz");
    store.addIngredient("leche");
    store.addIngredient("huevos");
    store.addIngredient("manzana");
    store.addIngredient("avena");
    store.addIngredient("lentejas");
    store.addIngredient("aceite");
    store.addIngredient("ingrediente-sin-categoria");

    const categorized = store.categorizeIngredients();

    expect(categorized.meats).toEqual(["pollo"]);
    expect(categorized.vegetables).toEqual(["zanahoria"]);
    expect(categorized.carbs).toEqual(["arroz"]);
    expect(categorized.dairy).toEqual(["leche"]);
    expect(categorized.eggs).toEqual(["huevos"]);
    expect(categorized.fruits).toEqual(["manzana"]);
    expect(categorized.cereals).toEqual(["avena"]);
    expect(categorized.legumes).toEqual(["lentejas"]);
    expect(categorized.fats).toEqual(["aceite"]);
    expect(categorized.others).toEqual(["ingrediente-sin-categoria"]);
  });
});
