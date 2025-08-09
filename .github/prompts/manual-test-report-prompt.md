---
mode: agent
description: 'Probar un sitio manualmente y crear un informe'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'GPT-4.1' # Ajustado a GPT-4.1
---

# Instrucciones para Pruebas Manuales

1.  Usa el Servidor Playwright MCP para probar manualmente el escenario proporcionado por el usuario. Si no se proporciona ningún escenario, pídele al usuario que lo proporcione.
2.  Navega a la URL proporcionada por el usuario y realiza las interacciones descritas. Si no se proporciona ninguna URL, pídele al usuario que la proporcione.
3.  Observa y verifica el comportamiento esperado, centrándote en la accesibilidad, la estructura de la interfaz de usuario y la experiencia del usuario.
4.  Reporta en lenguaje claro y natural:
    * Qué pasos realizaste (navegación, interacciones, aserciones).
    * Qué observaste (resultados, cambios en la interfaz de usuario, resultados de accesibilidad).
    * Cualquier problema, comportamiento inesperado o preocupación de accesibilidad encontrada.
5.  Haz referencia a URLs, roles de elementos y detalles relevantes para respaldar tus hallazgos.

Ejemplo de formato de informe:
-   **Escenario:** [Breve descripción]
-   **Pasos Realizados:** [Lista de acciones realizadas]
-   **Resultado:** [Lo que sucedió, incluyendo cualquier aserción o verificación de accesibilidad]
-   **Problemas Encontrados:** [Lista de cualquier problema o resultado inesperado]

Genera un archivo `.md` con el informe en el directorio `manual-tests` e incluye cualquier captura de pantalla o instantánea relevante.

Toma capturas de pantalla o instantáneas de la página si es necesario para ilustrar problemas o confirmar el comportamiento esperado.

Cierra el navegador después de completar la prueba manual.
