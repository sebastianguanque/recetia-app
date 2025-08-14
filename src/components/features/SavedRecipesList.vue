<template>
  <section class="recipe-selection">
    <header class="section-header">
      <h3>Recetas Guardadas:</h3>
      <button
        class="clear-btn"
        title="Eliminar todas las recetas guardadas"
        aria-label="Eliminar todas las recetas guardadas"
        @click="handleClearAll"
        ref="clearBtn"
      >
        <i class="fas fa-trash-alt"></i> Eliminar Todas
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
    </header>

    <ul class="saved-recipes-list">
      <li v-if="recipesStore.savedRecipes.length === 0" class="no-recipes">
        <i class="fas fa-book-dead no-recipes-icon"></i>
        <p>No hay recetas guardadas.<br />Genera algunas recetas primero.</p>
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
          <button
            class="recipe-view-btn"
            title="Ver receta"
            :aria-label="`Ver receta ${recipe.data.nombre}`"
            @click="handleViewRecipe(recipe)"
          >
            <i class="fas fa-eye"></i> Ver
          </button>
        </div>
      </li>
    </ul>
    <transition name="modal-fade">
      <div
        v-if="showModal"
        class="modal-overlay blur-bg"
        @click.self="closeModal"
        tabindex="-1"
      >
        <div class="modal-content" ref="modalContent">
          <button class="close-modal-btn" @click="closeModal" ref="closeBtn">
            Cerrar
          </button>
          <RecipeCard :recipe="selectedRecipe.data" />
          <div class="copy-actions">
            <button class="copy-btn" @click="copyIngredients">
              <i class="fas fa-copy"></i> Copiar ingredientes
            </button>
            <button class="copy-btn" @click="copyInstructions">
              <i class="fas fa-copy"></i> Copiar instrucciones
            </button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRecipesStore } from "@/stores/recipes";
import RecipeCard from "@/components/ui/RecipeCard.vue";

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

const errorMessage = ref("");
const errorRef = ref(null);
const handleClearAll = () => {
  if (recipesStore.savedRecipes.length === 0) {
    errorMessage.value = "No hay recetas guardadas para eliminar.";
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
    return;
  }
  errorMessage.value = "";
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar todas las recetas guardadas?"
    )
  ) {
    recipesStore.clearAllRecipes();
  }
};

const showModal = ref(false);
const selectedRecipe = ref(null);
const modalContent = ref(null);
const closeBtn = ref(null);

const handleViewRecipe = (recipe) => {
  selectedRecipe.value = recipe;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedRecipe.value = null;
};

const copyIngredients = () => {
  if (!selectedRecipe.value) return;
  const ingredients =
    selectedRecipe.value.data.ingredientes
      ?.map((ing) =>
        ing.nombre
          ? `${ing.cantidad || ""} ${ing.unidad || ""} ${ing.nombre}`.trim()
          : ing
      )
      .join("\n") || "";
  navigator.clipboard.writeText(ingredients);
  alert("Ingredientes copiados al portapapeles.");
};

const copyInstructions = () => {
  if (!selectedRecipe.value) return;
  const instructions =
    selectedRecipe.value.data.instrucciones?.join("\n") || "";
  navigator.clipboard.writeText(instructions);
  alert("Instrucciones copiadas al portapapeles.");
};

const handleKeyDown = (e) => {
  if (showModal.value && e.key === "Escape") {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
});

watch(showModal, (val) => {
  if (val && closeBtn.value) closeBtn.value.focus();
});
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
  padding: 28px 10px 18px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.no-recipes-icon {
  font-size: 3.2rem;
  color: #e9ecef;
  margin-bottom: 8px;
}

.no-recipes p {
  margin: 0;
  font-size: 1.1rem;
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

.recipe-view-btn {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.08);
}
.recipe-view-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: auto;
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  padding: 36px 32px 28px 32px;
  box-shadow: 0 12px 40px rgba(40, 40, 40, 0.18);
  max-width: 540px;
  width: 95vw;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: modal-pop 0.25s;
}
.close-modal-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.08);
}
.close-modal-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}
.close-modal-btn:focus {
  outline: 2px solid #667eea;
}
@keyframes modal-pop {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@media (max-width: 768px) {
  .modal-content {
    max-width: 98vw;
    padding: 18px 8px 12px 8px;
    max-height: 98vh;
  }
  .close-modal-btn {
    top: 8px;
    right: 8px;
    padding: 6px 10px;
    font-size: 0.9rem;
  }
  .recipe-view-btn {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
  .copy-actions {
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
    align-items: stretch;
  }
  .recipe-item {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 8px;
  }
  .recipe-info-compact {
    margin-bottom: 10px;
  }
  .recipe-actions {
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }
  .recipe-select-btn,
  .recipe-delete-btn,
  .recipe-view-btn {
    width: 100%;
    font-size: 0.95rem;
    padding: 8px 0;
  }
}
@media (max-width: 500px) {
  .recipe-actions {
    flex-direction: column;
    gap: 6px;
    width: 100%;
    justify-content: stretch;
    align-items: stretch;
  }
  .recipe-select-btn,
  .recipe-delete-btn,
  .recipe-view-btn {
    width: 100%;
    padding: 10px 0;
    font-size: 1rem;
  }
}
@media (max-width: 400px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .clear-btn {
    width: 100%;
    margin-top: 8px;
    font-size: 1rem;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.blur-bg {
  backdrop-filter: blur(4px);
}
.copy-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  justify-content: flex-end;
}
.copy-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}
.copy-btn:hover {
  background: #5a6fd8;
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
</style>
