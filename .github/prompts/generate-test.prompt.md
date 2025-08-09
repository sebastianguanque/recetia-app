---
mode: agent
description: 'Generar pruebas Playwright basadas en escenarios de usuario'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'GPT-4.1'
---

# Generación de Pruebas con Playwright MCP

Tu objetivo es generar una prueba de Playwright basada en el escenario proporcionado después de completar todos los pasos prescritos.

## Instrucciones Específicas

-   Se te proporcionará un escenario y deberás generar una prueba de Playwright para él. Si el usuario no proporciona un escenario, le pedirás que lo haga.
-   **NO** generes código de prueba basándote únicamente en el escenario.
-   **SÍ** ejecuta los pasos uno por uno usando las herramientas proporcionadas por Playwright MCP.
-   Solo después de que todos los pasos estén completados, emite una prueba de Playwright **JavaScript** que utilice `@playwright/test` basándose en el historial de mensajes.
-   Guarda el archivo de prueba generado en el directorio `tests/`.
-   Ejecuta el archivo de prueba e itera hasta que la prueba pase.
