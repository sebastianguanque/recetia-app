---
description: 'Instrucciones para la generación de pruebas Playwright'
applyTo: '**'
---

# Directrices para la Escritura de Pruebas

## Estándares de Calidad del Código
- **Localizadores**: Prioriza los localizadores orientados al usuario y basados en roles (`getByRole`, `getByLabel`, `getByText`, etc.) para mayor resiliencia y accesibilidad. Usa `test.step()` para agrupar interacciones y mejorar la legibilidad e informes de las pruebas.
- **Aserciones**: Utiliza aserciones "web-first" con reintento automático. Estas aserciones comienzan con la palabra clave `await` (ej. `await expect(locator).toHaveText()`). Evita `expect(locator).toBeVisible()` a menos que estés probando específicamente cambios de visibilidad.
- **Tiempos de Espera (Timeouts)**: Confía en los mecanismos de auto-espera incorporados de Playwright. Evita esperas codificadas o el aumento de los tiempos de espera predeterminados.
- **Claridad**: Usa títulos de pruebas y pasos descriptivos que indiquen claramente la intención. Agrega comentarios solo para explicar lógica compleja o interacciones no obvias.


## Estructura de la Prueba
- **Importaciones**: Comienza con `import { test, expect } from '@playwright/test';`.
- **Organización**: Agrupa las pruebas relacionadas con una característica bajo un bloque `test.describe()`.
- **Hooks**: Usa `beforeEach` para acciones de configuración comunes a todas las pruebas en un bloque `describe` (ej. navegar a una página).
- **Títulos**: Sigue una convención de nombres clara, como `Característica - Acción o escenario específico`.


## Organización de Archivos
- **Ubicación**: Almacena todos los archivos de prueba en el directorio `tests/`.
- **Nomenclatura**: Usa la convención `<característica-o-página>.spec.js` (cambiado de `.ts` a `.js` para JavaScript).
- **Alcance**: Intenta que haya un archivo de prueba por cada característica o página principal de la aplicación.

## Mejores Prácticas de Aserción
- **Estructura de la Interfaz de Usuario (UI)**: Usa `toMatchAriaSnapshot` para verificar la estructura del árbol de accesibilidad de un componente. Esto proporciona una instantánea completa y accesible.
  - No añadas contenido de texto o contenido de párrafo al yaml. Elige una de las siguientes estrategias:
    - Omite el contenido de texto por completo: Simplemente referencia el elemento sin su texto.
    - Usa coincidencia parcial de texto: Incluye solo el inicio del texto.
    - Concéntrate en la estructura sobre el contenido: Prueba la presencia y jerarquía de los elementos sin su contenido de texto.
  - Agrega `url` al yaml si aún no está presente. Puedes encontrar la URL correcta navegando a la página con el servidor Playwright MCP y viendo la captura de la página.
- **Conteo de Elementos**: Usa `toHaveCount` para afirmar el número de elementos encontrados por un localizador.
- **Contenido de Texto**: Usa `toHaveText` para coincidencias de texto exactas y `toContainText` para coincidencias parciales.
- **Navegación**: Usa `toHaveURL` para verificar la URL de la página después de una acción.


## Ejemplo de Estructura de Prueba

```javascript
import { test, expect } from '@playwright/test';

test.describe('Funcionalidad de Búsqueda de Películas', () => {
  test.beforeEach(async ({ page }) => {
    // Navega a la aplicación antes de cada prueba
    await page.goto('[https://debs-obrien.github.io/playwright-movies-app](https://debs-obrien.github.io/playwright-movies-app)');
  });

  test('Buscar una película por título', async ({ page }) => {
    await test.step('Activar y realizar búsqueda', async () => {
      await page.getByRole('search').click();
      const searchInput = page.getByRole('textbox', { name: 'Campo de Búsqueda' });
      await searchInput.fill('Garfield');
      await searchInput.press('Enter');
    });

    await test.step('Verificar resultados de búsqueda', async () => {
      // Verificar el árbol de accesibilidad de los resultados de búsqueda
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - main:
          - heading "Garfield" [level=1]
          - heading "resultados de búsqueda" [level=2]
          - list "películas":
            - listitem "película":
              - link "póster de La película de Garfield Calificación de La película de Garfield":
                - /url: /playwright-movies-app/movie?id=tt5779228&page=1
                - img "póster de La película de Garfield"
                - heading "La película de Garfield" [level=2]
      `);
    });
  });
});

## Estrategia de Ejecución de Pruebas

1.  **Ejecución Inicial**: Ejecuta pruebas con `npx playwright test --project=chromium`
2.  **Depuración de Fallos**: Analiza los fallos de las pruebas e identifica las causas raíz
3.  **Iterar**: Refina los localizadores, aserciones o la lógica de la prueba según sea necesario
4.  **Validar**: Asegúrate de que las pruebas pasen consistentemente y cubran la funcionalidad prevista
5.  **Reportar**: Proporciona comentarios sobre los resultados de las pruebas y cualquier problema descubierto

---

## Lista de Verificación de Calidad

Antes de finalizar las pruebas, asegúrate de que:
- [ ] Todos los localizadores sean accesibles y específicos, y eviten violaciones del modo estricto
- [ ] Las pruebas estén agrupadas lógicamente y sigan una estructura clara
- [ ] Las aserciones sean significativas y reflejen las expectativas del usuario
- [ ] Las pruebas sigan convenciones de nombres consistentes
- [ ] El código esté correctamente formateado y comentado
