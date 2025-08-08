<template>
  <div class="app">
    <AppHeader />
    
    <main class="container">
      <router-view />
    </main>
    
    <AppFooter />
    
    <LoadingOverlay v-if="appStore.isLoading" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  appStore.initializeApp()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  width: 90%;
  padding: 20px;
  flex: 1;
}
</style>
