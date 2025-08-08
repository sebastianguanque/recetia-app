import { defineStore } from "pinia";
import { ref } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const useRecipesStore = defineStore("recipes", () => {
  const { getItem, setItem } = useLocalStorage();

  const savedRecipes = ref(getItem("saved_recipes", []));
  const selectedRecipesForShopping = ref([]);

  const saveRecipe = (recipe, type = "individual") => {
    const recipeData = {
      id: Date.now(),
      type,
      data: recipe,
      createdAt: new Date().toISOString(),
    };

    savedRecipes.value.push(recipeData);
    setItem("saved_recipes", savedRecipes.value);
  };

  const deleteRecipe = (recipeId) => {
    savedRecipes.value = savedRecipes.value.filter(
      (recipe) => recipe.id !== recipeId
    );
    selectedRecipesForShopping.value = selectedRecipesForShopping.value.filter(
      (id) => id !== recipeId
    );
    setItem("saved_recipes", savedRecipes.value);
  };

  const clearAllRecipes = () => {
    savedRecipes.value = [];
    selectedRecipesForShopping.value = [];
    setItem("saved_recipes", savedRecipes.value);
  };

  const toggleRecipeSelection = (recipeId) => {
    const index = selectedRecipesForShopping.value.indexOf(recipeId);
    if (index > -1) {
      selectedRecipesForShopping.value.splice(index, 1);
    } else {
      selectedRecipesForShopping.value.push(recipeId);
    }
  };

  return {
    savedRecipes,
    selectedRecipesForShopping,
    saveRecipe,
    deleteRecipe,
    clearAllRecipes,
    toggleRecipeSelection,
  };
});
