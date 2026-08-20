# Reporte de Investigación — DeporteParaTodos Frontend

**Fecha:** 2026-08-20  
**Sesión:** Continuación SCRUM-64 / SCRUM-58 / SCRUM-66 / SCRUM-137 + cobertura de tests

---

## PARTE 1 — Siguiente ronda de tests unitarios

### AuthService

Existe en `src/app/services/auth.service.ts`. Wrappea `angular-oauth2-oidc`'s `OAuthService` con Google OIDC.

**Tres problemas que lo hacen difícil de testear:**

1. El constructor llama directamente a `initLogin()`, que dispara `loadDiscoveryDocumentAndTryLogin()` (red real) y accede a `window.location.origin` — no disponible en jsdom sin mocks complejos.
2. `verificarUsuario()` no retorna el Observable — suscribe internamente y solo hace `console.log`. No hay output captureable.
3. `login()` / `logout()` / `isAuthenticated()` solo delegan a `OAuthService` sin lógica propia.

**Veredicto:** Saltear AuthService por ahora. El ROI es bajo (requiere stub pesado de `OAuthService` + patches de `window.location`) y no hay lógica de negocio propia que testear.

---

### ClaseService

Existe en `src/app/services/clase.service.ts`. Dos métodos, **ambos sin `catchError`** (el `.pipe()` está vacío — los errores HTTP no se propagan explícitamente):

```typescript
postClase(datosClase: ClaseDTO): Observable<ClaseDTO>
// POST /claseGrupo

getClase(categoria, curso, anio, iterable): Observable<ClaseDTO>
// GET /clasesGrupo?categoria={encoded}&curso={encoded}&anio={n}&iterable={n}
```

**Candidato válido para la próxima ronda** — ~5 tests (2 happy path + nota en spec sobre ausencia de catchError como observación de calidad).

---

### FormHorarioComponent — lógica propia destacable

Archivo: `src/app/viewswebsite/Components/cursos/form-horario/form-horario.component.ts`

Tiene lógica pura testeable sin necesidad de template:

| Método | Tipo | Testeable vía |
|--------|------|---------------|
| `puedeGuardar(): boolean` | Predicado puro (verifica días seleccionados + horaInicio + horaFin + escenario) | `Object.create(prototype)` — 0 DI |
| `confirmarEliminacion(id)` | Setea `confirmandoEliminacionId` | `Object.create(prototype)` |
| `cancelarEliminacion()` | Resetea `confirmandoEliminacionId = null` | `Object.create(prototype)` |
| `guardar()` | Depende de `HorarioService` + `forkJoin` | TestBed con stubs — costo medio |
| `eliminarHorario(id)` | Depende de `HorarioService` | TestBed con stubs — costo medio |

**Veredicto:** `puedeGuardar()` vale la pena sin duda (función pura, 0 dependencias). El resto requiere TestBed completo con `MAT_DIALOG_DATA`, `MatDialogRef`, `HorarioService`, `EscenarioService`, `MatSnackBar`.

**Casos para `puedeGuardar()`:**

```
- ningún día seleccionado → false
- día seleccionado pero sin horaInicio → false
- día + horaInicio pero sin horaFin → false
- todo completo → true
- múltiples días seleccionados + todo completo → true
```

---

### FormInscripcionesComponent — lógica propia destacable

Archivo: `src/app/viewswebsite/Components/usuarios/form-inscripciones/form-inscripciones.component.ts`

| Método | Lógica relevante |
|--------|-----------------|
| `ngOnInit()` | Bifurca entre modo creación y modo edición; en edición setea `isEditing = true` y pre-rellena `perfil.nombre`, `perfil.correo`, `perfil.tipoAlumno` |
| `onSubmit()` | Rama edición → `actualizarAlumno()`; rama creación → detecta rol `Instructor` vs `Estudiante` |

**Veredicto:** Vale la pena como test de componente (cubre SCRUM-66 a nivel de unidad). Requiere TestBed con `MAT_DIALOG_DATA` mockeado, `AlumnoService` stub, `MatDialogRef` stub. Costo medio, beneficio alto.

---

### Resumen de prioridades — próximas rondas

| Prioridad | Servicio/Componente | Tests estimados | Complejidad setup |
|-----------|--------------------|-----------------|--------------------|
| Alta | `ClaseService` | ~5 | Baja (solo HttpClient) |
| Alta | `AsistenciaService` (verificar si existe) | ~4-6 | Baja |
| Media | `FormHorarioComponent.puedeGuardar()` | ~5 | Nula (prototype) |
| Media | `FormInscripcionesComponent` (ngOnInit + onSubmit) | ~6-8 | Media (MAT_DIALOG_DATA stub) |
| Baja | `AuthService` | — | Muy alta (OAuthService mock) |

