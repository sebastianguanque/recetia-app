// src/composables/__tests__/useShoppingListGenerator.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useShoppingListGenerator } from "@/composables/useShoppingListGenerator";
import { useApiStore } from "@/stores/api";
import { useAppStore } from "@/stores/app";
import { useRecipesStore } from "@/stores/recipes";
import { useIngredientsStore } from "@/stores/ingredients";
import { ref } from "vue";

// Mocks globales de las stores
vi.mock("@/stores/api");
vi.mock("@/stores/app");
vi.mock("@/stores/recipes");
vi.mock("@/stores/ingredients");

describe("useShoppingListGenerator", () => {
  let apiStoreMock, appStoreMock, recipesStoreMock, ingredientsStoreMock;

  // Mock de datos para las recetas
  const mockSavedRecipes = [
    {
      id: "1",
      data: { ingredientes: ["tomate - 2 unidades", "cebolla - 1 unidad"] },
    },
    {
      id: "2",
      data: { ingredientes: ["lechuga - 1 unidad", "tomate - 1 unidad"] },
    },
    { id: "3", data: { ingredientes: ["pan - 1 unidad", "jamón - 100g"] } },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    apiStoreMock = {
      callGeminiAPI: vi.fn(),
    };
    appStoreMock = {
      setLoading: vi.fn(),
    };
    recipesStoreMock = {
      savedRecipes: mockSavedRecipes,
      selectedRecipesForShopping: [],
    };
    ingredientsStoreMock = {
      ingredients: [],
    };

    useApiStore.mockReturnValue(apiStoreMock);
    useAppStore.mockReturnValue(appStoreMock);
    useRecipesStore.mockReturnValue(recipesStoreMock);
    useIngredientsStore.mockReturnValue(ingredientsStoreMock);
  });

  // Test 1: Lanza un error si no se selecciona ninguna receta
  it("debe lanzar un error si no hay recetas seleccionadas", async () => {
    const { generateShoppingList } = useShoppingListGenerator();

    await expect(
      generateShoppingList({
        excludeInventory: false,
        includeBasics: false,
        groupByCategory: false,
      })
    ).rejects.toThrow(
      "Por favor selecciona al menos una receta para generar la lista de compras"
    );
  });

  // Test 2: Generación exitosa sin opciones
  it("debe generar la lista de compras correctamente sin opciones", async () => {
    recipesStoreMock.selectedRecipesForShopping = ["1", "2"];
    const mockApiResponse = `{
      "resumen": { "totalItems": 3, "recetasIncluidas": 2 },
      "items": ["tomate - 3 unidades", "cebolla - 1 unidad", "lechuga - 1 unidad"]
    }`;
    apiStoreMock.callGeminiAPI.mockResolvedValue(mockApiResponse);

    const { generateShoppingList } = useShoppingListGenerator();
    const result = await generateShoppingList({
      excludeInventory: false,
      includeBasics: false,
      groupByCategory: false,
    });

    expect(appStoreMock.setLoading).toHaveBeenCalledWith(true);
    expect(apiStoreMock.callGeminiAPI).toHaveBeenCalled();
    expect(result.resumen.recetasIncluidas).toBe(2);
    expect(result.items).toEqual(
      expect.arrayContaining([
        "tomate - 3 unidades",
        "cebolla - 1 unidad",
        "lechuga - 1 unidad",
      ])
    );
    expect(appStoreMock.setLoading).toHaveBeenCalledWith(false);
  });

  // Test 3: Generación con agrupamiento y exclusión de inventario
  it("debe generar la lista de compras agrupada por categoría y excluyendo el inventario", async () => {
    recipesStoreMock.selectedRecipesForShopping = ["1", "2", "3"];
    ingredientsStoreMock.ingredients = ["tomate - 1 unidad", "pan - 1 unidad"];
    const mockApiResponse = `{
      "resumen": { "totalItems": 4, "categorias": 3, "recetasIncluidas": 3 },
      "categorias": {
        "vegetales_frutas": {
          "nombre": "Vegetales y Frutas",
          "items": ["tomate - 2 unidades", "cebolla - 1 unidad", "lechuga - 1 unidad"]
        },
        "carnes_pescados": {
          "nombre": "Carnes y Pescados",
          "items": ["jamón - 100g"]
        },
        "otros": {
          "nombre": "Otros",
          "items": ["sal", "pimienta"]
        }
      }
    }`;
    apiStoreMock.callGeminiAPI.mockResolvedValue(mockApiResponse);

    const { generateShoppingList } = useShoppingListGenerator();
    const result = await generateShoppingList({
      excludeInventory: true,
      includeBasics: true,
      groupByCategory: true,
    });

    expect(appStoreMock.setLoading).toHaveBeenCalledWith(true);
    const expectedPromptPart = `\nMIS INGREDIENTES ACTUALES (excluir estos ingredientes):\n- tomate - 1 unidad\n- pan - 1 unidad`;
    expect(apiStoreMock.callGeminiAPI).toHaveBeenCalledWith(
      expect.stringContaining(expectedPromptPart)
    );
    expect(result.resumen.categorias).toBe(3);
    expect(result.categorias.vegetales_frutas.items).toEqual(
      expect.arrayContaining([
        "tomate - 2 unidades",
        "cebolla - 1 unidad",
        "lechuga - 1 unidad",
      ])
    );
    expect(appStoreMock.setLoading).toHaveBeenCalledWith(false);
  });

  // Test 4: Maneja el error de la API correctamente
  it("debe manejar errores de la API y restablecer el estado de carga", async () => {
    recipesStoreMock.selectedRecipesForShopping = ["1"];
    const apiError = new Error("API Falló");
    apiStoreMock.callGeminiAPI.mockRejectedValue(apiError);

    const { generateShoppingList } = useShoppingListGenerator();

    await expect(
      generateShoppingList({
        excludeInventory: false,
        includeBasics: false,
        groupByCategory: false,
      })
    ).rejects.toThrow("API Falló");

    expect(appStoreMock.setLoading).toHaveBeenCalledWith(true);
    expect(appStoreMock.setLoading).toHaveBeenCalledWith(false);
  });

  // Test 5: Maneja respuestas con formato JSON incorrecto
  it("debe manejar respuestas con formato JSON incorrecto", async () => {
    recipesStoreMock.selectedRecipesForShopping = ["1"];
    const mockApiResponse = `{"resumen": {"recetasIncluidas": 1}, "items": ["tomate"`;
    apiStoreMock.callGeminiAPI.mockResolvedValue(mockApiResponse);

    const { generateShoppingList } = useShoppingListGenerator();

    await expect(
      generateShoppingList({
        excludeInventory: false,
        includeBasics: false,
        groupByCategory: false,
      })
    ).rejects.toThrow(SyntaxError);

    expect(appStoreMock.setLoading).toHaveBeenCalledWith(true);
    expect(appStoreMock.setLoading).toHaveBeenCalledWith(false);
  });
});
