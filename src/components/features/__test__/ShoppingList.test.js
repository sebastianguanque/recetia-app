// src/components/features/__tests__/ShoppingList.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { reactive, nextTick } from "vue";
import ShoppingList from "../ShoppingList.vue";

// ----------------------
// MOCK COMPONENTES HIJOS
// ----------------------
// Mockeamos los componentes hijos para aislarnos y probar solo la lógica de ShoppingList.vue.
vi.mock("@/components/features/SavedRecipesList.vue", () => ({
  default: {
    name: "SavedRecipesList",
    template: "<div>SavedRecipesList</div>",
  },
}));

vi.mock("@/components/ui/ShoppingOptions.vue", () => ({
  default: {
    name: "ShoppingOptions",
    props: ["includeBasics", "groupByCategory", "excludeInventory"],
    emits: [
      "update:includeBasics",
      "update:groupByCategory",
      "update:excludeInventory",
    ],
    template: "<div>ShoppingOptions</div>",
  },
}));

vi.mock("@/components/features/ShoppingListResult.vue", () => ({
  default: {
    name: "ShoppingListResult",
    props: ["shoppingList", "groupByCategory"],
    emits: ["clear"],
    template: "<button @click=\"$emit('clear')\">Clear Shopping List</button>",
  },
}));

// ----------------------
// MOCK STORES Y COMPOSABLE
// ----------------------
// Creamos mocks reactivos para simular el estado de los stores y el composable.
const mockRecipesStore = reactive({
  selectedRecipesForShopping: [],
});

const mockAppStore = reactive({
  isLoading: false,
});

const mockShoppingListGenerator = {
  generateShoppingList: vi.fn(),
};

// Mockeamos los módulos para que devuelvan nuestros objetos simulados.
vi.mock("@/stores/recipes", () => ({
  useRecipesStore: () => mockRecipesStore,
}));

vi.mock("@/stores/app", () => ({
  useAppStore: () => mockAppStore,
}));

vi.mock("@/composables/useShoppingListGenerator", () => ({
  useShoppingListGenerator: () => mockShoppingListGenerator,
}));

// ----------------------
// MOCK FUNCIONES GLOBALES
// ----------------------
// Mockeamos `alert` y `confirm` para evitar diálogos emergentes en las pruebas.
const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
const mockConfirm = vi.spyOn(window, "confirm");

// ----------------------
// LIMPIEZA ANTES DE CADA TEST
// ----------------------
// Reseteamos el estado de los mocks antes de cada test.
beforeEach(() => {
  mockRecipesStore.selectedRecipesForShopping = [];
  mockAppStore.isLoading = false;
  mockShoppingListGenerator.generateShoppingList.mockClear();
  mockAlert.mockClear();
  mockConfirm.mockClear();
});

