// src/components/features/__tests__/ShoppingList.integration.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import ShoppingList from "../ShoppingList.vue";

// Importamos los stores y composables reales para la integración
import { useRecipesStore } from "@/stores/recipes";
import { useAppStore } from "@/stores/app";
import { useShoppingListGenerator } from "@/composables/useShoppingListGenerator";

// ----------------------
// MOCK FUNCIONES GLOBALES Y COMPONENTES
// ----------------------
// Mockeamos `alert` y `confirm` para evitar diálogos en las pruebas.
const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
const mockConfirm = vi.spyOn(window, "confirm");

// Mockeamos los componentes hijos para aislar el DOM que vamos a testear
// del resto de la aplicación.
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
    // Usamos un template que emite el evento 'clear' para simular el clic del usuario
    template:
      "<button class='mock-clear-btn' @click=\"$emit('clear')\">Clear</button>",
  },
}));

// ----------------------
// MOCK DEL COMPOSABLE CON FETCH (para evitar llamadas de red reales)
// ----------------------
// Como el composable `useShoppingListGenerator` realiza un `fetch`,
// lo mockeamos para controlar su comportamiento en las pruebas.
const mockShoppingListGenerator = {
  generateShoppingList: vi.fn(),
};

vi.mock("@/composables/useShoppingListGenerator", () => ({
  useShoppingListGenerator: () => mockShoppingListGenerator,
}));

// ----------------------
// TESTS DE INTEGRACIÓN
// ----------------------
describe("Integración: ShoppingList.vue", () => {
  let recipesStore;
  let appStore;

  // Configuración de Pinia y stores reales antes de cada test
  beforeEach(() => {
    setActivePinia(createPinia());
    recipesStore = useRecipesStore();
    appStore = useAppStore();

    // Limpiamos los stores para que cada test sea independiente
    recipesStore.selectedRecipesForShopping = [];
    appStore.isLoading = false;

    // Limpiamos los mocks
    mockAlert.mockClear();
    mockConfirm.mockClear();
    mockShoppingListGenerator.generateShoppingList.mockClear();
  });

  // Test 1: El botón de generar está deshabilitado si no hay recetas seleccionadas
  it("debe deshabilitar el botón de generar si no hay recetas seleccionadas", () => {
    // El estado inicial del store está vacío
    const wrapper = mount(ShoppingList);
    const generateBtn = wrapper.find(".generate-btn");
    expect(generateBtn.element.disabled).toBe(true);
  });

  // Test 2: El botón de generar se habilita con recetas seleccionadas
  it("debe habilitar el botón de generar cuando hay recetas seleccionadas", async () => {
    const wrapper = mount(ShoppingList);

    // Simulamos la selección de recetas en el store
    recipesStore.selectedRecipesForShopping = ["receta-1", "receta-2"];
    await nextTick();

    const generateBtn = wrapper.find(".generate-btn");
    expect(generateBtn.element.disabled).toBe(false);
  });

  // Test 3: Se genera la lista y se muestra el componente de resultado
  it("debe generar la lista y mostrar el resultado al hacer clic en el botón", async () => {
    const mockShoppingListData = [{ name: "Leche" }];

    // Mockeamos la respuesta del composable
    mockShoppingListGenerator.generateShoppingList.mockResolvedValue(
      mockShoppingListData
    );
    recipesStore.selectedRecipesForShopping = ["receta-1"];

    const wrapper = mount(ShoppingList);
    await nextTick();

    // El componente de resultado no debe estar visible inicialmente
    expect(wrapper.findComponent({ name: "ShoppingListResult" }).exists()).toBe(
      false
    );

    const generateBtn = wrapper.find(".generate-btn");
    await generateBtn.trigger("click");
    await nextTick();

    // Verificamos que se llamó a la función del composable
    expect(mockShoppingListGenerator.generateShoppingList).toHaveBeenCalled();

    // Verificamos que el componente de resultado ahora es visible
    const resultComponent = wrapper.findComponent({
      name: "ShoppingListResult",
    });
    expect(resultComponent.exists()).toBe(true);
    // Verificamos que la prop `shoppingList` se pasa correctamente
    expect(resultComponent.props("shoppingList")).toEqual(mockShoppingListData);
  });

  // Test 4: El botón de generar muestra el estado de carga
  it("debe mostrar el estado de carga en el botón cuando el store está cargando", async () => {
    const wrapper = mount(ShoppingList);

    recipesStore.selectedRecipesForShopping = ["receta-1"];
    appStore.isLoading = true;
    await nextTick();

    const generateBtn = wrapper.find(".generate-btn");
    expect(generateBtn.element.disabled).toBe(true);
    expect(generateBtn.text()).toContain("Generando...");
  });

  // Test 5: La lista se limpia al confirmar la acción
  it("debe limpiar la lista de compras y las recetas seleccionadas si se confirma la acción", async () => {
    const mockShoppingListData = [{ name: "Arroz" }];

    mockShoppingListGenerator.generateShoppingList.mockResolvedValue(
      mockShoppingListData
    );
    recipesStore.selectedRecipesForShopping = ["receta-1"];

    const wrapper = mount(ShoppingList);
    await nextTick();
    await wrapper.find(".generate-btn").trigger("click");
    await nextTick();

    // Verificamos que la lista se ha generado
    expect(wrapper.vm.shoppingListData).toEqual(mockShoppingListData);
    expect(recipesStore.selectedRecipesForShopping).toHaveLength(1);

    // Mockeamos la confirmación del usuario
    mockConfirm.mockReturnValue(true);

    // Simulamos la emisión del evento 'clear' desde el componente hijo
    await wrapper
      .findComponent({ name: "ShoppingListResult" })
      .vm.$emit("clear");
    await nextTick();

    // Verificamos que la lista de compras y las recetas seleccionadas se han reseteado
    expect(wrapper.vm.shoppingListData).toBeNull();
    expect(recipesStore.selectedRecipesForShopping).toHaveLength(0);
  });

  // Test 6: La lista no se limpia si el usuario cancela la acción
  it("no debe limpiar la lista si el usuario cancela la acción", async () => {
    const mockShoppingListData = [{ name: "Arroz" }];

    mockShoppingListGenerator.generateShoppingList.mockResolvedValue(
      mockShoppingListData
    );
    recipesStore.selectedRecipesForShopping = ["receta-1"];

    const wrapper = mount(ShoppingList);
    await nextTick();
    await wrapper.find(".generate-btn").trigger("click");
    await nextTick();

    expect(wrapper.vm.shoppingListData).toEqual(mockShoppingListData);

    // Mockeamos la cancelación del usuario
    mockConfirm.mockReturnValue(false);

    await wrapper
      .findComponent({ name: "ShoppingListResult" })
      .vm.$emit("clear");
    await nextTick();

    // Verificamos que la lista y las recetas seleccionadas permanecen intactas
    expect(wrapper.vm.shoppingListData).toEqual(mockShoppingListData);
    expect(recipesStore.selectedRecipesForShopping).toHaveLength(1);
  });
});
