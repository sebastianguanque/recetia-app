<template>
  <section class="inventory-section">
    <header class="section-header">
      <h3>Mis Ingredientes:</h3>
      <button
        class="clear-btn"
        title="Limpiar todos los ingredientes"
        aria-label="Limpiar todos los ingredientes"
        @click="handleClearAll"
        ref="clearBtn"
      >
        <i class="fas fa-trash-alt"></i> Limpiar Todo
      </button>
      <div
        v-if="clearErrorMessage"
        class="error-message"
        aria-live="assertive"
        tabindex="-1"
        ref="clearErrorRef"
      >
        {{ clearErrorMessage }}
      </div>
    </header>

    <form class="input-form" @submit.prevent="handleAddIngredient">
      <div class="input-group">
        <label for="inventoryItem" class="sr-only"> Agregar ingrediente </label>
        <input
          id="inventoryItem"
          v-model="newIngredient"
          type="text"
          placeholder="Ej: tomates, cebolla, pollo, arroz..."
          aria-label="Ingresa un ingrediente"
        />
        <button type="submit" aria-label="Agregar ingrediente" ref="addBtn">
          <i class="fas fa-plus"></i> Agregar
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
      </div>
    </form>

    <ul class="inventory-list" role="list">
      <li v-if="ingredientsStore.ingredients.length === 0" class="empty-state">
        <p>
          No hay ingredientes agregados. Agrega algunos ingredientes que tienes
          disponibles.
        </p>
      </li>

      <li
        v-for="(ingredient, index) in ingredientsStore.ingredients"
        :key="`${ingredient}-${index}`"
        class="inventory-item"
        role="listitem"
      >
        <span class="ingredient-name">{{ ingredient }}</span>
        <button
          class="remove-item"
          :aria-label="`Eliminar ${ingredient}`"
          title="Eliminar ingrediente"
          @click="ingredientsStore.removeIngredient(index)"
        >
          <i class="fas fa-times"></i>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useIngredientsStore } from "@/stores/ingredients";

const ingredientsStore = useIngredientsStore();
const newIngredient = ref("");

const errorMessage = ref("");
const errorRef = ref(null);
const addBtn = ref(null);

const handleAddIngredient = () => {
  if (!newIngredient.value.trim()) {
    errorMessage.value = "Debes ingresar un ingrediente antes de agregar.";
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
    return;
  }
  errorMessage.value = "";
  ingredientsStore.addIngredient(newIngredient.value.trim());
  newIngredient.value = "";
};

const clearErrorMessage = ref("");
const clearErrorRef = ref(null);
const clearBtn = ref(null);

const handleClearAll = () => {
  if (ingredientsStore.ingredients.length === 0) {
    clearErrorMessage.value = "No hay ingredientes para eliminar.";
    nextTick(() => {
      if (clearErrorRef.value) clearErrorRef.value.focus();
    });
    return;
  }
  clearErrorMessage.value = "";
  if (
    confirm("¿Estás seguro de que quieres eliminar todos los ingredientes?")
  ) {
    ingredientsStore.clearAllIngredients();
  }
};
</script>

<style scoped>
.inventory-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
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

.input-form {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  gap: 10px;
}

.input-group input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
}

.input-group button {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.input-group button:hover:not(:disabled) {
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

.inventory-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 50px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
  list-style: none;
  margin: 0;
}

.empty-state {
  width: 100%;
  text-align: center;
  color: #666;
  font-style: italic;
}

.empty-state p {
  margin: 20px 0;
}

.inventory-item {
  background: #667eea;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.inventory-item:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.ingredient-name {
  text-transform: capitalize;
}

.remove-item {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: background 0.3s ease;
}

.remove-item:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .input-group {
    flex-direction: column;
  }
}
</style>
