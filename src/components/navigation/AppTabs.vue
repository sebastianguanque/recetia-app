<template>
  <nav class="tabs" role="tablist">
    <ul class="tabs-list">
      <li class="tab">
        <button
          id="recipe-creator-tab"
          :class="[
            'tab-button',
            { active: appStore.currentTab === 'recipe-creator' },
          ]"
          role="tab"
          :aria-selected="appStore.currentTab === 'recipe-creator'"
          aria-controls="recipe-creator"
          @click="appStore.switchTab('recipe-creator')"
        >
          <i class="fas fa-magic"></i> Creador de Recetas
        </button>
      </li>
      <li class="tab">
        <button
          id="shopping-list-tab"
          :class="[
            'tab-button',
            { active: appStore.currentTab === 'shopping-list' },
          ]"
          role="tab"
          :aria-selected="appStore.currentTab === 'shopping-list'"
          aria-controls="shopping-list"
          @click="appStore.switchTab('shopping-list')"
        >
          <i class="fas fa-shopping-cart"></i> Lista de Compras
        </button>
      </li>
      <li class="tab">
        <button
          class="tab-button"
          role="button"
          aria-label="Configuración de la aplicación"
          @click="showSettings"
        >
          <i class="fas fa-cog"></i> Configuración
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useApiStore } from "@/stores/api";

const appStore = useAppStore();
const apiStore = useApiStore();

const showSettings = () => {
  const newKey = prompt("Ingresa nueva API Key de Gemini:", apiStore.apiKey);
  if (newKey && newKey.trim()) {
    apiStore.setApiKey(newKey.trim());
    alert("API Key actualizada correctamente");
  }
};
</script>

<style scoped>
.tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.tabs-list {
  display: flex;
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tab {
  display: flex;
  flex: 1;
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: #e9ecef;
  color: #333;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: white;
}

.tab-button i {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .tabs-list {
    flex-direction: column;
  }
}
</style>
