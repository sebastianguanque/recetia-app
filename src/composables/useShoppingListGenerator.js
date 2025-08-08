import { useApiStore } from "@/stores/api";
import { useAppStore } from "@/stores/app";
import { useRecipesStore } from "@/stores/recipes";
import { useIngredientsStore } from "@/stores/ingredients";

export function useShoppingListGenerator() {
  const apiStore = useApiStore();
  const appStore = useAppStore();
  const recipesStore = useRecipesStore();
  const ingredientsStore = useIngredientsStore();

  const generateShoppingList = async (options) => {
    if (recipesStore.selectedRecipesForShopping.length === 0) {
      throw new Error(
        "Por favor selecciona al menos una receta para generar la lista de compras"
      );
    }

    appStore.setLoading(true);

    try {
      // Get selected recipes
      const selectedRecipes = recipesStore.savedRecipes.filter((recipe) =>
        recipesStore.selectedRecipesForShopping.includes(recipe.id)
      );

      // Extract all ingredients from selected recipes
      let allIngredients = [];
      selectedRecipes.forEach((recipe) => {
        if (recipe.data.ingredientes) {
          allIngredients = allIngredients.concat(recipe.data.ingredientes);
        }
      });

      const prompt = `
        Eres un asistente experto en compras de supermercado. Necesito que generes una lista de compras inteligente basada en los siguientes ingredientes de recetas:

        INGREDIENTES DE LAS RECETAS:
        ${allIngredients.map((ing, index) => `${index + 1}. ${ing}`).join("\n")}

        ${options.excludeInventory ? `\nMIS INGREDIENTES ACTUALES (excluir estos ingredientes):\n${ingredientsStore.ingredients.map((item) => `- ${item}`).join("\n")}` : ""}

        INSTRUCCIONES:
        1. Analiza todos los ingredientes y crea una lista de compras optimizada
        2. Combina ingredientes similares (ej: si aparece "tomate - 2 unidades" y "tomate - 1 unidad", combinar como "tomate - 3 unidades")
        3. ${options.excludeInventory ? "Excluye los ingredientes que ya tengo disponibles" : "Incluye todos los ingredientes"}
        4. ${options.includeBasics ? "Incluye ingredientes básicos comunes (sal, pimienta, aceite) si no están listados" : "No agregues ingredientes básicos adicionales"}
        5. ${options.groupByCategory ? "Agrupa los ingredientes por categorías de supermercado" : "Lista todos los ingredientes juntos"}
        6. Optimiza las cantidades para evitar desperdicios
        7. Sugiere alternativas o marcas cuando sea apropiado

        IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional. Usa esta estructura:
        ${
          options.groupByCategory
            ? `{
          "resumen": {
              "totalItems": 0,
              "categorias": 0,
              "recetasIncluidas": ${selectedRecipes.length}
          },
          "categorias": {
              "carnes_pescados": {
                  "nombre": "Carnes y Pescados",
                  "icono": "fas fa-drumstick-bite",
                  "items": ["item - cantidad"]
              },
              "vegetales_frutas": {
                  "nombre": "Vegetales y Frutas",
                  "icono": "fas fa-apple-alt",
                  "items": ["item - cantidad"]
              },
              "lacteos_huevos": {
                  "nombre": "Lácteos y Huevos",
                  "icono": "fas fa-cheese",
                  "items": ["item - cantidad"]
              },
              "cereales_granos": {
                  "nombre": "Cereales y Granos",
                  "icono": "fas fa-seedling",
                  "items": ["item - cantidad"]
              },
              "condimentos_especias": {
                  "nombre": "Condimentos y Especias",
                  "icono": "fas fa-pepper-hot",
                  "items": ["item - cantidad"]
              },
              "otros": {
                  "nombre": "Otros",
                  "icono": "fas fa-shopping-basket",
                  "items": ["item - cantidad"]
              }
          }
      }`
            : `{
          "resumen": {
              "totalItems": 0,
              "recetasIncluidas": ${selectedRecipes.length}
          },
          "items": ["item - cantidad", "item - cantidad"]
      }`
        }
      `;

      const response = await apiStore.callGeminiAPI(prompt);

      // Clean response
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith("```json")) {
        cleanResponse = cleanResponse
          .replace(/```json\n?/, "")
          .replace(/\n?```$/, "");
      }
      if (cleanResponse.startsWith("```")) {
        cleanResponse = cleanResponse
          .replace(/```\n?/, "")
          .replace(/\n?```$/, "");
      }

      const shoppingList = JSON.parse(cleanResponse);
      return shoppingList;
    } catch (error) {
      console.error("Error al generar la lista de compras:", error);
      throw error;
    } finally {
      appStore.setLoading(false);
    }
  };

  return {
    generateShoppingList,
  };
}
