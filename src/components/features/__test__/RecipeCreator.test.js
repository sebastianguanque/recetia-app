// src/components/features/__test__/RecipeCreator.test.js
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { reactive } from "vue";
import RecipeCreator from "../RecipeCreator.vue";

// ----------------------
// MOCK COMPONENTES HIJOS
// ----------------------
vi.mock("@/components/features/IngredientsList.vue", () => ({
  default: {
    name: "IngredientsList",
    template: "<div>IngredientsList</div>",
  },
}));

vi.mock("@/components/ui/MealTypeSelector.vue", () => ({
  default: {
    name: "MealTypeSelector",
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: "<div>MealTypeSelector</div>",
  },
}));

vi.mock("@/components/ui/RecipeCard.vue", () => ({
  default: {
    name: "RecipeCard",
    props: ["recipe", "mealType"],
    template: "<div>RecipeCard</div>",
  },
}));

// ----------------------
// MOCK STORES Y COMPOSABLE
// ----------------------
const mockIngredientsStore = reactive({
  ingredients: [],
});

const mockAppStore = reactive({
  isLoading: false,
});

const mockRecipeGenerator = reactive({
  selectedMealType: "",
  generatedRecipe: null,
  generateRecipe: vi.fn(),
});

vi.mock("@/stores/ingredients", () => ({
  useIngredientsStore: () => mockIngredientsStore,
}));

vi.mock("@/stores/app", () => ({
  useAppStore: () => mockAppStore,
}));

vi.mock("@/composables/useRecipeGenerator", () => ({
  useRecipeGenerator: () => mockRecipeGenerator,
}));

// ----------------------
// MOCK ALERTA GLOBAL
// ----------------------
beforeAll(() => {
  global.alert = vi.fn();
});

// ----------------------
// LIMPIEZA ANTES DE CADA TEST
// ----------------------
beforeEach(() => {
  mockIngredientsStore.ingredients = [];
  mockAppStore.isLoading = false;
  mockRecipeGenerator.selectedMealType = "";
  mockRecipeGenerator.generatedRecipe = null;
  mockRecipeGenerator.generateRecipe.mockReset();
  alert.mockClear();
});

// ----------------------
// TESTS
// ----------------------
describe("RecipeCreator.vue", () => {
  it("debe deshabilitar el botón si no hay ingredientes", async () => {
    const wrapper = mount(RecipeCreator);
    mockIngredientsStore.ingredients = [];
    mockRecipeGenerator.selectedMealType = "cena";
    await flushPromises();
    const button = wrapper.find(".generate-btn");
    expect(button.element.disabled).toBe(true);
  });

  it("debe deshabilitar el botón si no hay tipo de comida seleccionado", async () => {
    const wrapper = mount(RecipeCreator);
    mockIngredientsStore.ingredients = ["tomate"];
    mockRecipeGenerator.selectedMealType = "";
    await flushPromises();
    const button = wrapper.find(".generate-btn");
    expect(button.element.disabled).toBe(true);
  });

  it("debe habilitar el botón si hay ingredientes y tipo de comida seleccionado", async () => {
    const wrapper = mount(RecipeCreator);
    mockIngredientsStore.ingredients = ["tomate"];
    mockRecipeGenerator.selectedMealType = "almuerzo";
    await flushPromises();
    const button = wrapper.find(".generate-btn");
    expect(button.element.disabled).toBe(false);
  });

  it("debe deshabilitar el botón y cambiar el texto cuando está cargando", async () => {
    const wrapper = mount(RecipeCreator);
    mockIngredientsStore.ingredients = ["tomate"];
    mockRecipeGenerator.selectedMealType = "almuerzo";
    mockAppStore.isLoading = true;
    await flushPromises();
    const button = wrapper.find(".generate-btn");
    expect(button.element.disabled).toBe(true);
    expect(button.text()).toContain("Generando...");
  });

  it("debe llamar a generateRecipe al hacer clic en el botón", async () => {
    const wrapper = mount(RecipeCreator);
    mockIngredientsStore.ingredients = ["tomate"];
    mockRecipeGenerator.selectedMealType = "almuerzo";
    await flushPromises();
    const button = wrapper.find(".generate-btn");
    await button.trigger("click");
    expect(mockRecipeGenerator.generateRecipe).toHaveBeenCalled();
  });

  it("debe mostrar una alerta si generateRecipe falla", async () => {
    mockRecipeGenerator.generateRecipe.mockRejectedValue(
      new Error("API Error")
    );
    const wrapper = mount(RecipeCreator);
    mockIngredientsStore.ingredients = ["tomate"];
    mockRecipeGenerator.selectedMealType = "almuerzo";
    await flushPromises();
    const button = wrapper.find(".generate-btn");
    await button.trigger("click");
    await flushPromises();
    expect(alert).toHaveBeenCalledWith("API Error");
  });

  it("debe mostrar el componente RecipeCard si hay una receta generada", async () => {
    const wrapper = mount(RecipeCreator);
    expect(wrapper.findComponent({ name: "RecipeCard" }).exists()).toBe(false);
    mockRecipeGenerator.generatedRecipe = { title: "Receta de prueba" };
    await flushPromises();
    expect(wrapper.findComponent({ name: "RecipeCard" }).exists()).toBe(true);
  });
});
