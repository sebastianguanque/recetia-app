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
        :disabled="!canGenerateList || appStore.isLoading"
        aria-label="Generar lista de compras"
        @click="handleGenerateShoppingList"
      >
        <i class="fas fa-list-alt"></i>
        {{ appStore.isLoading ? "Generando..." : "Generar Lista de Compras" }}
      </button>
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
import { ref, computed } from "vue";
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

const handleGenerateShoppingList = async () => {
  try {
    const result = await shoppingListGenerator.generateShoppingList(
      shoppingOptions.value
    );
    shoppingListData.value = result;
  } catch (error) {
    alert(error.message);
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

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.generate-btn i {
  margin-right: 10px;
}
</style>
