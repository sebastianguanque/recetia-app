// src/components/features/__test__/ShoppingListResult.integration.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ShoppingListResult from "../ShoppingListResult.vue";
import { nextTick } from "vue";

// ----------------------
// MOCK DATOS
// ----------------------
const groupedProps = {
  shoppingList: {
    resumen: {
      totalItems: 3,
      categorias: 2,
      recetasIncluidas: 1,
    },
    categorias: {
      frutas: {
        nombre: "Frutas",
        icono: "fas fa-apple-alt",
        items: ["Manzana", "Banana"],
      },
      lacteos: {
        nombre: "Lácteos",
        icono: "fas fa-cheese",
        items: ["Leche"],
      },
    },
  },
  groupByCategory: true,
};

const simpleProps = {
  shoppingList: {
    resumen: {
      totalItems: 2,
      categorias: 0,
      recetasIncluidas: 1,
    },
    items: ["Pan", "Manteca"],
  },
  groupByCategory: false,
};

// ----------------------
// MOCK FUNCIONES GLOBALES
// ----------------------
// Mockeamos la alerta globalmente, ya que no interfiere con el montaje del componente
let mockAlert;

// ----------------------
// TESTS DE INTEGRACIÓN
// ----------------------
describe("Integración: ShoppingListResult.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Creamos el mock de alert en beforeEach para asegurar un estado limpio
    mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  // Limpiamos todos los mocks después de cada test para evitar efectos secundarios
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: La lista se renderiza y la interacción con los checkboxes actualiza el estado
  it("debe actualizar el estado de los checkboxes y aplicar la clase 'checked'", async () => {
    const wrapper = mount(ShoppingListResult, {
      props: groupedProps,
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    const itemElement = wrapper.find(".shopping-item");

    // Estado inicial: no debe estar checked
    expect(checkbox.element.checked).toBe(false);
    expect(itemElement.classes()).not.toContain("checked");

    // Click para marcar: debe estar checked y tener la clase
    await checkbox.setValue(true);
    await nextTick();
    expect(checkbox.element.checked).toBe(true);
    expect(itemElement.classes()).toContain("checked");

    // Click para desmarcar: no debe estar checked ni tener la clase
    await checkbox.setValue(false);
    await nextTick();
    expect(checkbox.element.checked).toBe(false);
    expect(itemElement.classes()).not.toContain("checked");
  });

  // Test 2: La función `markAllCompleted` marca todos los ítems
  it("debe marcar todos los ítems al hacer clic en el botón 'Marcar Todo'", async () => {
    const wrapper = mount(ShoppingListResult, {
      props: groupedProps,
    });

    const markAllButton = wrapper.find(".action-btn.success");
    await markAllButton.trigger("click");
    await nextTick();

    const checkedItems = wrapper.findAll(".shopping-item.checked");
    // Hay 3 ítems en total en `groupedProps`
    expect(checkedItems).toHaveLength(3);
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      expect(checkbox.element.checked).toBe(true);
    });
  });

  // Test 3: La función de exportación crea el archivo con el contenido correcto
  it("debe generar un archivo de texto con el formato correcto al exportar", async () => {
    // ----------------------------------------------------
    // Mocks específicos para este test de descarga de archivo
    // ----------------------------------------------------
    const mockCreateObjectURL = vi.fn((blob) => "mock-url");
    const mockRevokeObjectURL = vi.fn();

    // Mockeamos el elemento <a> de manera más robusta
    const mockAnchorElement = {
      href: "",
      download: "",
      click: vi.fn(),
      setAttribute: vi.fn(),
      style: {
        display: "none",
      },
    };

    const originalCreateElement = document.createElement;
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") {
        return mockAnchorElement;
      }
      // Se llama a la función original para cualquier otro elemento.
      return originalCreateElement.call(document, tagName);
    });

    // Mocks para las funciones de manipulación del DOM
    vi.spyOn(document.body, "appendChild").mockImplementation(() => {});
    vi.spyOn(document.body, "removeChild").mockImplementation(() => {});

    // Mock para el objeto global URL
    Object.defineProperty(window, "URL", {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
    });
    // ----------------------------------------------------

    const wrapper = mount(ShoppingListResult, {
      props: groupedProps,
    });

    // Seleccionamos un ítem para verificar el contenido completado y pendiente
    await wrapper.find('input[type="checkbox"]').setValue(true);
    await nextTick();

    const exportButton = wrapper.find(".action-btn.primary");
    await exportButton.trigger("click");

    // Verificamos que se llamó a las funciones del navegador
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockAnchorElement.download).toContain("lista-compras-");
    expect(mockAnchorElement.click).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith(
      "Lista de compras exportada exitosamente"
    );

    // Obtenemos el contenido del blob y lo verificamos
    const blob = mockCreateObjectURL.mock.calls[0][0];

    // Usamos un FileReader para leer el contenido del Blob, ya que .text() no es una función en el mock.
    const exportText = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(blob);
    });

    const expectedText = `=== LISTA DE COMPRAS ===

Generada el: ${new Date().toLocaleDateString()}
Total de productos: 3
Productos completados: 1

PRODUCTOS PENDIENTES:

FRUTAS:
☐ Banana

LÁCTEOS:
☐ Leche

PRODUCTOS COMPLETADOS:

FRUTAS:
☑ Manzana
`;
    expect(exportText).toEqual(expectedText);
  });

  // Test 4: El botón de limpiar emite el evento 'clear'
  it("debe emitir el evento 'clear' al hacer clic en el botón de limpiar", async () => {
    const wrapper = mount(ShoppingListResult, {
      props: simpleProps,
    });

    const clearButton = wrapper.find(".action-btn.secondary");
    await clearButton.trigger("click");

    expect(wrapper.emitted("clear")).toBeTruthy();
  });
});
