import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const useApiStore = defineStore("api", () => {
  const { getItem, setItem } = useLocalStorage();

  const apiKey = ref(getItem("gemini_api_key", ""));

  const hasApiKey = computed(() => !!apiKey.value);

  const setApiKey = (key) => {
    apiKey.value = key;
    setItem("gemini_api_key", key);
  };

  const callGeminiAPI = async (prompt, maxRetries = 3) => {
    if (!apiKey.value) {
      throw new Error("API Key no configurada");
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Mantener el modelo gratuito original
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey.value}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        });

        // Si es error 503 y no es el último intento, reintentar
        if (response.status === 503 && attempt < maxRetries) {
          const waitTime = attempt * 3000; // 3, 6, 9 segundos
          console.log(
            `🔄 Intento ${attempt}/${maxRetries} - Servidor sobrecargado. Reintentando en ${waitTime / 1000} segundos...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        // Si es error 429 (rate limit) y no es el último intento, reintentar
        if (response.status === 429 && attempt < maxRetries) {
          const waitTime = attempt * 5000; // 5, 10, 15 segundos
          console.log(
            `⏳ Intento ${attempt}/${maxRetries} - Límite de velocidad alcanzado. Reintentando en ${waitTime / 1000} segundos...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Mensajes de error más amigables
          if (response.status === 503) {
            throw new Error(
              "🚫 El servicio de Gemini está temporalmente sobrecargado. Por favor, intenta de nuevo en unos minutos."
            );
          }

          if (response.status === 429) {
            throw new Error(
              "⏱️ Has alcanzado el límite de solicitudes. Espera un momento antes de intentar nuevamente."
            );
          }

          if (response.status === 400) {
            throw new Error(
              "❌ Error en la solicitud. Verifica que tu API Key sea válida."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "🔑 API Key inválida o sin permisos. Verifica tu clave de API."
            );
          }

          throw new Error(
            `❌ Error de API (${response.status}): ${errorData.error?.message || "Error desconocido"}`
          );
        }

        const data = await response.json();

        if (
          !data.candidates ||
          !data.candidates[0] ||
          !data.candidates[0].content
        ) {
          throw new Error(
            "📝 Respuesta inválida de la API de Gemini. Intenta nuevamente."
          );
        }

        // ✅ Éxito en el intento
        if (attempt > 1) {
          console.log(`✅ Éxito en el intento ${attempt}/${maxRetries}`);
        }

        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        // Si es el último intento, lanzar el error
        if (attempt === maxRetries) {
          console.error(
            `❌ Falló después de ${maxRetries} intentos:`,
            error.message
          );
          throw error;
        }

        // Si es un error de red o 503/429, reintentar
        if (
          error.message.includes("503") ||
          error.message.includes("429") ||
          error.message.includes("overloaded") ||
          error.message.includes("fetch")
        ) {
          const waitTime = attempt * 2000; // 2, 4 segundos
          console.log(
            `🔄 Intento ${attempt}/${maxRetries} falló: ${error.message}. Reintentando en ${waitTime / 1000} segundos...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        // Para otros errores, no reintentar
        throw error;
      }
    }
  };

  return {
    apiKey,
    hasApiKey,
    setApiKey,
    callGeminiAPI,
  };
});
