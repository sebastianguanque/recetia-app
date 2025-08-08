// src/components/ui/__test__/RecipeCard.test.js
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RecipeCard from "../RecipeCard.vue";

describe("RecipeCard.vue", () => {
  const mockRecipe = {
    nombre: "Pasta Carbonara",
    tiempo: "30 minutos",
    porciones: "2 personas",
    complejidad: "Media",
    ingredientes: ["Pasta", "Huevo", "Panceta", "Queso Pecorino"],
    instrucciones: ["Paso 1", "Paso 2", "Paso 3"],
    consejos: "Usar pasta fresca para mejor sabor.",
  };

  it("debe renderizar correctamente los datos de la receta", () => {
    const wrapper = mount(RecipeCard, {
      props: {
        recipe: mockRecipe,
        mealType: "almuerzo",
      },
    });

    // Verificamos el título de la receta
    expect(wrapper.find("h3").text()).toContain("Pasta Carbonara");

    // Verificamos el tipo de comida y su icono
    expect(wrapper.find(".recipe-header p").text()).toContain("Almuerzo");
    expect(wrapper.find("h3 i").classes()).toContain("fa-utensils");

    // Verificamos la información de tiempo, porciones y complejidad
    // Buscamos los `div.info-item` y luego sus `span`
    const infoItems = wrapper.findAll(".info-item span");
    expect(infoItems[0].text()).toBe("30 minutos");
    expect(infoItems[1].text()).toBe("2 personas");
    expect(infoItems[2].text()).toBe("Media");

    // Verificamos que se renderice la lista de ingredientes
    const ingredients = wrapper.find(".ingredients-list ul").findAll("li");
    expect(ingredients.length).toBe(mockRecipe.ingredientes.length);
    expect(ingredients[0].text()).toBe("Pasta");

    // Verificamos las instrucciones
    const instructions = wrapper.find(".instructions-list ol").findAll("li");
    expect(instructions.length).toBe(mockRecipe.instrucciones.length);
    expect(instructions[0].text()).toBe("Paso 1");

    // Verificamos que se muestre la sección de consejos
    expect(wrapper.find(".tips-section").exists()).toBe(true);
    expect(wrapper.find(".tips-content p").text()).toBe(mockRecipe.consejos);
  });
});