---

## PARTE 2 — Estado de herramientas E2E

### Frameworks instalados

**Ningún framework E2E instalado.** Revisado en `package.json`:

- ❌ Cypress — no está en `dependencies` ni `devDependencies`
- ❌ Playwright — no está en `dependencies` ni `devDependencies`
- ❌ Protractor — no está en `dependencies` ni `devDependencies`
- ✅ Karma + Jasmine — únicos frameworks de test presentes

La carpeta `e2e/` que aparece al buscar pertenece exclusivamente a `node_modules/@schematics/angular/e2e/` (templates de Angular CLI), **no es una carpeta de tests propia del proyecto**.

No existe `cypress.config.*`, `playwright.config.*`, ni `protractor.conf.js`.

---

### Rutas principales de la aplicación

Fuente: `src/app/app-routing.module.ts`

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` → `/home` | `HomeComponent` | Pantalla principal |
| `/login` | `LoginComponent` | Autenticación Google OAuth |
| `/cursos_deportivos/:identificador` | `CursosDeportivosComponent` | Cursos por categoría |
| `/listaDeportistasCurso/:categoria/:curso/:anio/:iterable` | `ListDeportistasdeCursoComponent` | Deportistas de un grupo |
| `/configuracionCatCurso` | `ConfigTipoCursoComponent` | Config de categorías y cursos |
| `/registroDeCursoDeportivo` | `FormCursoDeportiviComponent` | Crear/editar curso |
| `/nuevoCursoCategoria` | `NuevoCursoCategoriaComponent` | Nueva categoría |
| `/list-grupos/:categoria/:curso` | `ListGruposComponent` | Grupos de un curso |
| `/info-instructor` | `InformacinInstructorComponent` | Perfil de instructor |
| `/info-curso` | `InformacionCursoComponent` | Detalle de curso |
| `/lista-instructores` | `ListaInstructoresComponent` | Catálogo de instructores |
| `/reportes` | `ReportesComponent` | Dashboard estadísticas |
| `/info-estudiante` | `InformacionEstudianteComponent` | Perfil de estudiante |
| `/notificacion` | `FormAlertaComponent` | Alertas/notificaciones |

---

### 5 candidatos a flujo E2E (priorizados)

Criterio de selección: flujos **ya validados manualmente** en esta sesión, con criterio de éxito/fracaso claro y bien definido.

| # | Flujo | Ruta de entrada | Criterio de éxito | Criterio de fallo |
|---|-------|----------------|-------------------|-------------------|
| 1 | **Registrar instructor** (SCRUM-137) | `/lista-instructores` → abrir formulario | Instructor aparece en la lista tras POST exitoso | Formulario no envía o lista no se actualiza |
| 2 | **Crear horario con selector de escenario** | `/list-grupos/:cat/:curso` → card → dialog FormHorario | Horario aparece en la tabla del dialog tras `forkJoin` exitoso | Escenarios no cargan o POST falla silenciosamente |
| 3 | **Eliminar categoría bloqueada (409)** | `/configuracionCatCurso` → intentar borrar categoría con cursos activos | Mensaje de error 409 visible, categoría permanece en la lista | Categoría desaparece o no se muestra error |
| 4 | **Registrar asistencia** | `/listaDeportistasCurso/:cat/:curso/:anio/:iterable` | Checkboxes marcados → POST → confirmación visual (snackbar/badge) | Asistencia no se guarda o estado visual no cambia |
| 5 | **Editar alumno** (SCRUM-66) | `/listaDeportistasCurso/:...` → botón editar → dialog | Campos pre-rellenos con datos del alumno; PUT con solo 3 campos; lista muestra nombre actualizado | Dialog vacío o PUT envía campos incorrectos |

**Nota importante:** Todos estos flujos requieren primero resolver el login. La autenticación es Google OAuth (`angular-oauth2-oidc`). En Cypress/Playwright la estrategia habitual es:
- Bypassear OAuth en tests (`cy.setCookie` o `page.addInitScript`) estableciendo tokens de sesión mockeados, o
- Usar un usuario de prueba real con `cy.origin` (Cypress) / `page.goto` hacia Google (frágil).

---

## PARTE 3 — SonarCloud

### Archivos de configuración existentes

| Archivo | ¿Existe? |
|---------|----------|
| `sonar-project.properties` (raíz frontend) | ❌ No existe |
| Sección `<sonar.*>` en `pom.xml` | No verificado (pom.xml es del backend — directorio distinto) |
| `.sonarcloud.properties` | ❌ No existe |
| GitHub Actions workflow con SonarCloud | No verificado (requeriría revisar `.github/workflows/`) |

### Estado técnico del frontend para SonarCloud

El proyecto Angular **está técnicamente listo** para integrarse con SonarCloud sin cambios en el código fuente:

- ✅ Coverage generada en `coverage/` con `ng test --code-coverage` (formato LCOV, compatible con SonarCloud)
- ✅ TypeScript — SonarCloud tiene análisis nativo de TS/Angular
- ✅ Proyecto con `package.json` estándar — compatible con `sonar-scanner` CLI y GitHub Action

La configuración del lado del código sería un único archivo nuevo:

```properties
# sonar-project.properties (raíz del proyecto Angular)
sonar.projectKey=TU_ORG_TU_PROYECTO_KEY
sonar.organization=TU_ORG
sonar.sources=src
sonar.exclusions=**/node_modules/**,**/*.spec.ts
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts
sonar.javascript.lcov.reportPaths=coverage/deporte-para-todos/lcov.info
```

Y un paso en GitHub Actions:

```yaml
# .github/workflows/sonarcloud.yml (fragmento)
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Lo que debes hacer manualmente (no automatizable desde aquí)

