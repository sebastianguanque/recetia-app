import { mount } from "@vue/test-utils";
import RecipeCreator from "@/components/features/RecipeCreator.vue";
import { nextTick, reactive } from "vue";
import { vi } from "vitest";

// Mocks de stores y composables
// Usa `reactive` para simular la reactividad de los stores de Pinia.
// Esto asegura que los cambios de estado sean detectados por el componente.
const mockIngredientsStore = reactive({
  ingredients: [],
});

const mockAppStore = reactive({
  isLoading: false,
});

const mockRecipeGenerator = reactive({
  selectedMealType: null,
  generatedRecipe: null,
  generateRecipe: vi.fn(() => Promise.resolve()),
});

// Mock para window.alert
const globalAlertSpy = vi.spyOn(window, "alert");

vi.mock("@/stores/ingredients", () => ({
  useIngredientsStore: () => mockIngredientsStore,
}));

vi.mock("@/stores/app", () => ({
  useAppStore: () => mockAppStore,
}));

vi.mock("@/composables/useRecipeGenerator", () => ({
  useRecipeGenerator: () => mockRecipeGenerator,
}));

describe("Integración: RecipeCreator.vue", () => {
  beforeEach(() => {
    // Restablece los estados de los mocks antes de cada test
    mockIngredientsStore.ingredients = [];
    mockAppStore.isLoading = false;
    mockRecipeGenerator.selectedMealType = null;
    mockRecipeGenerator.generatedRecipe = null;
    mockRecipeGenerator.generateRecipe.mockClear();
    globalAlertSpy.mockClear();
  });

  it("renderiza correctamente con todos los subcomponentes visibles", async () => {
    const wrapper = mount(RecipeCreator);
    await nextTick();

    expect(wrapper.find(".meal-type-section").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "IngredientsList" }).exists()).toBe(
      true
    );
    expect(wrapper.find("button.generate-btn").exists()).toBe(true);
  });

  it("el botón se deshabilita si no hay ingredientes o tipo de comida", async () => {
    const wrapper = mount(RecipeCreator);
    await nextTick();

    expect(wrapper.find("button.generate-btn").element.disabled).toBe(true);
  });

  it("permite generar receta cuando hay ingredientes y tipo de comida", async () => {
    const wrapper = mount(RecipeCreator);
    // Simula los cambios en los stores reactivos
    mockIngredientsStore.ingredients = [{ name: "Tomate" }];
    mockRecipeGenerator.selectedMealType = "almuerzo";
    await nextTick(); // Espera a que el componente reaccione a los cambios

    expect(wrapper.find("button.generate-btn").element.disabled).toBe(false);

    await wrapper.find("button.generate-btn").trigger("click");

    expect(mockRecipeGenerator.generateRecipe).toHaveBeenCalled();
  });

  it("muestra alerta si ocurre un error durante la generación", async () => {
    const wrapper = mount(RecipeCreator);

    mockIngredientsStore.ingredients = [{ name: "Tomate" }];
    mockRecipeGenerator.selectedMealType = "almuerzo";
    // Mockea la función para que rechace la promesa
    mockRecipeGenerator.generateRecipe.mockRejectedValue(
      new Error("Falló la API")
    );
    await nextTick();

    await wrapper.find("button.generate-btn").trigger("click");

    // Usa un `await` para esperar a que la promesa se resuelva/rechace
    // y se ejecute el bloque `catch`
    await nextTick();

    expect(globalAlertSpy).toHaveBeenCalledWith("Falló la API");
  });

  it("renderiza el componente RecipeCard si hay receta generada", async () => {
    const wrapper = mount(RecipeCreator);

    mockRecipeGenerator.generatedRecipe = { title: "Ensalada fresca" };
    mockRecipeGenerator.selectedMealType = "almuerzo";
    await nextTick();

    expect(wrapper.findComponent({ name: "RecipeCard" }).exists()).toBe(true);
  });
});
