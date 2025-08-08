// src/components/features/__tests__/IngredientsList.integration.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import IngredientsList from "../IngredientsList.vue";
import { useIngredientsStore } from "@/stores/ingredients";
import { nextTick } from "vue";

// Mock de la función global `confirm` para evitar que Vitest falle
vi.spyOn(window, "confirm").mockReturnValue(true);

describe("Integración: IngredientsList.vue", () => {
  let ingredientsStore;

  // Configuración de Pinia para la prueba de integración
  beforeEach(() => {
    setActivePinia(createPinia());
    // Obtenemos una instancia real del store
    ingredientsStore = useIngredientsStore();
    // Limpiamos el store antes de cada prueba
    ingredientsStore.clearAllIngredients();
  });

  it("debe mostrar el estado vacío y el botón de limpiar deshabilitado cuando el store está vacío", async () => {
    // Montamos el componente sin preconfigurar el store
    const wrapper = mount(IngredientsList);
    await nextTick();

    // Verificamos que el mensaje de "estado vacío" esté presente
    expect(wrapper.find(".empty-state").exists()).toBe(true);
    expect(wrapper.find(".empty-state p").text()).toContain(
      "No hay ingredientes agregados."
    );

    // Verificamos que el botón de 'Limpiar Todo' esté deshabilitado
    const clearButton = wrapper.find(".clear-btn");
    expect(clearButton.element.disabled).toBe(true);
  });

  it("debe agregar un ingrediente al store cuando se envía el formulario", async () => {
    const wrapper = mount(IngredientsList);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");
    const addButton = wrapper.find('form button[type="submit"]');

    // Verificamos que el botón de agregar esté deshabilitado inicialmente
    expect(addButton.element.disabled).toBe(true);

    // Simulamos la entrada de texto
    await input.setValue("zanahoria");
    await nextTick();

    // Verificamos que el botón se habilite
    expect(addButton.element.disabled).toBe(false);

    // Simulamos el envío del formulario
    await form.trigger("submit");
    await nextTick();

    // Verificamos que el input se haya limpiado
    expect(input.element.value).toBe("");

    // Verificamos que la lista en el DOM se haya actualizado
    const items = wrapper.findAll(".inventory-item");
    expect(items.length).toBe(1);
    expect(items[0].text()).toContain("zanahoria");

    // Verificamos que el store real se haya actualizado
    expect(ingredientsStore.ingredients).toEqual(["zanahoria"]);
  });

  it("debe eliminar un ingrediente del store cuando se hace clic en el botón de eliminar", async () => {
    // Añadimos un ingrediente directamente al store
    ingredientsStore.addIngredient("lechuga");
    const wrapper = mount(IngredientsList);
    await nextTick();

    // Verificamos que el botón de limpiar NO esté deshabilitado
    const clearButton = wrapper.find(".clear-btn");
    expect(clearButton.element.disabled).toBe(false);

    // Buscamos el botón de eliminar del ingrediente 'lechuga'
    const removeButton = wrapper.find(".remove-item");
    expect(removeButton.exists()).toBe(true);

    // Simulamos el clic
    await removeButton.trigger("click");
    await nextTick();

    // Verificamos que la lista en el DOM se haya actualizado (ingrediente eliminado)
    expect(wrapper.find(".inventory-item").exists()).toBe(false);

    // Verificamos que el store real se haya actualizado
    expect(ingredientsStore.ingredients).toEqual([]);

    // Verificamos que el botón de limpiar se deshabilite de nuevo
    expect(clearButton.element.disabled).toBe(true);
  });

  it("debe limpiar todos los ingredientes del store si se confirma la acción", async () => {
    // Añadimos ingredientes al store
    ingredientsStore.addIngredient("tomate");
    ingredientsStore.addIngredient("cebolla");
    const wrapper = mount(IngredientsList);
    await nextTick();

    // Verificamos que haya 2 elementos en la lista
    expect(wrapper.findAll(".inventory-item").length).toBe(2);

    // Simulamos el clic en el botón de 'Limpiar Todo'
    const clearButton = wrapper.find(".clear-btn");
    await clearButton.trigger("click");
    await nextTick();

    // Verificamos que el store real esté vacío
    expect(ingredientsStore.ingredients).toEqual([]);

    // Verificamos que el DOM muestre el estado vacío
    expect(wrapper.find(".empty-state").exists()).toBe(true);
  });

  it("NO debe limpiar los ingredientes si el usuario cancela la acción", async () => {
    // Cambiamos el mock de `window.confirm` para que devuelva `false`
    vi.spyOn(window, "confirm").mockReturnValue(false);

    // Añadimos ingredientes al store
    ingredientsStore.addIngredient("tomate");
    const wrapper = mount(IngredientsList);
    await nextTick();

    // Simulamos el clic en el botón de 'Limpiar Todo'
    const clearButton = wrapper.find(".clear-btn");
    await clearButton.trigger("click");
    await nextTick();

    // Verificamos que el store real AÚN contenga el ingrediente
    expect(ingredientsStore.ingredients).toEqual(["tomate"]);
  });
});