1. Crear cuenta en [sonarcloud.io](https://sonarcloud.io) y vincular el repositorio GitHub.
2. Crear un nuevo proyecto en SonarCloud → obtener `projectKey` y `organization`.
3. Generar el `SONAR_TOKEN` desde la interfaz web de SonarCloud.
4. Agregar el token como secret en GitHub (`Settings → Secrets → SONAR_TOKEN`).

Con esos 4 datos disponibles, la integración completa del lado del código (frontend + backend) es trabajo de una sesión corta.

### Backend (pom.xml)

No se pudo verificar el `pom.xml` del backend desde este workspace (directorio diferente). Para un Spring Boot estándar de un solo módulo, la integración es mínima:

```xml
<!-- En <properties> -->
<sonar.projectKey>TU_PROYECTO_KEY</sonar.projectKey>
<sonar.organization>TU_ORG</sonar.organization>

<!-- En <build><plugins> -->
<plugin>
  <groupId>org.sonarsource.scanner.maven</groupId>
  <artifactId>sonar-maven-plugin</artifactId>
  <version>3.11.0.3922</version>
</plugin>
```

Y ejecutar con: `mvn sonar:sonar -Dsonar.token=TU_TOKEN`

---

## Acumulado de tests al cierre de la investigación

| Spec file | Tests | Servicios cubiertos |
|-----------|-------|---------------------|
| `cursodeportivo.service.spec.ts` | 18 | CursodeportivoService (7 métodos) |
| `inscripciones.service.spec.ts` | 8 | InscripcionesService (2 métodos) |
| `perfil.service.spec.ts` | 13 | PerfilService (BehaviorSubject + 2 métodos) |
| `categoria.service.spec.ts` | 16 | CategoriaService (BehaviorSubject + 5 métodos) |
| `grupo.service.spec.ts` | 11 | GrupoService (5 métodos) |
| `alumno.service.spec.ts` | 10 | AlumnoService (2 métodos incl. actualizarAlumno SCRUM-66) |
| `instructor.service.spec.ts` | 6 | InstructorServisce (2 métodos) |
| `horario.service.spec.ts` | 9 | HorarioService (3 métodos incl. crearHorario/eliminarHorario) |
| `escenario.service.spec.ts` | 3 | EscenarioService (1 método) |
| `list-grupos.component.spec.ts` | 7 | letraDeIterable (pure function) |
| `list-deportistasde-curso.component.spec.ts` | 7 | letraDeIterable (pure function) |
| `reportes.component.spec.ts` | 7 | letraDeIterable (pure function) |
| **TOTAL** | **115** | **115 SUCCESS · 0 FAILED** |

**Cobertura global** (denominador = todas las líneas importadas transitivamente por la suite):

| Métrica | Resultado |
|---------|-----------|
| Statements | 18.53% (109/588) |
| Branches | 5.96% (9/151) |
| Functions | 28.44% (66/232) |
| Lines | 18.53% (106/572) |
