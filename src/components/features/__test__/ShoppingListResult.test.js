import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ShoppingListResult from "../ShoppingListResult.vue";

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

describe("ShoppingListResult.vue", () => {
  it("renderiza el resumen correctamente", () => {
    const wrapper = mount(ShoppingListResult, {
      props: groupedProps,
    });

    expect(wrapper.text()).toContain("Productos totales");
    expect(wrapper.text()).toContain("3");
    expect(wrapper.text()).toContain("Categorías");
    expect(wrapper.text()).toContain("2");
    expect(wrapper.text()).toContain("Recetas incluidas");
    expect(wrapper.text()).toContain("1");
  });

  it("renderiza ítems agrupados por categoría", () => {
    const wrapper = mount(ShoppingListResult, {
      props: groupedProps,
    });

    expect(wrapper.findAll(".shopping-category").length).toBe(2);
    expect(wrapper.text()).toContain("Frutas");
    expect(wrapper.text()).toContain("Manzana");
    expect(wrapper.text()).toContain("Banana");
    expect(wrapper.text()).toContain("Lácteos");
    expect(wrapper.text()).toContain("Leche");
  });

  it("renderiza ítems como lista simple", () => {
    const wrapper = mount(ShoppingListResult, {
      props: simpleProps,
    });

    expect(wrapper.findAll(".shopping-item").length).toBe(2);
    expect(wrapper.text()).toContain("Pan");
    expect(wrapper.text()).toContain("Manteca");
  });

  it("marca un ítem al hacer clic en el checkbox", async () => {
    const wrapper = mount(ShoppingListResult, {
      props: groupedProps,
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);

    await checkbox.setValue(true);

    const checkedItem = wrapper.find(".shopping-item.checked");
    expect(checkedItem.exists()).toBe(true);
  });

  it('emite evento "clear" al hacer clic en el botón Limpiar Lista', async () => {
    const wrapper = mount(ShoppingListResult, {
      props: simpleProps,
    });

    const clearButton = wrapper.find(".action-btn.secondary");
    await clearButton.trigger("click");

    expect(wrapper.emitted("clear")).toBeTruthy();
  });

  it('marca todos los ítems al hacer clic en "Marcar Todo"', async () => {
    const wrapper = mount(ShoppingListResult, {
      props: groupedProps,
    });

    const button = wrapper.find(".action-btn.success");
    await button.trigger("click");

    const checkedItems = wrapper.findAll(".shopping-item.checked");
    expect(checkedItems.length).toBe(3);
  });
});
