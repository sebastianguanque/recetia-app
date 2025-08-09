import { test, expect } from "@playwright/test";

// Test de integración para el botón Guardar Receta

test.describe("Botón Guardar Receta en RecipeCreator", () => {
  test("El botón aparece solo cuando hay receta generada y guarda en localStorage", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/recetia-app/#/");

    // Ingresa la API Key en el campo correspondiente y envía el formulario
    await page.waitForSelector(
      'input[aria-label="Ingresa tu API Key de Gemini"]',
      { timeout: 10000 }
    );
    await page.getByLabel("Ingresa tu API Key de Gemini").fill("");
    await page.getByRole("button", { name: /Guardar/i }).click();

    // Espera a que se redirija a la vista principal
    await page.waitForSelector('input[aria-label="Ingresa un ingrediente"]', {
      timeout: 10000,
    });

    // Realiza el flujo de creación y guardado de receta
    await page.getByLabel("Ingresa un ingrediente").fill("pollo");
    await page.getByRole("button", { name: "Agregar ingrediente" }).click();
    await page.getByRole("radio", { name: /Almuerzo/i }).click();
    await page.getByRole("button", { name: /Generar Receta/i }).click();

    // Espera a que aparezca la tarjeta de receta
    await page.waitForSelector(".recipe-result", { timeout: 15000 });

    // El botón Guardar Receta debe estar visible
    const saveBtn = page.getByRole("button", { name: /Guardar Receta/i });
    await expect(saveBtn).toBeVisible({ timeout: 10000 });

    // Limpia localStorage antes de guardar
    await page.evaluate(() => localStorage.removeItem("recetasGuardadas"));

    // Haz clic en Guardar Receta
    await saveBtn.click();

    // Verifica que la receta se guardó en la store y aparece en Recetas Guardadas
    // Cambia a la pestaña Lista de Compras
    await page.getByRole("tab", { name: /Lista de Compras/i }).click();

    // Espera a que aparezca la sección de Recetas Guardadas
    await page.waitForSelector(".saved-recipes-list", { timeout: 10000 });

    // Verifica que la receta guardada aparece en la lista
    const recipeName = "pollo";
    const savedRecipeVisible = await page
      .locator(".saved-recipes-list")
      .getByText(/pollo/i)
      .isVisible();
    expect(savedRecipeVisible).toBeTruthy();
  });
});
