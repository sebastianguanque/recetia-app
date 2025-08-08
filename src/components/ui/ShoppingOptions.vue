<template>
  <section class="shopping-options">
    <h3>Opciones de Lista:</h3>
    <div role="group" aria-labelledby="shopping-options-heading">
      <div class="option-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="includeBasics"
            @change="$emit('update:includeBasics', $event.target.checked)"
          />
          <span class="checkmark"></span>
          Incluir ingredientes básicos (sal, aceite, especias)
        </label>
      </div>

      <div class="option-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="groupByCategory"
            @change="$emit('update:groupByCategory', $event.target.checked)"
          />
          <span class="checkmark"></span>
          Agrupar por categorías (carnes, vegetales, etc.)
        </label>
      </div>

      <div class="option-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="excludeInventory"
            @change="$emit('update:excludeInventory', $event.target.checked)"
          />
          <span class="checkmark"></span>
          Excluir ingredientes que ya tengo
        </label>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  includeBasics: {
    type: Boolean,
    default: true,
  },
  groupByCategory: {
    type: Boolean,
    default: true,
  },
  excludeInventory: {
    type: Boolean,
    default: true,
  },
});

defineEmits([
  "update:includeBasics",
  "update:groupByCategory",
  "update:excludeInventory",
]);
</script>

<style scoped>
.shopping-options h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
}

.option-group {
  margin-bottom: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.checkbox-label:hover .checkmark {
  border-color: #667eea;
}
</style>
