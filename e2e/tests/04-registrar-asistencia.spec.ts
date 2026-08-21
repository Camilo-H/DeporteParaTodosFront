import { test, expect } from '@playwright/test';
import { injectPerfil } from '../support/auth-setup';
import { TEST_GROUP } from '../support/test-data';

// SCRUM-10 HU-02: registrar asistencia desde listaDeportistasCurso.
// El grupo Recreativo/ping pong/2026/1 tiene al menos 2 alumnos reales
// (Diana Lazo, Brayan Ferreira) validados manualmente.
test.describe('SCRUM-10 HU-02 — Registrar asistencia', () => {
  test.beforeEach(async ({ page }) => {
    await injectPerfil(page);
  });

  test('marca alumnos y registra asistencia con snackbar de éxito; checkboxes se limpian', async ({ page }) => {
    const { categoria, curso, anio, iterable } = TEST_GROUP;
    await page.goto(
      `/listaDeportistasCurso/${encodeURIComponent(categoria)}/${encodeURIComponent(curso)}/${anio}/${iterable}`
    );

    // Esperar tabla de alumnos
    await expect(page.locator('table[mat-table]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('tr[mat-row]').first()).toBeVisible();

    // Botón deshabilitado mientras no hay selección
    const btnAsistencia = page.getByRole('button', { name: 'Registrar asistencia' });
    await expect(btnAsistencia).toBeDisabled();

    // Marcar primera fila
    const primeraFila = page.locator('tr[mat-row]').nth(0);
    const checkboxUno = primeraFila.locator('mat-checkbox input[type="checkbox"]');
    await checkboxUno.check({ force: true }); // force: mat-checkbox oculta el input nativo

    // Marcar segunda fila
    const segundaFila = page.locator('tr[mat-row]').nth(1);
    const checkboxDos = segundaFila.locator('mat-checkbox input[type="checkbox"]');
    await checkboxDos.check({ force: true });

    // Botón habilitado
    await expect(btnAsistencia).toBeEnabled();

    // Registrar
    await btnAsistencia.click();

    // Snackbar de éxito (postClase + registrarAsistencias en secuencia)
    const snackbar = page.locator('mat-snack-bar-container');
    await expect(snackbar).toBeVisible({ timeout: 10_000 });
    await expect(snackbar).toContainText('Asistencia registrada correctamente');

    // El componente limpia seleccionados = [] → checkboxes se desmarcan
    await expect(checkboxUno).not.toBeChecked({ timeout: 5_000 });
  });
});
