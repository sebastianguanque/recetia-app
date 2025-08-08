// src/components/ui/__tests__/LoadingOverlay.test.js
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoadingOverlay from "../LoadingOverlay.vue";

describe("LoadingOverlay.vue", () => {
  // Esta prueba verifica que el componente se renderiza correctamente
  it("debe renderizar el overlay de carga", () => {
    const wrapper = mount(LoadingOverlay);

    // Verificamos que el componente principal existe
    expect(wrapper.find(".loading-overlay").exists()).toBe(true);

    // Verificamos que el spinner y el texto de carga están presentes
    expect(wrapper.find(".loading-spinner").exists()).toBe(true);
    expect(wrapper.find("p").text()).toBe("Generando con IA...");
    expect(wrapper.find("i.fa-spinner").exists()).toBe(true);
  });

  // Esta prueba verifica los atributos de accesibilidad
  it("debe tener atributos de accesibilidad correctos", () => {
    const wrapper = mount(LoadingOverlay);
    const overlay = wrapper.find(".loading-overlay");

    // Verificamos los atributos de ARIA
    expect(overlay.attributes("role")).toBe("status");
    expect(overlay.attributes("aria-live")).toBe("polite");
    expect(overlay.attributes("aria-label")).toBe("Cargando");
  });
});
