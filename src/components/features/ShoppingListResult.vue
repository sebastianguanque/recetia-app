<template>
  <div class="shopping-list-result">
    <div class="shopping-summary">
      <h3><i class="fas fa-chart-pie"></i> Resumen de tu Lista de Compras</h3>
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-number">{{ shoppingList.resumen.totalItems }}</span>
          <div class="stat-label">Productos totales</div>
        </div>
        <div v-if="groupByCategory" class="stat-item">
          <span class="stat-number">{{ shoppingList.resumen.categorias }}</span>
          <div class="stat-label">Categorías</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{
            shoppingList.resumen.recetasIncluidas
          }}</span>
          <div class="stat-label">Recetas incluidas</div>
        </div>
      </div>
    </div>

    <div class="shopping-list-card">
      <h3>
        <i class="fas fa-list-alt"></i> Lista de Compras{{
          groupByCategory ? " por Categorías" : ""
        }}
      </h3>

      <!-- Grouped by categories -->
      <div v-if="groupByCategory && shoppingList.categorias">
        <div
          v-for="[key, categoria] in Object.entries(shoppingList.categorias)"
          :key="key"
          class="shopping-category"
        >
          <h4 v-if="categoria.items && categoria.items.length > 0">
            <i :class="categoria.icono"></i> {{ categoria.nombre }}
          </h4>
          <div
            v-if="categoria.items && categoria.items.length > 0"
            class="shopping-items"
          >
            <div
              v-for="(item, index) in categoria.items"
              :key="`${key}-${index}`"
              :class="[
                'shopping-item',
                { checked: checkedItems.has(`${key}-${index}`) },
              ]"
              :data-item="`${key}-${index}`"
            >
              <input
                type="checkbox"
                class="shopping-checkbox"
                :checked="checkedItems.has(`${key}-${index}`)"
                @change="toggleItem(`${key}-${index}`)"
              />
              <span class="shopping-item-text">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Simple list -->
      <div v-else-if="shoppingList.items" class="shopping-category">
        <div class="shopping-items">
          <div
            v-for="(item, index) in shoppingList.items"
            :key="`item-${index}`"
            :class="[
              'shopping-item',
              { checked: checkedItems.has(`item-${index}`) },
            ]"
            :data-item="`item-${index}`"
          >
            <input
              type="checkbox"
              class="shopping-checkbox"
              :checked="checkedItems.has(`item-${index}`)"
              @change="toggleItem(`item-${index}`)"
            />
            <span class="shopping-item-text">{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="shopping-actions">
        <button class="action-btn primary" @click="exportShoppingList">
          <i class="fas fa-download"></i> Descargar Lista
        </button>
        <button class="action-btn secondary" @click="$emit('clear')">
          <i class="fas fa-trash"></i> Limpiar Lista
        </button>
        <button class="action-btn success" @click="markAllCompleted">
          <i class="fas fa-check-double"></i> Marcar Todo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  shoppingList: {
    type: Object,
    required: true,
  },
  groupByCategory: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["clear"]);

const checkedItems = ref(new Set());

const toggleItem = (itemId) => {
  if (checkedItems.value.has(itemId)) {
    checkedItems.value.delete(itemId);
  } else {
    checkedItems.value.add(itemId);
  }
};

const markAllCompleted = () => {
  const allItems = getAllItemIds();
  allItems.forEach((itemId) => checkedItems.value.add(itemId));
};

const getAllItemIds = () => {
  const items = [];

  if (props.groupByCategory && props.shoppingList.categorias) {
    Object.entries(props.shoppingList.categorias).forEach(
      ([key, categoria]) => {
        if (categoria.items) {
          categoria.items.forEach((_, index) => {
            items.push(`${key}-${index}`);
          });
        }
      }
    );
  } else if (props.shoppingList.items) {
    props.shoppingList.items.forEach((_, index) => {
      items.push(`item-${index}`);
    });
  }

  return items;
};

const exportShoppingList = () => {
  let exportText = "=== LISTA DE COMPRAS ===\n\n";
  exportText += `Generada el: ${new Date().toLocaleDateString()}\n`;
  exportText += `Total de productos: ${props.shoppingList.resumen.totalItems}\n`;
  exportText += `Productos completados: ${checkedItems.value.size}\n\n`;

  exportText += "PRODUCTOS PENDIENTES:\n";

  if (props.groupByCategory && props.shoppingList.categorias) {
    Object.entries(props.shoppingList.categorias).forEach(
      ([key, categoria]) => {
        if (categoria.items && categoria.items.length > 0) {
          exportText += `\n${categoria.nombre.toUpperCase()}:\n`;
          categoria.items.forEach((item, index) => {
            const itemId = `${key}-${index}`;
            if (!checkedItems.value.has(itemId)) {
              exportText += `☐ ${item}\n`;
            }
          });
        }
      }
    );
  } else if (props.shoppingList.items) {
    props.shoppingList.items.forEach((item, index) => {
      const itemId = `item-${index}`;
      if (!checkedItems.value.has(itemId)) {
        exportText += `☐ ${item}\n`;
      }
    });
  }

  if (checkedItems.value.size > 0) {
    exportText += "\nPRODUCTOS COMPLETADOS:\n";

    if (props.groupByCategory && props.shoppingList.categorias) {
      Object.entries(props.shoppingList.categorias).forEach(
        ([key, categoria]) => {
          if (categoria.items && categoria.items.length > 0) {
            const completedInCategory = categoria.items.filter((_, index) =>
              checkedItems.value.has(`${key}-${index}`)
            );

            if (completedInCategory.length > 0) {
              exportText += `\n${categoria.nombre.toUpperCase()}:\n`;
              categoria.items.forEach((item, index) => {
                const itemId = `${key}-${index}`;
                if (checkedItems.value.has(itemId)) {
                  exportText += `☑ ${item}\n`;
                }
              });
            }
          }
        }
      );
    } else if (props.shoppingList.items) {
      props.shoppingList.items.forEach((item, index) => {
        const itemId = `item-${index}`;
        if (checkedItems.value.has(itemId)) {
          exportText += `☑ ${item}\n`;
        }
      });
    }
  }

  // Create and download file
  const blob = new Blob([exportText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lista-compras-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert("Lista de compras exportada exitosamente");
};
</script>

<style scoped>
.shopping-list-result {
  margin-top: 20px;
}

.shopping-summary {
  background: #e8f5e8;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.shopping-summary h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745;
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
}

.shopping-list-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #28a745;
}

.shopping-list-card > h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.shopping-category {
  margin-bottom: 25px;
}

.shopping-category h4 {
  color: #28a745;
  margin-bottom: 15px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.shopping-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
}

.shopping-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.shopping-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.shopping-item.checked {
  background: #d4edda;
  border-color: #c3e6cb;
  text-decoration: line-through;
  opacity: 0.7;
}

.shopping-checkbox {
  margin-right: 12px;
  cursor: pointer;
}

.shopping-item-text {
  flex: 1;
  font-size: 0.95rem;
}

.shopping-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a6fd8;
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
}

.action-btn.secondary:hover {
  background: #5a6268;
}

.action-btn.success {
  background: #28a745;
  color: white;
}

.action-btn.success:hover {
  background: #218838;
}

@media (max-width: 768px) {
  .shopping-items {
    grid-template-columns: 1fr;
  }

  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .shopping-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
