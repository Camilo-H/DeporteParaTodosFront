import { Page } from '@playwright/test';

// PerfilService ya inicia con 'Administrador' como valor por defecto del BehaviorSubject.
// addInitScript es un respaldo preventivo para el caso en que AuthService lo sobreescriba.
export async function injectPerfil(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.setItem('perfil', 'Administrador');
  });
}
