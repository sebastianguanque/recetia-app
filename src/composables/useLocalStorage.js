import { ref, watch } from "vue";

export function useLocalStorage() {
  const getItem = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  const useStoredRef = (key, defaultValue = null) => {
    const storedValue = getItem(key, defaultValue);
    const refValue = ref(storedValue);

    watch(
      refValue,
      (newValue) => {
        setItem(key, newValue);
      },
      { deep: true }
    );

    return refValue;
  };

  return {
    getItem,
    setItem,
    removeItem,
    useStoredRef,
  };
}
