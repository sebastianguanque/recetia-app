// src/components/features/__tests__/IngredientsList.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import IngredientsList from "../IngredientsList.vue";

// Mock del store de Pinia
const mockStore = {
  ingredients: ["tomate", "cebolla"],
  addIngredient: vi.fn(), // Usamos vi.fn() para crear una función mock
  removeIngredient: vi.fn(),
  clearAllIngredients: vi.fn(),
};

// Mock de la función `useIngredientsStore` para que devuelva nuestro mockStore
vi.mock("@/stores/ingredients", () => ({
  useIngredientsStore: () => mockStore,
}));

describe("IngredientsList.vue", () => {
  // Configuración de Pinia para la prueba
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Test 1: Verificación del estado inicial sin ingredientes
  it("debe mostrar el estado vacío si no hay ingredientes", () => {
    // Simulamos un store vacío para esta prueba
    mockStore.ingredients = [];
    const wrapper = mount(IngredientsList);

    // Verificamos que el mensaje de "estado vacío" esté presente
    expect(wrapper.find(".empty-state").exists()).toBe(true);
    expect(wrapper.find(".empty-state p").text()).toContain(
      "No hay ingredientes agregados."
    );
  });

  // Test 2: Verificación de la lista de ingredientes
  it("debe renderizar la lista de ingredientes si el store tiene datos", async () => {
    // Simulamos un store con ingredientes
    mockStore.ingredients = ["tomate", "cebolla"];
    const wrapper = mount(IngredientsList);

    // Verificamos que el estado vacío NO esté presente
    expect(wrapper.find(".empty-state").exists()).toBe(false);

    // Verificamos que los ingredientes se rendericen como elementos de la lista
    const items = wrapper.findAll(".inventory-item");
    expect(items.length).toBe(2);
    expect(items[0].text()).toContain("tomate");
    expect(items[1].text()).toContain("cebolla");
  });

  // Test 3: Verificación de la adición de un ingrediente
  it("debe llamar a la acción de agregar ingrediente cuando se envía el formulario", async () => {
    // Volvemos a un store vacío para la prueba
    mockStore.ingredients = [];
    const wrapper = mount(IngredientsList);

    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    // Limpiamos el mock de la función para esta prueba
    mockStore.addIngredient.mockClear();

    // Simulamos la entrada de texto y el envío del formulario
    await input.setValue("zanahoria");
    await form.trigger("submit");

    // Verificamos que la función addIngredient del store fue llamada con el valor correcto
    expect(mockStore.addIngredient).toHaveBeenCalledWith("zanahoria");

    // Verificamos que el input se ha limpiado después de enviar
    expect(input.element.value).toBe("");
  });

  // Test 4: Verificación de la eliminación de un ingrediente
  it("debe llamar a la acción de remover un ingrediente al hacer clic en el botón", async () => {
    mockStore.ingredients = ["tomate", "cebolla"];
    const wrapper = mount(IngredientsList);

    const removeButton = wrapper.findAll(".remove-item")[0]; // El botón para 'tomate'
    mockStore.removeIngredient.mockClear();

    await removeButton.trigger("click");

    // Verificamos que la función removeIngredient del store fue llamada con el índice correcto
    expect(mockStore.removeIngredient).toHaveBeenCalledWith(0);
  });

  // Test 5: Verificación del botón de limpiar todo
  it("debe llamar a la acción de limpiar todos los ingredientes si el usuario confirma", async () => {
    mockStore.ingredients = ["tomate", "cebolla"];
    const wrapper = mount(IngredientsList);

    // Mockeamos la función global `confirm`
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const clearButton = wrapper.find(".clear-btn");
    mockStore.clearAllIngredients.mockClear();

    await clearButton.trigger("click");

    // Verificamos que la función del store se llamó
    expect(mockStore.clearAllIngredients).toHaveBeenCalled();
  });

  // Test 6: Verificación del botón de limpiar todo (cancelar)
  it("NO debe llamar a la acción de limpiar si el usuario cancela", async () => {
    mockStore.ingredients = ["tomate", "cebolla"];
    const wrapper = mount(IngredientsList);

    // Mockeamos la función `confirm` para que devuelva `false`
    vi.spyOn(window, "confirm").mockReturnValue(false);

    const clearButton = wrapper.find(".clear-btn");
    mockStore.clearAllIngredients.mockClear();

    await clearButton.trigger("click");

    // Verificamos que la función del store NO se llamó
    expect(mockStore.clearAllIngredients).not.toHaveBeenCalled();
  });
});
