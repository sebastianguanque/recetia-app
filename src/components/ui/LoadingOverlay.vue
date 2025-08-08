<template>
  <div 
    class="loading-overlay"
    role="status"
    aria-live="polite"
    aria-label="Cargando"
  >
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Generando con IA...</p>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.loading-spinner i {
  font-size: 3rem;
  margin-bottom: 20px;
  display: block;
}

.loading-spinner p {
  font-size: 1.2rem;
}
</style>
