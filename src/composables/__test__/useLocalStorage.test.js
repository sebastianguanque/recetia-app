// src/composables/__tests__/useLocalStorage.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLocalStorage } from "../useLocalStorage";
import { ref, watch, nextTick } from "vue";

// ----------------------
// MOCK DE FUNCIONES GLOBALES Y DE VUE
// ----------------------
// Mockeamos el objeto localStorage para simular su comportamiento en el entorno de pruebas
const mockStorage = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete mockStorage[key];
  }),
  clear: vi.fn(() => {
    for (const key in mockStorage) {
      delete mockStorage[key];
    }
  }),
};
// Reemplazamos el objeto global localStorage con nuestro mock
global.localStorage = mockLocalStorage;

// Mockeamos console.error para verificar que se llame en caso de errores
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

// ----------------------
// TESTS
// ----------------------
describe("useLocalStorage", () => {
  let composable;

  // Limpiamos los mocks y el localStorage simulado antes de cada prueba
  beforeEach(() => {
    composable = useLocalStorage();
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  // Test 1: Comprueba la función getItem para obtener valores
  it("debe obtener un ítem del localStorage y parsearlo correctamente", () => {
    mockLocalStorage.setItem("testKey", JSON.stringify({ name: "test" }));
    const result = composable.getItem("testKey");
    expect(result).toEqual({ name: "test" });
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("testKey");
  });

  // Test 2: Comprueba la función getItem para valores no existentes
  it("debe devolver el valor por defecto si el ítem no existe", () => {
    const result = composable.getItem("nonExistentKey", "defaultValue");
    expect(result).toBe("defaultValue");
  });

  // Test 3: Comprueba el manejo de errores en getItem
  it("debe manejar errores al obtener un ítem y devolver el valor por defecto", () => {
    // Simulamos un error en JSON.parse
    mockLocalStorage.getItem.mockImplementationOnce(() => "{ malformed json");
    const result = composable.getItem("malformedKey", "defaultValue");
    expect(result).toBe("defaultValue");
    expect(mockConsoleError).toHaveBeenCalled();
  });

  // Test 4: Comprueba la función setItem para guardar valores
  it("debe guardar un ítem en el localStorage como JSON string", () => {
    const data = { id: 1, value: "test" };
    composable.setItem("dataKey", data);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "dataKey",
      JSON.stringify(data)
    );
  });

  // Test 5: Comprueba el manejo de errores en setItem
  it("debe manejar errores al intentar guardar un ítem", () => {
    // Simulamos un error en localStorage.setItem
    mockLocalStorage.setItem.mockImplementationOnce(() => {
      throw new Error("Storage full error");
    });
    composable.setItem("errorKey", "value");
    expect(mockConsoleError).toHaveBeenCalled();
  });

  // Test 6: Comprueba la función removeItem
  it("debe eliminar un ítem del localStorage", () => {
    mockLocalStorage.setItem("itemToRemove", "value");
    composable.removeItem("itemToRemove");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("itemToRemove");
  });

  // Test 7: Comprueba el manejo de errores en removeItem
  it("debe manejar errores al intentar eliminar un ítem", () => {
    // Simulamos un error en localStorage.removeItem
    mockLocalStorage.removeItem.mockImplementationOnce(() => {
      throw new Error("Error on remove");
    });
    composable.removeItem("errorKey");
    expect(mockConsoleError).toHaveBeenCalled();
  });

  // Test 8: Comprueba la función useStoredRef para inicializar
  it("debe inicializar el ref con el valor del localStorage", () => {
    mockLocalStorage.setItem("storedRefKey", JSON.stringify("initial value"));
    const storedRef = composable.useStoredRef("storedRefKey", "defaultValue");
    expect(storedRef.value).toBe("initial value");
  });

  // Test 9: Comprueba useStoredRef con valor por defecto
  it("debe inicializar el ref con el valor por defecto si el localStorage está vacío", () => {
    const storedRef = composable.useStoredRef(
      "nonExistentRefKey",
      "defaultValue"
    );
    expect(storedRef.value).toBe("defaultValue");
  });

  // Test 10: Comprueba que useStoredRef actualice localStorage cuando cambia el ref
  it("debe llamar a setItem cuando el valor del ref cambia", async () => {
    const storedRef = composable.useStoredRef("dynamicRefKey", "initial");
    storedRef.value = "new value";

    // Esperamos que el watch haya hecho su trabajo en el próximo tick
    await nextTick();

    // Verificamos que localStorage.setItem haya sido llamado con el nuevo valor
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "dynamicRefKey",
      JSON.stringify("new value")
    );
  });
});
