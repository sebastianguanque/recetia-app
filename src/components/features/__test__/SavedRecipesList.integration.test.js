// src/components/features/__tests__/SavedRecipesList.integration.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import SavedRecipesList from "../SavedRecipesList.vue";
import { useRecipesStore } from "@/stores/recipes";
import { nextTick } from "vue";

// ----------------------
// MOCK GLOBAL `confirm`
// ----------------------
// Mockeamos la función global `window.confirm` para evitar que se muestren
// cuadros de diálogo durante las pruebas.
const mockConfirm = vi.spyOn(window, "confirm");

// ----------------------
// MOCK DATOS
// ----------------------
const MOCK_RECIPE = {
  id: "mock-id-1",
  data: {
    nombre: "Tarta de Manzana",
    tiempo: "60 min",
    porciones: "4 porciones",
  },
  createdAt: new Date().toISOString(),
};

const ANOTHER_MOCK_RECIPE = {
  id: "mock-id-2",
  data: {
    nombre: "Sopa de Pollo",
    tiempo: "30 min",
    porciones: "2 porciones",
  },
  createdAt: new Date().toISOString(),
};

// ----------------------
// TESTS DE INTEGRACIÓN
// ----------------------
describe("Integración: SavedRecipesList.vue", () => {
  let recipesStore;

  // Configuración de Pinia para la prueba de integración
  beforeEach(() => {
    setActivePinia(createPinia());
    // Obtenemos una instancia real del store
    recipesStore = useRecipesStore();
    // Limpiamos el store antes de cada prueba para aislar los tests
    recipesStore.clearAllRecipes();
    mockConfirm.mockClear();
  });

  // Test 1: Muestra el estado vacío y el botón de limpiar deshabilitado cuando el store está vacío
  it("debe mostrar el estado vacío y el botón de limpiar deshabilitado cuando el store está vacío", async () => {
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    // Verificamos que el mensaje de "estado vacío" esté presente
    expect(wrapper.find(".no-recipes").exists()).toBe(true);
    expect(wrapper.find(".no-recipes").text()).toContain(
      "No hay recetas guardadas."
    );

    // Verificamos que el botón de 'Eliminar Todas' esté deshabilitado
    const clearButton = wrapper.find(".clear-btn");
    expect(clearButton.element.disabled).toBe(true);
  });

  // Test 2: Renderiza las recetas correctamente desde el store
  it("debe renderizar las recetas desde el store y habilitar el botón de limpiar", async () => {
    recipesStore.savedRecipes = [MOCK_RECIPE, ANOTHER_MOCK_RECIPE];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    // Verificamos que se rendericen las dos recetas
    const recipeItems = wrapper.findAll(".recipe-item");
    expect(recipeItems).toHaveLength(2);
    expect(wrapper.find(".no-recipes").exists()).toBe(false);

    // Verificamos que el botón de 'Eliminar Todas' esté habilitado
    const clearButton = wrapper.find(".clear-btn");
    expect(clearButton.element.disabled).toBe(false);
  });

  // Test 3: Elimina una receta del store al hacer clic en su botón
  it("debe eliminar una receta del store cuando se hace clic en su botón de eliminar", async () => {
    recipesStore.savedRecipes = [MOCK_RECIPE, ANOTHER_MOCK_RECIPE];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    // Verificamos que el store tenga 2 recetas
    expect(recipesStore.savedRecipes).toHaveLength(2);

    // Simulamos que el usuario confirma la acción
    mockConfirm.mockReturnValue(true);

    const deleteButton = wrapper.find(
      `[data-recipe-id="${MOCK_RECIPE.id}"] .recipe-delete-btn`
    );
    await deleteButton.trigger("click");
    await nextTick();

    // Verificamos que el store real tenga ahora 1 receta
    expect(recipesStore.savedRecipes).toHaveLength(1);
    expect(recipesStore.savedRecipes).not.toContainEqual(MOCK_RECIPE);
    expect(wrapper.findAll(".recipe-item")).toHaveLength(1);
  });

  // Test 4: Limpia todas las recetas del store al hacer clic en el botón de limpiar
  it("debe limpiar todas las recetas del store cuando se hace clic en el botón de 'Eliminar Todas'", async () => {
    recipesStore.savedRecipes = [MOCK_RECIPE, ANOTHER_MOCK_RECIPE];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    // Verificamos que haya 2 elementos en la lista del DOM
    expect(wrapper.findAll(".recipe-item")).toHaveLength(2);

    // Simulamos que el usuario confirma la acción
    mockConfirm.mockReturnValue(true);

    const clearButton = wrapper.find(".clear-btn");
    await clearButton.trigger("click");
    await nextTick();

    // Verificamos que el store real esté vacío
    expect(recipesStore.savedRecipes).toEqual([]);
    // Verificamos que el DOM muestre el estado vacío
    expect(wrapper.find(".no-recipes").exists()).toBe(true);
  });

  // Test 5: Selecciona una receta del store al hacer clic en su botón de selección
  it("debe seleccionar una receta al hacer clic en su botón", async () => {
    recipesStore.savedRecipes = [MOCK_RECIPE];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    // Verificamos que la receta no está seleccionada inicialmente
    expect(recipesStore.selectedRecipesForShopping).toEqual([]);
    expect(wrapper.find(".recipe-item").classes()).not.toContain("selected");

    const selectButton = wrapper.find(".recipe-select-btn");
    await selectButton.trigger("click");
    await nextTick();

    // Verificamos que la receta se ha agregado a la lista de seleccionadas en el store
    expect(recipesStore.selectedRecipesForShopping).toContain(MOCK_RECIPE.id);
    // Verificamos que la clase `selected` se ha aplicado al elemento del DOM
    expect(wrapper.find(".recipe-item").classes()).toContain("selected");
  });

  // Test 6: Deselecciona una receta del store al hacer clic en su botón de selección
  it("debe deseleccionar una receta que ya estaba seleccionada", async () => {
    recipesStore.savedRecipes = [MOCK_RECIPE];
    recipesStore.selectedRecipesForShopping = [MOCK_RECIPE.id];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    // Verificamos que la clase `selected` esté presente inicialmente
    expect(wrapper.find(".recipe-item").classes()).toContain("selected");

    const selectButton = wrapper.find(".recipe-select-btn");
    await selectButton.trigger("click");
    await nextTick();

    // Verificamos que la receta se ha eliminado de la lista de seleccionadas en el store
    expect(recipesStore.selectedRecipesForShopping).not.toContain(
      MOCK_RECIPE.id
    );
    // Verificamos que la clase `selected` se ha eliminado del elemento del DOM
    expect(wrapper.find(".recipe-item").classes()).not.toContain("selected");
  });
});
