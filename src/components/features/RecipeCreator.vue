<template>
  <div class="recipe-creator">
    <header class="section-header">
      <h2><i class="fas fa-magic"></i> Creador de Recetas Inteligente</h2>
      <p>Administra tus ingredientes y genera recetas personalizadas con IA</p>
    </header>

    <IngredientsList />

    <MealTypeSelector
      v-model="recipeGenerator.selectedMealType.value"
      class="meal-type-section"
    />

    <button
      class="generate-btn"
      :disabled="!canGenerateRecipe || appStore.isLoading"
      aria-label="Generar receta"
      @click="handleGenerateRecipe"
    >
      <i class="fas fa-magic"></i>
      {{ appStore.isLoading ? "Generando..." : "Generar Receta" }}
    </button>

    <RecipeCard
      v-if="recipeGenerator.generatedRecipe.value"
      :recipe="recipeGenerator.generatedRecipe.value"
      :meal-type="recipeGenerator.selectedMealType.value"
      class="recipe-result"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import IngredientsList from "@/components/features/IngredientsList.vue";
import MealTypeSelector from "@/components/ui/MealTypeSelector.vue";
import RecipeCard from "@/components/ui/RecipeCard.vue";
import { useRecipeGenerator } from "@/composables/useRecipeGenerator";
import { useIngredientsStore } from "@/stores/ingredients";
import { useAppStore } from "@/stores/app";

const recipeGenerator = useRecipeGenerator();
const ingredientsStore = useIngredientsStore();
const appStore = useAppStore();

const canGenerateRecipe = computed(
  () =>
    ingredientsStore.ingredients.length > 0 &&
    recipeGenerator.selectedMealType.value
);

const handleGenerateRecipe = async () => {
  try {
    await recipeGenerator.generateRecipe();
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
.recipe-creator {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.section-header p {
  color: #666;
  margin-bottom: 0;
  font-size: 1.1rem;
}

.meal-type-section {
  margin: 25px 0;
}

.generate-btn {
  width: 100%;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin: 20px 0;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.generate-btn i {
  margin-right: 10px;
}

.recipe-result {
  margin-top: 30px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
