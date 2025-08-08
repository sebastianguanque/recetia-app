<template>
  <article class="api-setup">
    <div class="api-card">
      <h2><i class="fas fa-key"></i> Configuración de API</h2>
      <p>Para usar la aplicación, necesitas una API Key de Google Gemini</p>
      
      <form @submit.prevent="handleSubmit" class="setup-form">
        <div class="input-group">
          <label for="apiKeyInput" class="sr-only">
            Ingresa tu API Key de Gemini
          </label>
          <input
            id="apiKeyInput"
            v-model="apiKeyInput"
            type="password"
            placeholder="Ingresa tu API Key de Gemini"
            aria-label="Ingresa tu API Key de Gemini"
            required
          />
          <button type="submit" :disabled="!apiKeyInput.trim()">
            Guardar
          </button>
        </div>
      </form>
      
      <small>
        <a href="https://makersuite.google.com/app/apikey" target="_blank">
          <i class="fas fa-external-link-alt"></i> Obtener API Key gratuita
        </a>
      </small>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '@/stores/api'

const router = useRouter()
const apiStore = useApiStore()

const apiKeyInput = ref('')

const handleSubmit = () => {
  const key = apiKeyInput.value.trim()
  
  if (!key) {
    alert('Por favor ingresa una API Key válida')
    return
  }

  apiStore.setApiKey(key)
  router.push('/')
}
</script>

<style scoped>
.api-setup {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.api-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.api-card h2 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.api-card p {
  margin-bottom: 20px;
  color: #666;
}

.setup-form {
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

.input-group button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

small {
  color: #666;
  margin-top: 15px;
  display: block;
}

small a {
  color: #667eea;
  text-decoration: none;
}

small a:hover {
  text-decoration: underline;
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
  .api-card {
    padding: 30px 20px;
    margin: 20px;
  }

  .input-group {
    flex-direction: column;
  }
}
</style>
