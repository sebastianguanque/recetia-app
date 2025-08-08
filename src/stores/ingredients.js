import { defineStore } from "pinia";
import { ref } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const useIngredientsStore = defineStore("ingredients", () => {
  const { getItem, setItem } = useLocalStorage();

  const ingredients = ref(getItem("inventory_items", []));

  const addIngredient = (ingredient) => {
    const normalizedIngredient = ingredient.toLowerCase().trim();
    if (
      normalizedIngredient &&
      !ingredients.value.includes(normalizedIngredient)
    ) {
      ingredients.value.push(normalizedIngredient);
      setItem("inventory_items", ingredients.value);
    }
  };

  const removeIngredient = (index) => {
    ingredients.value.splice(index, 1);
    setItem("inventory_items", ingredients.value);
  };

  const clearAllIngredients = () => {
    ingredients.value = [];
    setItem("inventory_items", ingredients.value);
  };

  const categorizeIngredients = () => {
    const categories = {
      meats: [
        "pollo",
        "carne",
        "pescado",
        "cerdo",
        "ternera",
        "atun",
        "salmón",
      ],
      vegetables: [
        "verduras",
        "brócoli",
        "zanahoria",
        "espinaca",
        "tomate",
        "cebolla",
        "pimiento",
        "lechuga",
        "calabacín",
      ],
      carbs: [
        "arroz",
        "pasta",
        "pan",
        "patata",
        "patatas",
        "quinoa",
        "batata",
        "harina",
        "tortillas",
      ],
      dairy: ["leche", "queso", "yogurt", "manteca", "crema"],
      eggs: ["huevos", "huevo"],
      fruits: [
        "manzana",
        "plátano",
        "naranja",
        "frutas",
        "fresa",
        "uvas",
        "kiwi",
        "arándanos",
      ],
      cereals: ["avena", "cereales", "granola"],
      legumes: ["lentejas", "garbanzos", "frijoles", "judías"],
      fats: ["aceite", "aguacate", "nueces", "almendras", "aceitunas"],
    };

    const categorized = {
      meats: [],
      vegetables: [],
      carbs: [],
      dairy: [],
      eggs: [],
      fruits: [],
      cereals: [],
      legumes: [],
      fats: [],
      others: [],
    };

    ingredients.value.forEach((ingredient) => {
      let categorized_flag = false;
      for (const [category, items] of Object.entries(categories)) {
        if (items.includes(ingredient.toLowerCase())) {
          categorized[category].push(ingredient);
          categorized_flag = true;
          break;
        }
      }
      if (!categorized_flag) {
        categorized.others.push(ingredient);
      }
    });

    return categorized;
  };

  return {
    ingredients,
    addIngredient,
    removeIngredient,
    clearAllIngredients,
    categorizeIngredients,
  };
});
