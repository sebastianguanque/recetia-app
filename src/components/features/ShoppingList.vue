<template>
  <div class="shopping-list">
    <header class="section-header">
      <h2><i class="fas fa-shopping-cart"></i> Lista de Compras Inteligente</h2>
      <p>
        Genera automáticamente tu lista de compras basada en las recetas y tus
        ingredientes actuales
      </p>
    </header>

    <div class="shopping-controls">
      <SavedRecipesList />

      <ShoppingOptions
        v-model:include-basics="shoppingOptions.includeBasics"
        v-model:group-by-category="shoppingOptions.groupByCategory"
        v-model:exclude-inventory="shoppingOptions.excludeInventory"
      />

      <button
        class="generate-btn"
        aria-label="Generar lista de compras"
        @click="handleGenerateShoppingList"
        :disabled="appStore.isLoading"
        ref="generateBtn"
      >
        <i class="fas fa-list-alt"></i>
        {{ appStore.isLoading ? "Generando..." : "Generar Lista de Compras" }}
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

    <ShoppingListResult
      v-if="shoppingListData"
      :shopping-list="shoppingListData"
      :group-by-category="shoppingOptions.groupByCategory"
      @clear="clearShoppingList"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import SavedRecipesList from "@/components/features/SavedRecipesList.vue";
import ShoppingOptions from "@/components/ui/ShoppingOptions.vue";
import ShoppingListResult from "@/components/features/ShoppingListResult.vue";
import { useShoppingListGenerator } from "@/composables/useShoppingListGenerator";
import { useRecipesStore } from "@/stores/recipes";
import { useAppStore } from "@/stores/app";

const recipesStore = useRecipesStore();
const appStore = useAppStore();
const shoppingListGenerator = useShoppingListGenerator();

const shoppingOptions = ref({
  includeBasics: true,
  groupByCategory: true,
  excludeInventory: true,
});

const shoppingListData = ref(null);

const canGenerateList = computed(
  () => recipesStore.selectedRecipesForShopping.length > 0
);

const errorMessage = ref("");
const errorRef = ref(null);
const generateBtn = ref(null);

const handleGenerateShoppingList = async () => {
  if (appStore.isLoading) return;
  if (recipesStore.selectedRecipesForShopping.length === 0) {
    errorMessage.value =
      "Selecciona al menos una receta antes de generar la lista de compras.";
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
    return;
  }
  errorMessage.value = "";
  try {
    const result = await shoppingListGenerator.generateShoppingList(
      shoppingOptions.value
    );
    shoppingListData.value = result;
  } catch (error) {
    errorMessage.value = error.message;
    nextTick(() => {
      if (errorRef.value) errorRef.value.focus();
    });
  }
};

const clearShoppingList = () => {
  if (confirm("¿Estás seguro de que quieres limpiar la lista de compras?")) {
    shoppingListData.value = null;
    recipesStore.selectedRecipesForShopping.length = 0;
  }
};
</script>

<style scoped>
.shopping-list {
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

.shopping-controls {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 25px;
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
</style>
