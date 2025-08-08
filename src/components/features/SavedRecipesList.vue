<template>
  <section class="recipe-selection">
    <header class="section-header">
      <h3>Recetas Guardadas:</h3>
      <button
        class="clear-btn"
        :disabled="recipesStore.savedRecipes.length === 0"
        title="Eliminar todas las recetas guardadas"
        aria-label="Eliminar todas las recetas guardadas"
        @click="handleClearAll"
      >
        <i class="fas fa-trash-alt"></i> Eliminar Todas
      </button>
    </header>

    <ul class="saved-recipes-list">
      <li v-if="recipesStore.savedRecipes.length === 0" class="no-recipes">
        <p>No hay recetas guardadas. Genera algunas recetas primero.</p>
      </li>

      <li
        v-for="recipe in recipesStore.savedRecipes"
        :key="recipe.id"
        :class="['recipe-item', { selected: isSelected(recipe.id) }]"
        :data-recipe-id="recipe.id"
      >
        <div class="recipe-info-compact">
          <div class="recipe-name">{{ recipe.data.nombre }}</div>
          <div class="recipe-meta">
            <i class="fas fa-calendar"></i>
            {{ formatDate(recipe.createdAt) }} • {{ recipe.data.tiempo }} •
            {{ recipe.data.porciones }}
          </div>
        </div>

        <div class="recipe-actions">
          <button
            class="recipe-select-btn"
            :aria-label="
              isSelected(recipe.id)
                ? 'Deseleccionar receta'
                : 'Seleccionar receta'
            "
            @click="recipesStore.toggleRecipeSelection(recipe.id)"
          >
            {{ isSelected(recipe.id) ? "Deseleccionar" : "Seleccionar" }}
          </button>
          <button
            class="recipe-delete-btn"
            title="Eliminar receta"
            :aria-label="`Eliminar receta ${recipe.data.nombre}`"
            @click="handleDeleteRecipe(recipe.id)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useRecipesStore } from "@/stores/recipes";

const recipesStore = useRecipesStore();

const isSelected = (recipeId) => {
  return recipesStore.selectedRecipesForShopping.includes(recipeId);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-ES");
};

const handleDeleteRecipe = (recipeId) => {
  const recipe = recipesStore.savedRecipes.find((r) => r.id === recipeId);
  if (
    confirm(
      `¿Estás seguro de que quieres eliminar la receta "${recipe?.data.nombre}"?`
    )
  ) {
    recipesStore.deleteRecipe(recipeId);
  }
};

const handleClearAll = () => {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar todas las recetas guardadas?"
    )
  ) {
    recipesStore.clearAllRecipes();
  }
};
</script>

<style scoped>
.recipe-selection {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.2rem;
}

.clear-btn {
  padding: 8px 15px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.clear-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.clear-btn i {
  font-size: 0.8rem;
}

.saved-recipes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  list-style: none;
  margin: 0;
}

.no-recipes {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.no-recipes p {
  margin: 0;
}

.recipe-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.recipe-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.recipe-item.selected {
  background: #667eea;
  color: white;
  border-color: #5a6fd8;
}

.recipe-info-compact {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.recipe-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.recipe-meta {
  font-size: 0.85rem;
  opacity: 0.8;
}

.recipe-actions {
  display: flex;
  gap: 8px;
}

.recipe-select-btn {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s ease;
}

.recipe-select-btn:hover {
  background: #5a6fd8;
}

.recipe-item.selected .recipe-select-btn {
  background: rgba(255, 255, 255, 0.2);
}

.recipe-item.selected .recipe-select-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.recipe-delete-btn {
  padding: 6px 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s ease;
}

.recipe-delete-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .recipe-actions {
    flex-direction: column;
    gap: 4px;
  }

  .recipe-select-btn,
  .recipe-delete-btn {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style>
