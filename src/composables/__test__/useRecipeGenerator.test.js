import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRecipeGenerator } from "@/composables/useRecipeGenerator";
import { useApiStore } from "@/stores/api";
import { useAppStore } from "@/stores/app";
import { useRecipesStore } from "@/stores/recipes";
import { useIngredientsStore } from "@/stores/ingredients";

// Mocks globales
vi.mock("@/stores/api");
vi.mock("@/stores/app");
vi.mock("@/stores/recipes");
vi.mock("@/stores/ingredients");

describe("useRecipeGenerator", () => {
  let apiStoreMock, appStoreMock, recipesStoreMock, ingredientsStoreMock;

  beforeEach(() => {
    // Resetea los mocks antes de cada test
    apiStoreMock = {
      callGeminiAPI: vi.fn(),
    };
    appStoreMock = {
      setLoading: vi.fn(),
      isLoading: false,
    };
    recipesStoreMock = {
      saveRecipe: vi.fn(),
    };
    ingredientsStoreMock = {
      ingredients: [],
      categorizeIngredients: vi.fn(() => ({})),
    };

    // Asigna los mocks
    useApiStore.mockReturnValue(apiStoreMock);
    useAppStore.mockReturnValue(appStoreMock);
    useRecipesStore.mockReturnValue(recipesStoreMock);
    useIngredientsStore.mockReturnValue(ingredientsStoreMock);
  });

  it("lanza error si no hay ingredientes", async () => {
    const { generateRecipe } = useRecipeGenerator();

    await expect(generateRecipe()).rejects.toThrow(
      "Por favor, agrega ingredientes a tu inventario para generar una receta."
    );
  });

  it("lanza error si no se seleccionó tipo de comida", async () => {
    ingredientsStoreMock.ingredients = ["huevo"];

    const { generateRecipe } = useRecipeGenerator();

    await expect(generateRecipe()).rejects.toThrow(
      "Por favor, selecciona un tipo de comida antes de generar la receta."
    );
  });

  it("llama a la API y guarda la receta correctamente", async () => {
    ingredientsStoreMock.ingredients = ["huevo", "pan"];
    const mockResponse = `{
      "nombre": "Tostada con Huevo",
      "ingredientes": ["pan - 2 rebanadas", "huevo - 1 unidad"],
      "instrucciones": ["Tostar el pan", "Freír el huevo", "Servir juntos"],
      "tiempo": "10 minutos",
      "porciones": "1 persona",
      "complejidad": "Fácil",
      "consejos": "Usa pan integral para más fibra"
    }`;
    apiStoreMock.callGeminiAPI.mockResolvedValue(mockResponse);

    const { generateRecipe, selectedMealType, generatedRecipe } =
      useRecipeGenerator();

    selectedMealType.value = "desayuno";

    const recipe = await generateRecipe();

    expect(appStoreMock.setLoading).toHaveBeenCalledWith(true);
    expect(apiStoreMock.callGeminiAPI).toHaveBeenCalled();
    expect(recipe.nombre).toBe("Tostada con Huevo");
    expect(recipe.mealType).toBe("desayuno");
    expect(recipe.id).toBeDefined();
    expect(generatedRecipe.value).toEqual(recipe);
    expect(recipesStoreMock.saveRecipe).toHaveBeenCalledWith(recipe);
    expect(appStoreMock.setLoading).toHaveBeenCalledWith(false);
  });

  it("limpia respuesta con triple backtick json", async () => {
    ingredientsStoreMock.ingredients = ["leche", "banana"];
    const mockResponse =
      '```json\n{ "nombre": "Smoothie", "ingredientes": [], "instrucciones": [], "tiempo": "", "porciones": "", "complejidad": "", "consejos": "" }\n```';
    apiStoreMock.callGeminiAPI.mockResolvedValue(mockResponse);

    const { generateRecipe, selectedMealType } = useRecipeGenerator();
    selectedMealType.value = "merienda";

    const recipe = await generateRecipe();

    expect(recipe.nombre).toBe("Smoothie");
  });

  it("llama a setLoading en error", async () => {
    ingredientsStoreMock.ingredients = ["tomate"];
    apiStoreMock.callGeminiAPI.mockRejectedValue(new Error("API falló"));

    const { generateRecipe, selectedMealType } = useRecipeGenerator();
    selectedMealType.value = "cena";

    await expect(generateRecipe()).rejects.toThrow("API falló");

    expect(appStoreMock.setLoading).toHaveBeenCalledWith(true);
    expect(appStoreMock.setLoading).toHaveBeenCalledWith(false);
  });
});
