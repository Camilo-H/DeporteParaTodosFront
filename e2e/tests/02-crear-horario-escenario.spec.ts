import { test, expect } from '@playwright/test';
import { injectPerfil } from '../support/auth-setup';
import { TEST_GROUP } from '../support/test-data';

// SCRUM-134/135: crear horario con selector de escenario desde list-grupos.
// FormHorarioComponent: guardar() hace POST por cada día seleccionado,
// luego recarga la lista interna y muestra snackbar — el dialog permanece abierto.
test.describe('SCRUM-134/135 — Crear horario con selector de escenario', () => {
  test.beforeEach(async ({ page }) => {
    await injectPerfil(page);
  });

  test('agrega horario con día, horas y escenario; aparece en el dialog y en la tarjeta del grupo', async ({ page }) => {
    const { categoria, curso } = TEST_GROUP;
    await page.goto(`/list-grupos/${encodeURIComponent(categoria)}/${encodeURIComponent(curso)}`);

    // Esperar que aparezca al menos una tarjeta de grupo
    await expect(page.locator('mat-card').first()).toBeVisible({ timeout: 10_000 });

    // Abrir el menú de settings de la primera tarjeta
    await page.locator('mat-card').first().locator('button.btn-menu').click();

    // Esperar el menú y hacer click en "Gestionar horarios"
    await expect(page.locator('button[mat-menu-item]:has-text("Gestionar horarios")')).toBeVisible();
    await page.locator('button[mat-menu-item]:has-text("Gestionar horarios")').click();

    // Dialog FormHorarioComponent abierto
    await expect(page.getByText('Gestionar Horarios')).toBeVisible();

    // Seleccionar día "Lun"
    const chipLun = page.locator('.dia-chip', { hasText: 'Lun' });
    await chipLun.click();
    await expect(chipLun).toHaveClass(/dia-activo/);

    // Horas
    await page.fill('input[name="horaInicio"]', '08:00');
    await page.fill('input[name="horaFin"]', '10:00');

    // Escenario: abrir mat-select y elegir la primera opción disponible
    await page.locator('mat-select[name="escenario"]').click();
    await expect(page.locator('mat-option').first()).toBeVisible();
    const nombreEscenario = (await page.locator('mat-option').first().textContent())?.trim() ?? '';
    await page.locator('mat-option').first().click();

    // Botón "Agregar" debe estar habilitado (puedeGuardar() === true)
    const btnAgregar = page.locator('button[mat-raised-button]:has-text("Agregar")');
    await expect(btnAgregar).toBeEnabled();

    // Guardar
    await btnAgregar.click();

    // Snackbar de éxito
    await expect(page.locator('mat-snack-bar-container')).toContainText('Horario(s) agregado(s) correctamente', { timeout: 8_000 });

    // El horario aparece en "Horarios registrados" dentro del dialog
    await expect(page.locator('.horario-text').first()).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('.horario-text').first()).toContainText('LUNES');
    await expect(page.locator('.horario-text').first()).toContainText('08:00');
    await expect(page.locator('.horario-text').first()).toContainText('10:00');
    if (nombreEscenario) {
      await expect(page.locator('.horario-text').first()).toContainText(nombreEscenario);
    }

    // Cerrar el dialog
    await page.locator('button[mat-button]:has-text("Cerrar")').click();
    await expect(page.getByText('Gestionar Horarios')).not.toBeVisible();

    // El horario recargado también aparece en la tarjeta del grupo
    // (gestionarHorarios() llama getHorarios() al cerrarse con cambiosRealizados=true)
    await expect(page.locator('mat-card').first()).toContainText('08:00', { timeout: 8_000 });
  });
});
