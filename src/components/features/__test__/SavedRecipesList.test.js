// src/components/features/__tests__/SavedRecipesList.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, reactive, nextTick } from "vue";
import SavedRecipesList from "../SavedRecipesList.vue";

// ----------------------
// MOCK STORES
// ----------------------
// Creamos un mock reactivo para el store de recetas.
// Esto nos permite simular y manipular el estado de las recetas en cada prueba.
const mockRecipesStore = reactive({
  savedRecipes: [],
  selectedRecipesForShopping: [],
  deleteRecipe: vi.fn(),
  clearAllRecipes: vi.fn(),
  toggleRecipeSelection: vi.fn(),
});

// Mockeamos el módulo `@/stores/recipes` para que devuelva nuestro objeto mock.
vi.mock("@/stores/recipes", () => ({
  useRecipesStore: () => mockRecipesStore,
}));

// ----------------------
// MOCK GLOBAL `confirm`
// ----------------------
// Mockeamos la función global `window.confirm` para evitar que se muestren
// cuadros de diálogo durante las pruebas.
const mockConfirm = vi.spyOn(window, "confirm");

// ----------------------
// LIMPIEZA ANTES DE CADA TEST
// ----------------------
// Restablecemos el estado de los mocks antes de cada prueba para asegurar que
// cada test sea independiente.
beforeEach(() => {
  mockRecipesStore.savedRecipes = [];
  mockRecipesStore.selectedRecipesForShopping = [];
  mockRecipesStore.deleteRecipe.mockClear();
  mockRecipesStore.clearAllRecipes.mockClear();
  mockRecipesStore.toggleRecipeSelection.mockClear();
  mockConfirm.mockClear();
});

// ----------------------
// TESTS
// ----------------------
describe("SavedRecipesList.vue", () => {
  // Test 1: Muestra el mensaje de "no hay recetas" si la lista está vacía.
  it('debe mostrar el mensaje de "no hay recetas" si la lista está vacía', () => {
    const wrapper = mount(SavedRecipesList);
    expect(wrapper.find(".no-recipes").exists()).toBe(true);
    expect(wrapper.find(".no-recipes").text()).toContain(
      "No hay recetas guardadas."
    );
  });

  // Test 2: Renderiza la lista de recetas guardadas.
  it("debe renderizar la lista de recetas guardadas", async () => {
    mockRecipesStore.savedRecipes = [
      {
        id: "1",
        data: {
          nombre: "Pizza Casera",
          tiempo: "45 min",
          porciones: "2 porciones",
        },
        createdAt: "2023-10-27T10:00:00Z",
      },
      {
        id: "2",
        data: {
          nombre: "Ensalada César",
          tiempo: "15 min",
          porciones: "1 porción",
        },
        createdAt: "2023-10-27T11:00:00Z",
      },
    ];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    expect(wrapper.findAll(".recipe-item")).toHaveLength(2);
    expect(wrapper.find(".no-recipes").exists()).toBe(false);
  });

  // Test 3: El botón de eliminar todas las recetas está deshabilitado si no hay recetas.
  it('debe deshabilitar el botón de "Eliminar Todas" si no hay recetas', () => {
    mockRecipesStore.savedRecipes = [];
    const wrapper = mount(SavedRecipesList);
    expect(wrapper.find(".clear-btn").element.disabled).toBe(true);
  });

  // Test 4: El botón de eliminar todas las recetas está habilitado si hay recetas.
  it('debe habilitar el botón de "Eliminar Todas" si hay recetas', async () => {
    mockRecipesStore.savedRecipes = [{ id: "1", data: {}, createdAt: "" }];
    const wrapper = mount(SavedRecipesList);
    await nextTick();
    expect(wrapper.find(".clear-btn").element.disabled).toBe(false);
  });

  // Test 5: Llama a `deleteRecipe` si el usuario confirma la eliminación.
  it("debe llamar a deleteRecipe cuando se hace clic en el botón de eliminar y se confirma", async () => {
    mockRecipesStore.savedRecipes = [
      { id: "1", data: { nombre: "Pizza Casera" }, createdAt: "" },
    ];
    mockConfirm.mockReturnValue(true); // Simula que el usuario hace clic en Aceptar
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    const deleteButton = wrapper.find(".recipe-delete-btn");
    await deleteButton.trigger("click");

    expect(mockRecipesStore.deleteRecipe).toHaveBeenCalledWith("1");
  });

  // Test 6: NO llama a `deleteRecipe` si el usuario cancela la eliminación.
  it("no debe llamar a deleteRecipe si se cancela la eliminación", async () => {
    mockRecipesStore.savedRecipes = [
      { id: "1", data: { nombre: "Pizza Casera" }, createdAt: "" },
    ];
    mockConfirm.mockReturnValue(false); // Simula que el usuario hace clic en Cancelar
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    const deleteButton = wrapper.find(".recipe-delete-btn");
    await deleteButton.trigger("click");

    expect(mockRecipesStore.deleteRecipe).not.toHaveBeenCalled();
  });

  // Test 7: Llama a `clearAllRecipes` si el usuario confirma la eliminación masiva.
  it('debe llamar a clearAllRecipes cuando se hace clic en "Eliminar Todas" y se confirma', async () => {
    mockRecipesStore.savedRecipes = [{ id: "1", data: {}, createdAt: "" }];
    mockConfirm.mockReturnValue(true);
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    const clearButton = wrapper.find(".clear-btn");
    await clearButton.trigger("click");

    expect(mockRecipesStore.clearAllRecipes).toHaveBeenCalled();
  });

  // Test 8: El estilo `selected` se aplica a una receta seleccionada.
  it('debe aplicar la clase "selected" a las recetas seleccionadas', async () => {
    mockRecipesStore.savedRecipes = [
      { id: "1", data: { nombre: "Pizza" }, createdAt: "" },
      { id: "2", data: { nombre: "Ensalada" }, createdAt: "" },
    ];
    mockRecipesStore.selectedRecipesForShopping = ["2"];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    const allRecipes = wrapper.findAll(".recipe-item");
    expect(allRecipes[0].classes()).not.toContain("selected");
    expect(allRecipes[1].classes()).toContain("selected");
  });

  // Test 9: Llama a `toggleRecipeSelection` cuando se hace clic en el botón de selección.
  it("debe llamar a toggleRecipeSelection al hacer clic en el botón de selección", async () => {
    mockRecipesStore.savedRecipes = [
      { id: "1", data: { nombre: "Pizza" }, createdAt: "" },
    ];
    const wrapper = mount(SavedRecipesList);
    await nextTick();

    const selectButton = wrapper.find(".recipe-select-btn");
    await selectButton.trigger("click");

    expect(mockRecipesStore.toggleRecipeSelection).toHaveBeenCalledWith("1");
  });
});
