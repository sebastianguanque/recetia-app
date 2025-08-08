// src/stores/__tests__/recipes.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useRecipesStore } from "@/stores/recipes";

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

describe("useRecipesStore", () => {
  let store;
  const mockRecipe = {
    title: "Ensalada de Quinoa",
    ingredients: ["quinoa", "tomate", "pepino"],
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useRecipesStore();
    // Limpia el almacenamiento mockeado
    store.clearAllRecipes();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debería tener un estado inicial correcto", () => {
    expect(store.savedRecipes).toEqual([]);
    expect(store.selectedRecipesForShopping).toEqual([]);
  });

  it("debería guardar una receta con metadatos correctos", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    store.saveRecipe(mockRecipe);

    expect(store.savedRecipes.length).toBe(1);
    expect(store.savedRecipes[0].data).toEqual(mockRecipe);
    expect(store.savedRecipes[0].type).toBe("individual");
    expect(store.savedRecipes[0].id).toBe(now);
  });

  it("debería eliminar una receta y su selección", () => {
    const recipeId = 12345;
    store.savedRecipes = [
      { id: recipeId, data: mockRecipe },
      { id: 67890, data: mockRecipe },
    ];
    store.selectedRecipesForShopping = [recipeId];

    store.deleteRecipe(recipeId);

    expect(store.savedRecipes.length).toBe(1);
    expect(store.savedRecipes.some((r) => r.id === recipeId)).toBe(false);
    expect(store.selectedRecipesForShopping).toEqual([]);
  });

  it("debería borrar todas las recetas y selecciones", () => {
    store.savedRecipes = [{ id: 1, data: mockRecipe }];
    store.selectedRecipesForShopping = [1];

    store.clearAllRecipes();

    expect(store.savedRecipes).toEqual([]);
    expect(store.selectedRecipesForShopping).toEqual([]);
  });

  it("debería alternar la selección de una receta", () => {
    const recipeId = 12345;
    expect(store.selectedRecipesForShopping).not.toContain(recipeId);

    // Selecciona la receta
    store.toggleRecipeSelection(recipeId);
    expect(store.selectedRecipesForShopping).toContain(recipeId);

    // Deselecciona la receta
    store.toggleRecipeSelection(recipeId);
    expect(store.selectedRecipesForShopping).not.toContain(recipeId);
  });
});
