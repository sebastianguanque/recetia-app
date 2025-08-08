// src/components/ShoppingOptions/__tests__/ShoppingOptions.test.js
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ShoppingOptions from "../ShoppingOptions.vue";

describe("ShoppingOptions.vue", () => {
  // Una prueba para verificar que el componente se renderiza correctamente
  it("debe renderizar todos los checkboxes con sus etiquetas", () => {
    const wrapper = mount(ShoppingOptions);

    const labels = wrapper.findAll(".checkbox-label");
    expect(labels.length).toBe(3);
    expect(labels[0].text()).toContain("Incluir ingredientes básicos");
    expect(labels[1].text()).toContain("Agrupar por categorías");
    expect(labels[2].text()).toContain("Excluir ingredientes que ya tengo");
  });

  // Una prueba para verificar que el evento "update:includeBasics" se emite correctamente
  it('debe emitir el evento "update:includeBasics" al cambiar el primer checkbox', async () => {
    const wrapper = mount(ShoppingOptions, {
      props: {
        includeBasics: false,
      },
    });

    // Encuentra el input del primer checkbox
    const checkbox = wrapper.find('input[type="checkbox"]');

    // Simula un cambio en el checkbox
    await checkbox.setValue(true);

    // Verifica que el evento se emitió
    expect(wrapper.emitted()).toHaveProperty("update:includeBasics");

    // Verifica que el valor del evento es correcto
    const emittedEvent = wrapper.emitted("update:includeBasics");
    expect(emittedEvent[0][0]).toBe(true);
  });

  // Una prueba para el segundo checkbox
  it('debe emitir el evento "update:groupByCategory" al cambiar el segundo checkbox', async () => {
    const wrapper = mount(ShoppingOptions, {
      props: {
        groupByCategory: true,
      },
    });

    const checkbox = wrapper.findAll('input[type="checkbox"]')[1];

    await checkbox.setValue(false);

    expect(wrapper.emitted()).toHaveProperty("update:groupByCategory");
    expect(wrapper.emitted("update:groupByCategory")[0][0]).toBe(false);
  });

  // Una prueba para el tercer checkbox
  it('debe emitir el evento "update:excludeInventory" al cambiar el tercer checkbox', async () => {
    const wrapper = mount(ShoppingOptions, {
      props: {
        excludeInventory: true,
      },
    });

    const checkbox = wrapper.findAll('input[type="checkbox"]')[2];

    await checkbox.setValue(false);

    expect(wrapper.emitted()).toHaveProperty("update:excludeInventory");
    expect(wrapper.emitted("update:excludeInventory")[0][0]).toBe(false);
  });
});