// ----------------------
// TESTS
// ----------------------
describe("ShoppingList.vue", () => {
  // Test 1: El botón de generar está deshabilitado si no hay recetas seleccionadas.
  it("debe deshabilitar el botón si no hay recetas seleccionadas", () => {
    mockRecipesStore.selectedRecipesForShopping = [];
    const wrapper = mount(ShoppingList);
    const generateBtn = wrapper.find(".generate-btn");
    expect(generateBtn.element.disabled).toBe(true);
  });

  // Test 2: El botón de generar está habilitado si hay recetas seleccionadas.
  it("debe habilitar el botón si hay recetas seleccionadas", async () => {
    mockRecipesStore.selectedRecipesForShopping = ["1", "2"];
    const wrapper = mount(ShoppingList);
    await nextTick();
    const generateBtn = wrapper.find(".generate-btn");
    expect(generateBtn.element.disabled).toBe(false);
  });

  // Test 3: El botón de generar muestra el estado de carga.
  it("debe deshabilitar el botón y cambiar el texto cuando está cargando", async () => {
    mockRecipesStore.selectedRecipesForShopping = ["1"];
    mockAppStore.isLoading = true;
    const wrapper = mount(ShoppingList);
    await nextTick();
    const generateBtn = wrapper.find(".generate-btn");
    expect(generateBtn.element.disabled).toBe(true);
    expect(generateBtn.text()).toContain("Generando...");
  });

  // Test 4: Se llama a la función de generación al hacer clic en el botón.
  it("debe llamar a generateShoppingList al hacer clic en el botón", async () => {
    mockRecipesStore.selectedRecipesForShopping = ["1"];
    const mockResult = [{ name: "Leche", quantity: "1 litro" }];
    mockShoppingListGenerator.generateShoppingList.mockResolvedValue(
      mockResult
    );

    const wrapper = mount(ShoppingList);
    await nextTick();

    const generateBtn = wrapper.find(".generate-btn");
    await generateBtn.trigger("click");

    expect(mockShoppingListGenerator.generateShoppingList).toHaveBeenCalledWith(
      {
        includeBasics: true,
        groupByCategory: true,
        excludeInventory: true,
      }
    );
    expect(wrapper.vm.shoppingListData).toEqual(mockResult);
    expect(wrapper.findComponent({ name: "ShoppingListResult" }).exists()).toBe(
      true
    );
  });

  // Test 5: Maneja errores de la función de generación.
  it("debe mostrar una alerta si generateShoppingList falla", async () => {
    mockRecipesStore.selectedRecipesForShopping = ["1"];
    const errorMessage = "API Error";
    mockShoppingListGenerator.generateShoppingList.mockRejectedValue(
      new Error(errorMessage)
    );

    const wrapper = mount(ShoppingList);
    await nextTick();

    const generateBtn = wrapper.find(".generate-btn");
    await generateBtn.trigger("click");
    await nextTick();

    expect(mockAlert).toHaveBeenCalledWith(errorMessage);
  });

  // Test 6: El componente `ShoppingListResult` se renderiza cuando hay datos.
  it("debe mostrar el componente ShoppingListResult si hay una lista generada", async () => {
    const wrapper = mount(ShoppingList);
    expect(wrapper.findComponent({ name: "ShoppingListResult" }).exists()).toBe(
      false
    );

    wrapper.vm.shoppingListData = [{ name: "Arroz" }];
    await nextTick();

    expect(wrapper.findComponent({ name: "ShoppingListResult" }).exists()).toBe(
      true
    );
  });

  // Test 7: La lista se limpia si el usuario confirma la acción.
  it('debe limpiar la lista al hacer clic en el botón de "limpiar" si se confirma', async () => {
    mockRecipesStore.selectedRecipesForShopping = ["1"];
    const mockResult = [{ name: "Leche" }];
    mockShoppingListGenerator.generateShoppingList.mockResolvedValue(
      mockResult
    );

    const wrapper = mount(ShoppingList);
    await nextTick();
    const generateBtn = wrapper.find(".generate-btn");
    await generateBtn.trigger("click");
    await nextTick();

    expect(wrapper.vm.shoppingListData).toEqual(mockResult);

    mockConfirm.mockReturnValue(true); // Simula el clic en Aceptar
    const clearBtn = wrapper.findComponent({ name: "ShoppingListResult" });
    await clearBtn.vm.$emit("clear");
    await nextTick();

    expect(wrapper.vm.shoppingListData).toBeNull();
    expect(mockRecipesStore.selectedRecipesForShopping).toHaveLength(0);
  });

  // Test 8: La lista no se limpia si el usuario cancela la acción.
  it("no debe limpiar la lista si el usuario cancela la acción", async () => {
    mockRecipesStore.selectedRecipesForShopping = ["1"];
    const mockResult = [{ name: "Leche" }];
    mockShoppingListGenerator.generateShoppingList.mockResolvedValue(
      mockResult
    );

    const wrapper = mount(ShoppingList);
    await nextTick();
    const generateBtn = wrapper.find(".generate-btn");
    await generateBtn.trigger("click");
    await nextTick();

    mockConfirm.mockReturnValue(false); // Simula el clic en Cancelar
    const clearBtn = wrapper.findComponent({ name: "ShoppingListResult" });
    await clearBtn.vm.$emit("clear");
    await nextTick();

    expect(wrapper.vm.shoppingListData).toEqual(mockResult);
    expect(mockRecipesStore.selectedRecipesForShopping).toHaveLength(1);
  });
});
