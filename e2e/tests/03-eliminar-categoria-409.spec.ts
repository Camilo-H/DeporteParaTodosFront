import { test, expect, APIRequestContext } from '@playwright/test';
import { injectPerfil } from '../support/auth-setup';
import { API_BASE, TEST_CATEGORIA } from '../support/test-data';

// SCRUM-141: eliminar categoría y verificar manejo de 409.
//
// Estrategia (autocontenida, sin mocks):
//   beforeAll : crea TEST_CATEGORIA vía HTTP real → backend la marca activa (eliminado=0)
//   test      : primera eliminación vía UI real → backend responde 200 → card desaparece del DOM
//               segunda eliminación vía page.request.delete() real → backend responde 409
//
// Nota: el snackbar 'La categoría ya se encuentra eliminada' solo es verificable en la UI
// si la tarjeta sigue visible en el DOM tras la primera eliminación. HomeComponent llama
// loadCategorias() inmediatamente al confirmar, por lo que la tarjeta desaparece antes
// de que podamos hacer un segundo click. Se verifica el 409 a nivel HTTP.
// Para verificar el snackbar de forma aislada, el componente necesitaría un estado
// donde la tarjeta persista en pantalla tras el delete — fuera del alcance de este sprint.
test.describe('SCRUM-141 — Eliminar categoría con manejo de 409', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({ baseURL: API_BASE });
    const res = await apiContext.post('/categoria', {
      data: { titulo: TEST_CATEGORIA, descripcion: 'Categoría creada por Playwright E2E' },
    });
    // Si ya existía de una ejecución anterior fallida, el 409 aquí no es un problema —
    // la categoría sigue existiendo en la BD lista para ser eliminada en el test.
    if (!res.ok() && res.status() !== 409) {
      throw new Error(`Error al crear categoría de test: ${res.status()}`);
    }
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.beforeEach(async ({ page }) => {
    await injectPerfil(page);
  });

  test('primera eliminación vía UI devuelve 200; segunda llamada real devuelve 409', async ({ page }) => {
    await page.goto('/home');

    // Verificar que la tarjeta de la categoría de test está visible
    const tarjeta = page.locator('mat-card', { hasText: TEST_CATEGORIA });
    await expect(tarjeta).toBeVisible({ timeout: 10_000 });

    // --- Primera eliminación (flujo UI completo) ---
    await tarjeta.locator('button.btn-menu').click();
    await expect(page.locator('button[mat-menu-item]:has-text("Eliminar")')).toBeVisible();
    await page.locator('button[mat-menu-item]:has-text("Eliminar")').click();

    await expect(page.locator('mat-dialog-container')).toBeVisible();
    await page.locator('button.btn-confirmar').click();

    // HomeComponent llama loadCategorias() → categoría eliminada desaparece del DOM
    await expect(page.locator('mat-dialog-container')).not.toBeVisible({ timeout: 8_000 });
    await expect(tarjeta).not.toBeVisible({ timeout: 8_000 });

    // --- Segunda eliminación (HTTP real, sin mock) ---
    // La tarjeta ya no existe en el DOM. Se llama directamente al backend para
    // verificar que el sistema responde 409 en un segundo intento de eliminación.
    const resp = await page.request.delete(
      `${API_BASE}/categoria?titulo=${encodeURIComponent(TEST_CATEGORIA)}`
    );
    expect(resp.status()).toBe(409);
  });
});
