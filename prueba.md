Implemento los 3 archivos y luego ejecuto la verificación:

Write D:\ACER\Documents\Practica_Codigo_Fuente\Fronted2026\DeporteParaTodosFront\karma.conf.js
41 lines
module.exports = function (config) {
config.set({
basePath: '',
frameworks: ['jasmine', '@angular-devkit/build-angular'],
plugins: [
require('karma-jasmine'),
require('karma-chrome-launcher'),
require('karma-jasmine-html-reporter'),
require('karma-coverage'),
require('@angular-devkit/build-angular/plugins/karma'),
],
client: {
jasmine: {},
clearContext: false,
},
jasmineHtmlReporter: { suppressAll: true },
coverageReporter: {
dir: require('path').join(\_\_dirname, './coverage/deporte-para-todos'),
subdir: '.',
reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'lcovonly' }],
},
reporters: ['progress', 'kjhtml'],
port: 9876,
colors: true,
logLevel: config.LOG_INFO,
autoWatch: true,
// Launcher estándar para desarrollo local
browsers: ['Chrome'],
singleRun: false,
restartOnFileChange: true,
// Launcher CI: --no-sandbox evita el crash de Chromium en GitHub Actions
// (seccomp + restricciones de namespace en ubuntu-latest, incluso como non-root)
customLaunchers: {
ChromeHeadlessCI: {
base: 'ChromeHeadless',
flags: ['--no-sandbox', '--disable-gpu', '--headless'],
},
},
});
};
Read D:\ACER\Documents\Practica_Codigo_Fuente\Fronted2026\DeporteParaTodosFront\angular.json (lines 84-93)
Edit D:\ACER\Documents\Practica_Codigo_Fuente\Fronted2026\DeporteParaTodosFront\angular.json
Added 1 line
Bash Create .github/workflows directory
IN
mkdir -p "D:/ACER/Documents/Practica_Codigo_Fuente/Fronted2026/DeporteParaTodosFront/.github/workflows"

OUT
(Bash completed with no output)
Write D:\ACER\Documents\Practica_Codigo_Fuente\Fronted2026\DeporteParaTodosFront\.github\workflows\angular-ci.yml
36 lines
name: Angular CI

on:
push:
branches: [ main ]
pull_request:
branches: [ main ]

jobs:
test:
runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Ejecutar tests con cobertura
        run: npx ng test --watch=false --browsers=ChromeHeadlessCI

      - name: Subir reporte de cobertura
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/
          retention-days: 30

Los 3 archivos están listos. Ahora el test de verificación local con ChromeHeadlessCI:

PowerShell Run tests with ChromeHeadlessCI launcher to verify karma.conf.js works
IN
cd "D:\ACER\Documents\Practica_Codigo_Fuente\Fronted2026\DeporteParaTodosFront"; npx ng test --watch=false --browsers=ChromeHeadlessCI --code-coverage 2>&1 | Select-String -Pattern "(TOTAL|SUCCESS|FAILED|ERROR [^']|Statements|Branches|Functions|Lines|Executed \d+ of \d+)" | Select-Object -Last 15

OUT
Chrome Headless 151.0.0.0 (Windows 10): Executed 118 of 126 SUCCESS (0 secs / 0.145 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 119 of 126 SUCCESS (0 secs / 0.148 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 120 of 126 SUCCESS (0 secs / 0.148 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 121 of 126 SUCCESS (0 secs / 0.148 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 122 of 126 SUCCESS (0 secs / 0.149 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 123 of 126 SUCCESS (0 secs / 0.15 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 124 of 126 SUCCESS (0 secs / 0.151 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 125 of 126 SUCCESS (0 secs / 0.152 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 126 of 126 SUCCESS (0 secs / 0.153 secs)
Chrome Headless 151.0.0.0 (Windows 10): Executed 126 of 126 SUCCESS (0.221 secs / 0.153 secs)
TOTAL: 126 SUCCESS
Statements : 19.55% ( 115/588 )
Branches : 8.6% ( 13/151 )
Functions : 30.6% ( 71/232 )
Lines : 19.58% ( 112/572 )
126/126 SUCCESS con ChromeHeadlessCI. Cobertura idéntica a la ronda anterior.

Verificación pasada. Los 3 archivos están listos para commit:

Archivo Estado
karma.conf.js Nuevo — define ChromeHeadlessCI con --no-sandbox
angular.json Modificado — añade "karmaConfig": "karma.conf.js" en test options
.github/workflows/angular-ci.yml Nuevo — workflow CI con ChromeHeadlessCI y artifact de cobertura
¿Procedo con el commit, o prefieres revisarlo antes?
