<template>
  <main class="main-app">
    <AppTabs />
    
    <section 
      v-show="appStore.currentTab === 'recipe-creator'" 
      class="tab-content"
      role="tabpanel"
      aria-labelledby="recipe-creator-tab"
    >
      <RecipeCreator />
    </section>

    <section 
      v-show="appStore.currentTab === 'shopping-list'" 
      class="tab-content"
      role="tabpanel"
      aria-labelledby="shopping-list-tab"
    >
      <ShoppingList />
    </section>
  </main>
</template>

<script setup>
import AppTabs from '@/components/navigation/AppTabs.vue'
import RecipeCreator from '@/components/features/RecipeCreator.vue'
import ShoppingList from '@/components/features/ShoppingList.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style scoped>
.main-app {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.tab-content {
  padding: 30px;
}

@media (max-width: 768px) {
  .tab-content {
    padding: 20px;
  }
}
</style>
