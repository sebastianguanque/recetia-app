<template>
  <section class="meal-type-section">
    <h3>Tipo de comida:</h3>

    <div class="meal-buttons" role="group" aria-label="Tipo de comida">
      <button
        v-for="meal in mealTypes"
        :key="meal.value"
        :class="['meal-btn', { selected: modelValue === meal.value }]"
        :data-meal="meal.value"
        role="radio"
        :aria-checked="modelValue === meal.value"
        @click="selectMeal(meal.value)"
      >
        <i :class="meal.icon"></i>

        {{ meal.label }}
      </button>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,

    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const mealTypes = [
  { value: "desayuno", label: "Desayuno", icon: "fas fa-sun" },

  { value: "almuerzo", label: "Almuerzo", icon: "fas fa-utensils" },

  { value: "merienda", label: "Merienda", icon: "fas fa-cookie" },

  { value: "cena", label: "Cena", icon: "fas fa-moon" },
];

const selectMeal = (mealType) => {
  emit("update:modelValue", mealType);
};
</script>

<style scoped>
.meal-type-section h3 {
  margin-bottom: 15px;

  color: #333;

  font-size: 1.2rem;
}

.meal-buttons {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));

  gap: 15px;
}

.meal-btn {
  padding: 15px 20px;

  border: 2px solid #e9ecef;

  background: white;

  border-radius: 10px;

  cursor: pointer;

  transition: all 0.3s ease;

  font-size: 1rem;

  color: #666;

  text-align: center;
}

.meal-btn:hover {
  border-color: #667eea;

  color: #667eea;

  transform: translateY(-2px);
}

.meal-btn.selected {
  background: #667eea;

  color: white;

  border-color: #667eea;
}

.meal-btn i {
  display: block;

  font-size: 1.5rem;

  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .meal-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .meal-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
