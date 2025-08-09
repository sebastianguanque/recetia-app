---
mode: agent
description: 'Exploración de sitio web para pruebas usando Playwright MCP'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'GPT-4.1'
---

# Exploración de Sitio Web para Pruebas

Tu objetivo es explorar el sitio web e identificar las funcionalidades clave.

## Instrucciones Específicas

1.  Navega a la URL proporcionada usando el servidor de Playwright MCP. Si no se proporciona una URL, pídele al usuario que la proporcione.
2.  Identifica e interactúa con 3-5 características principales o flujos de usuario.
3.  Documenta las interacciones del usuario, los elementos de la interfaz de usuario relevantes (y sus localizadores), y los resultados esperados.
4.  Cierra el contexto del navegador al finalizar.
5.  Proporciona un resumen conciso de tus hallazgos.
6.  Propón y genera casos de prueba basados en la exploración.
