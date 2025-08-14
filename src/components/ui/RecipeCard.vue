<template>
  <article class="recipe-card">
    <header class="recipe-header">
      <h3>
        <i :class="mealIcon"></i>

        {{ recipe.nombre }}
      </h3>

      <p>
        <strong>Tipo:</strong>
        {{ mealTypeLabel }}
      </p>
      <p v-if="recipe.cookingMethod">
        <strong>Método de cocción:</strong>
        {{ recipe.cookingMethod }}
      </p>
    </header>

    <div class="recipe-info">
      <div class="info-item">
        <i class="fas fa-clock"></i>

        <strong>Tiempo</strong>

        <span>{{ recipe.tiempo }}</span>
      </div>

      <div class="info-item">
        <i class="fas fa-users"></i>

        <strong>Porciones</strong>

        <span>{{ recipe.porciones }}</span>
      </div>

      <div class="info-item">
        <i class="fas fa-chart-line"></i>

        <strong>Complejidad</strong>

        <span>{{ recipe.complejidad }}</span>
      </div>
    </div>

    <section class="ingredients-section">
      <h4><i class="fas fa-list"></i> Ingredientes:</h4>

      <div class="ingredients-list">
        <ul>
          <li v-for="ingredient in recipe.ingredientes" :key="ingredient">
            {{ ingredient }}
          </li>
        </ul>
      </div>
    </section>

    <section class="instructions-section">
      <h4><i class="fas fa-tasks"></i> Instrucciones:</h4>

      <div class="instructions-list">
        <ol>
          <li v-for="instruction in recipe.instrucciones" :key="instruction">
            {{ instruction }}
          </li>
        </ol>
      </div>
    </section>

    <section v-if="recipe.consejos" class="tips-section">
      <h4><i class="fas fa-lightbulb"></i> Consejos:</h4>

      <div class="tips-content">
        <p>{{ recipe.consejos }}</p>
      </div>
    </section>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  recipe: {
    type: Object,

    required: true,
  },

  mealType: {
    type: String,

    required: true,
  },
});

const mealIcons = {
  desayuno: "fas fa-sun",

  almuerzo: "fas fa-utensils",

  merienda: "fas fa-cookie",

  cena: "fas fa-moon",
};

const mealLabels = {
  desayuno: "Desayuno",

  almuerzo: "Almuerzo",

  merienda: "Merienda",

  cena: "Cena",
};

const mealIcon = computed(() => mealIcons[props.mealType] || "fas fa-utensils");

const mealTypeLabel = computed(
  () => mealLabels[props.mealType] || props.mealType
);
</script>

<style scoped>
.recipe-card {
  background: #f8f9fa;

  border-radius: 10px;

  padding: 25px;

  border-left: 5px solid #667eea;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recipe-header h3 {
  color: #333;

  margin-bottom: 15px;

  font-size: 1.4rem;

  display: flex;

  align-items: center;

  gap: 10px;
}

.recipe-header p {
  color: #666;

  margin-bottom: 20px;
}

.recipe-info {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));

  gap: 15px;

  margin: 20px 0;

  padding: 15px;

  background: white;

  border-radius: 8px;
}

.info-item {
  text-align: center;

  padding: 10px;
}

.info-item i {
  font-size: 1.5rem;

  color: #667eea;

  margin-bottom: 8px;

  display: block;
}

.info-item strong {
  display: block;

  color: #333;

  margin-bottom: 5px;

  font-size: 0.9rem;
}

.info-item span {
  color: #666;

  font-size: 0.9rem;
}

.ingredients-section,
.instructions-section,
.tips-section {
  margin: 20px 0;
}

.ingredients-section h4,
.instructions-section h4,
.tips-section h4 {
  color: #667eea;

  margin-bottom: 15px;

  font-size: 1.2rem;

  display: flex;

  align-items: center;

  gap: 8px;
}

.ingredients-list,
.instructions-list,
.tips-content {
  background: white;

  padding: 15px;

  border-radius: 8px;
}

.ingredients-list ul,
.instructions-list ol {
  padding-left: 20px;

  margin: 0;
}

.ingredients-list li,
.instructions-list li {
  margin-bottom: 8px;

  line-height: 1.5;

  color: #333;
}

.tips-content p {
  color: #333;

  line-height: 1.6;

  margin: 0;
}

@media (max-width: 768px) {
  .recipe-info {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .recipe-info {
    grid-template-columns: 1fr;
  }

  .recipe-card {
    padding: 20px;
  }
}
</style>
