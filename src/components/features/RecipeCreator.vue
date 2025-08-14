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
      aria-label="Generar receta"
      @click="handleGenerateRecipe"
      :disabled="appStore.isLoading"
      ref="generateBtn"
    >
      <i class="fas fa-magic"></i>
      {{ appStore.isLoading ? "Generando..." : "Generar Receta" }}
    </button>
    <div
      v-if="errorMessage"
      class="error-message"
      aria-live="assertive"
      tabindex="-1"
      ref="errorRef"
    >
      {{ errorMessage }}
    </div>

    <RecipeCard
      v-if="recipeGenerator.generatedRecipe.value"
      :recipe="recipeGenerator.generatedRecipe.value"
      :meal-type="recipeGenerator.selectedMealType.value"
      class="recipe-result"
    />
    <button
      v-if="recipeGenerator.generatedRecipe.value"
      class="save-btn"
      @click="handleSaveRecipe"
      style="margin-top: 16px"
    >
      <i class="fas fa-save"></i>
      Guardar Receta
    </button>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from "vue";
import IngredientsList from "@/components/features/IngredientsList.vue";
import MealTypeSelector from "@/components/ui/MealTypeSelector.vue";
import RecipeCard from "@/components/ui/RecipeCard.vue";
import { useRecipeGenerator } from "@/composables/useRecipeGenerator";
import { useIngredientsStore } from "@/stores/ingredients";
import { useAppStore } from "@/stores/app";
import { useApiStore } from "@/stores/api";

const recipeGenerator = useRecipeGenerator();
const ingredientsStore = useIngredientsStore();
const appStore = useAppStore();
const apiStore = useApiStore();

const canGenerateRecipe = computed(
  () =>
    ingredientsStore.ingredients.length > 0 &&
    recipeGenerator.selectedMealType.value &&
    apiStore.hasApiKey
);

const errorMessage = ref("");
const errorRef = ref(null);
const generateBtn = ref(null);

const handleGenerateRecipe = async () => {
  if (appStore.isLoading) return;
  if (!apiStore.hasApiKey) {
    errorMessage.value =
      "Debes ingresar una API Key válida antes de generar una receta.";
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
    return;
  }
  if (ingredientsStore.ingredients.length === 0) {
    errorMessage.value =
      "Agrega al menos un ingrediente antes de generar una receta.";
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
    return;
  }
  if (!recipeGenerator.selectedMealType.value) {
    errorMessage.value =
      "Selecciona un tipo de comida antes de generar la receta.";
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
    return;
  }
  errorMessage.value = "";
  try {
    await recipeGenerator.generateRecipe();
  } catch (error) {
    errorMessage.value = error.message;
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
  }
};

import { useRecipesStore } from "@/stores/recipes";
const recipesStore = useRecipesStore();

const handleSaveRecipe = () => {
  const receta = recipeGenerator.generatedRecipe.value;
  if (!receta) return;
  recipesStore.saveRecipe(receta);
  alert("Receta guardada correctamente.");
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

.save-btn {
  width: 100%;
  padding: 12px 30px;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 10px;
  margin-top: 0;
  transition: transform 0.3s ease;
}
.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.save-btn i {
  margin-right: 10px;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.error-message {
  color: #dc3545;
  background: #fff3f3;
  border: 1px solid #dc3545;
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 1rem;
  outline: none;
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
