import { setActivePinia, createPinia } from "pinia";
import { useApiStore } from "@/stores/api";
import { vi, describe, beforeEach, it, expect } from "vitest";

// Mock localStorage composable
vi.mock("@/composables/useLocalStorage", () => {
  let storage = {};
  return {
    useLocalStorage: () => ({
      getItem: (key, defaultValue = "") => storage[key] ?? defaultValue,
      setItem: (key, value) => {
        storage[key] = value;
      },
    }),
  };
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("api.js (apiStore)", () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useApiStore();
    mockFetch.mockReset();
  });

  it("debería establecer y recuperar la API key", () => {
    store.setApiKey("TEST_KEY");
    expect(store.apiKey).toBe("TEST_KEY");
    expect(store.hasApiKey).toBe(true);
  });

  it("debería lanzar error si no hay API key", async () => {
    store.setApiKey("");
    await expect(store.callGeminiAPI("hola")).rejects.toThrow(
      "API Key no configurada"
    );
  });

  it("debería hacer una llamada exitosa a la API y devolver el texto", async () => {
    store.setApiKey("FAKE_KEY");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "Resultado de prueba" }],
            },
          },
        ],
      }),
    });

    const result = await store.callGeminiAPI("Prompt de prueba");
    expect(result).toBe("Resultado de prueba");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("debería manejar respuesta inválida", async () => {
    store.setApiKey("FAKE_KEY");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await expect(store.callGeminiAPI("Prompt inválido")).rejects.toThrow(
      "📝 Respuesta inválida de la API de Gemini"
    );
  });

  it("debería manejar errores de la API con mensajes personalizados", async () => {
    store.setApiKey("FAKE_KEY");

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: { message: "Permiso denegado" } }),
    });

    await expect(store.callGeminiAPI("Error 403")).rejects.toThrow(
      "🔑 API Key inválida o sin permisos"
    );
  });

  it("debería reintentar ante error 503 y tener éxito en el segundo intento", async () => {
    store.setApiKey("FAKE_KEY");

    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Recuperado en el segundo intento" }],
              },
            },
          ],
        }),
      });

    const result = await store.callGeminiAPI("Intento con 503");
    expect(result).toBe("Recuperado en el segundo intento");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
