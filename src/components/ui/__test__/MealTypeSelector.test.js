// src/components/ui/__tests__/MealTypeSelector.test.js
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MealTypeSelector from "../MealTypeSelector.vue";

describe("MealTypeSelector.vue", () => {
  // Esta prueba verifica que se renderizan los 4 botones
  it("debe renderizar los 4 botones de tipo de comida", () => {
    const wrapper = mount(MealTypeSelector);
    const buttons = wrapper.findAll(".meal-btn");

    expect(buttons.length).toBe(4);
    expect(buttons[0].text()).toContain("Desayuno");
    expect(buttons[1].text()).toContain("Almuerzo");
    expect(buttons[2].text()).toContain("Merienda");
    expect(buttons[3].text()).toContain("Cena");
  });

  // Esta prueba verifica que el botón correcto tiene la clase 'selected'
  it("debe marcar el botón correcto como seleccionado basado en la prop", () => {
    const wrapper = mount(MealTypeSelector, {
      props: {
        modelValue: "almuerzo",
      },
    });

    const selectedButton = wrapper.find(".meal-btn.selected");
    expect(selectedButton.text()).toContain("Almuerzo");
    expect(selectedButton.attributes("data-meal")).toBe("almuerzo");
  });

  // Esta prueba verifica que el evento se emite al hacer clic
  it("debe emitir un evento de actualización al hacer clic en un botón", async () => {
    const wrapper = mount(MealTypeSelector, {
      props: {
        modelValue: "desayuno",
      },
    });

    // Busca el botón de 'Cena'
    const cenaButton = wrapper.find('[data-meal="cena"]');

    // Simula un clic en el botón
    await cenaButton.trigger("click");

    // Verificamos que el evento 'update:modelValue' fue emitido
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();

    // Verificamos que el valor del evento es 'cena'
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe("cena");
  });
});
