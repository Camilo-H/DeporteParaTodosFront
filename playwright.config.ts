import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  // Un worker: los tests mutan una BD Oracle compartida
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    // Usa el Chrome instalado en el sistema (evita descargar Chromium)
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
});
