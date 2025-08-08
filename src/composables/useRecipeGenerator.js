import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import { useAppStore } from "@/stores/app";
import { useRecipesStore } from "@/stores/recipes";
import { useIngredientsStore } from "@/stores/ingredients";

export function useRecipeGenerator() {
  const apiStore = useApiStore();
  const appStore = useAppStore();
  const recipesStore = useRecipesStore();
  const ingredientsStore = useIngredientsStore();

  const selectedMealType = ref("");
  const generatedRecipe = ref(null);

  const generateRecipe = async () => {
    if (ingredientsStore.ingredients.length === 0) {
      throw new Error(
        "Por favor, agrega ingredientes a tu inventario para generar una receta."
      );
    }

    if (!selectedMealType.value) {
      throw new Error(
        "Por favor, selecciona un tipo de comida antes de generar la receta."
      );
    }

    appStore.setLoading(true);

    try {
      const categorized = ingredientsStore.categorizeIngredients();
      const allIngredients = ingredientsStore.ingredients.join(", ");

      let mealTypeGuidelines = "";
      switch (selectedMealType.value) {
        case "desayuno":
          mealTypeGuidelines =
            "Para el desayuno, genera una receta típica y adecuada para la primera comida del día. Evita explícitamente el uso de carnes pesadas (como pollo, carne de res) o pescados como ingrediente principal, y preparaciones muy elaboradas o que requieran mucho tiempo. Prioriza opciones como cereales, huevos, frutas, o lácteos.";
          break;
        case "merienda":
          mealTypeGuidelines =
            "Para la merienda, debe ser una opción ligera, rápida y energizante para media tarde. Evita platos principales o que requieran cocción compleja.";
          break;
        case "almuerzo":
          mealTypeGuidelines =
            "Para el almuerzo, genera una comida principal y sustanciosa. Debe ser una receta completa que pueda incluir proteínas, carbohidratos y vegetales.";
          break;
        case "cena":
          mealTypeGuidelines =
            "Para la cena, genera una comida balanceada, nutritiva y adecuada para la última comida del día. Puede ser ligeramente más ligera que el almuerzo.";
          break;
      }

      const prompt = `
        Eres un chef experto y nutricionista con un profundo conocimiento de dietas balanceadas y costumbres culinarias de la región del Cono Sur (Argentina, Uruguay, Chile, Paraguay y Brasil). Tu objetivo es combinar la tradición culinaria local con principios nutricionales modernos para crear recetas y consejos que sean saludables, deliciosos y culturalmente apropiados.
        Necesito que generes una única receta para la comida de ${selectedMealType.value}.

        Los ingredientes que tengo disponibles en mi inventario son: ${allIngredients}.
        ${mealTypeGuidelines}

        Para la receta, proporciona:
        - **Nombre del plato**
        - **Lista completa de ingredientes** con cantidades aproximadas (puedes agregar ingredientes básicos como sal, pimienta, aceite, especias, si son necesarios y no están explícitamente en la lista original).
        - **Instrucciones** paso a paso, claras y concisas.
        - **Tiempo** de preparación (ej. "20 minutos").
        - **Porciones** (ej. "1 persona", "2 personas", "6 personas", etc).
        - **Nivel de complejidad** (Fácil/Intermedio/Difícil).
        - **Consejos** adicionales (opcional, uno o varios si aplica).

        Asegúrate de que la receta sea coherente, balanceada, nutritiva y que use los ingredientes de mi inventario de manera inteligente, no es necesario usar todos los ingredientes.
        Si un ingrediente es esencial para el tipo de comida y no está en el inventario, puedes incluirlo pero prioriza el uso de lo que tengo.

        IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional antes o después. No incluyas explicaciones o texto introductorio/final. Usa esta estructura exacta:
        {
            "nombre": "Nombre del plato",
            "ingredientes": ["ingrediente 1 - cantidad", "ingrediente 2 - cantidad"],
            "instrucciones": ["paso 1", "paso 2"],
            "tiempo": "X minutos",
            "porciones": "X personas",
            "complejidad": "Fácil",
            "consejos": "Consejos adicionales (opcional)"
        }
      `;

      const response = await apiStore.callGeminiAPI(prompt);

      // Limpiar la respuesta
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

      const recipe = JSON.parse(cleanResponse);
      recipe.id = Date.now().toString();
      recipe.mealType = selectedMealType.value;

      generatedRecipe.value = recipe;
      recipesStore.saveRecipe(recipe);

      return recipe;
    } catch (error) {
      console.error("Error al generar la receta:", error);
      throw error;
    } finally {
      appStore.setLoading(false);
    }
  };

  return {
    selectedMealType,
    generatedRecipe,
    generateRecipe,
  };
}
