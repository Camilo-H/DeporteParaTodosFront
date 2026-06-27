# Instrucciones para Agentes de IA - DeporteParaTodos Frontend

## Stack tecnológico

- **Framework:** Angular 16.1.0 (Angular CLI 16.1.4)
- **UI:** Angular Material 16.2.14 + Bootstrap 5.3.3 + Bootstrap Icons 1.11.3
- **HTTP:** HttpClientModule con RxJS 7.8.0 (Observables)
- **Autenticación:** angular-oauth2-oidc 15.0.1 (Google OAuth2)
- **Gráficos:** ngx-charts 20.1.1 + D3 7.8.5
- **PDF:** jsPDF 3.0.2 + jspdf-autotable 5.0.2 + html2canvas 1.4.1
- **Formularios:** Reactivos (FormBuilder) y de plantilla (NgForm), ambos en uso
- **Estado:** BehaviorSubject de RxJS (sin NgRx ni store externo)

---

## Estructura de carpetas (`src/app/`)

```
src/app/
├── Models/
│   └── DTOs/                     -> Interfaces TypeScript que reflejan los DTOs del backend
│       ├── alumno-dto.ts
│       ├── alerta-dto.ts
│       ├── atencion-dto.ts
│       ├── categoria-dto.ts
│       ├── clase-dto.ts
│       ├── curso-dto.ts
│       ├── deporte-dto.ts
│       ├── estadisticas-dto.ts
│       ├── grupo-dto.ts
│       ├── horario-dto.ts
│       ├── imagen-dto.ts
│       ├── inscripcion-dto.ts
│       ├── instructor-dto.ts
│       └── perfil-tdo.ts         -> Typo histórico: el archivo se llama -tdo, no -dto
│
├── services/                     -> Capa de acceso al backend (HttpClient)
│   ├── alerta-service.service.ts
│   ├── alumno.service.ts
│   ├── asistencia.service.ts
│   ├── auth.service.ts
│   ├── categoria.service.ts
│   ├── clase.service.ts
│   ├── cursodeportivo.service.ts
│   ├── deporte.service.ts
│   ├── grupo.service.ts
│   ├── horario.service.ts
│   ├── imagen.service.ts
│   ├── inscripciones.service.ts
│   ├── instructor.service.ts
│   ├── perfil.service.ts
│   └── reportes.service.ts
│
├── viewswebsite/
│   ├── Components/               -> Componentes reutilizables por feature
│   │   ├── cursos/               -> Todo lo relacionado con cursos deportivos y grupos
│   │   │   ├── config-tipo-curso/
│   │   │   ├── cursos-deportivos/
│   │   │   ├── form-curso-deportivo/
│   │   │   ├── form-grupos/
│   │   │   ├── gestion-inscripciones/
│   │   │   ├── informacion-curso/
│   │   │   ├── list-deportistasde-curso/
│   │   │   ├── list-grupos/
│   │   │   └── nuevo-curso-categoria/
│   │   ├── dialog/               -> Diálogos de confirmación (MatDialog)
│   │   ├── estadisticas/
│   │   │   └── reportes/         -> Dashboard de estadísticas con filtros y exportación PDF
│   │   └── usuarios/             -> Perfiles, inscripciones, instructores, notificaciones
│   │       ├── form-alerta/
│   │       ├── form-inscripciones/
│   │       ├── informacion-estudiante/
│   │       ├── informacion-instructor/
│   │       ├── lista-instructores/
│   │       └── ver-notificaciones/
│   └── pages/                    -> Páginas estructurales (shell de la app)
│       ├── header/
│       ├── home/
│       ├── login/
│       └── sidenav/
│
├── app-routing.module.ts         -> Todas las rutas de la aplicación
├── app.module.ts                 -> Módulo raíz; configura OAuthModule y proveedores
├── app.component.ts
├── app.component.html
└── app.component.css
```

---

## URL base del backend

```
http://127.0.0.1:8082/api/v2
```

Esta URL está **hardcodeada** en cada servicio. No existen archivos `environment.ts`.
El backend corre en Spring Boot 3.2.3 en el puerto **8082**.
Swagger del backend disponible en: `http://localhost:8082/swagger-ui.html`

---

## Servicios existentes

| Servicio | Entidad que maneja | Métodos principales |
|---|---|---|
| `alumno.service.ts` | Alumno (deportista) | `getAlumnosGrupo()` |
| `alerta-service.service.ts` | Alerta (notificación local) | `guardarAlerta()`, `retornarAlerta()` — sin HTTP |
| `asistencia.service.ts` | Atencion (asistencia) | Sin métodos implementados aún |
| `auth.service.ts` | Perfil / sesión OAuth | `login()`, `logout()`, `getProfile()`, `isAuthenticated()`, `verificarUsuario()` |
| `categoria.service.ts` | Categoria | `getCategorias()`, `createCategoria()`, `getCategoria()`, `updateCategoria()`, `deleteCategoria()` |
| `clase.service.ts` | Clase | `postClase()`, `getClase()` — tiene bug de `&` faltante en URL |
| `cursodeportivo.service.ts` | Curso deportivo | `getAllCursos()`, `getCursos()`, `crearCurso()`, `getCurso()`, `updateCurso()`, `deleteCurso()` |
| `deporte.service.ts` | Deporte | `getDeportes()`, `crearDeporte()` |
| `grupo.service.ts` | Grupo | `getGrupos()`, `createGrupo()`, `getGrupo()`, `updateGrupo()`, `deleteGrupo()` |
| `horario.service.ts` | Horario | `getHorarios()` |
| `imagen.service.ts` | Imagen (base64) | `getimagen()`, `postImagen()` (multipart) |
| `inscripciones.service.ts` | Inscripcion | `postInscripcion()`, `eliminarInscripcion()` |
| `instructor.service.ts` | Instructor | `getInstructores()`, `getInstructor()` |
| `perfil.service.ts` | Perfil (usuario activo) | `setPerfil()`, `getPerfil()`, `registrarPerfil()` — BehaviorSubject para rol activo |
| `reportes.service.ts` | Estadisticas | `getEstadisticasCategoria()`, `getEstadisticasCursos()`, `getEstadisticasGrupos()`, `getEstadisticasAlumno()`, `getEstadisticasInstructore()` |

---

## Componentes y pantallas

| Componente | Ruta asociada | Pantalla que representa |
|---|---|---|
| `HomeComponent` | `/home` | Dashboard principal con grilla de categorías deportivas; soporta CRUD de categorías con carga de imágenes |
| `LoginComponent` | `/login` | Pantalla de autenticación con Google OAuth2; incluye validación de correo institucional |
| `HeaderComponent` | (global) | Cabecera de navegación con selector de perfil y cambio de rol |
| `SidenavComponent` | (global) | Menú lateral de navegación |
| `CursosDeportivosComponent` | `/cursos_deportivos/:identificador` | Tarjetas de cursos por categoría; permite crear, editar, eliminar cursos y gestionar inscripciones |
| `ListGruposComponent` | `/list-grupos/:categoria/:curso` | Listado de grupos de un curso con instructor y horario; permite inscribirse |
| `ListDeportistasdeCursoComponent` | `/listaDeportistasCurso/:categoria/:curso/:anio/:iterable` | Deportistas inscritos en un curso; restringido a roles no-estudiante |
| `InformacionCursoComponent` | `/info-curso` | Detalle de información de un curso |
| `FormCursoDeportiviComponent` | `/registroDeCursoDeportivo` | Formulario de creación/edición de curso deportivo |
| `FormGruposComponent` | (modal/dialog) | Formulario de creación/edición de grupos |
| `NuevoCursoCategoriaComponent` | `/nuevoCursoCategoria` | Formulario para crear o editar una categoría deportiva |
| `ConfigTipoCursoComponent` | `/configuracionCatCurso` | Configuración de tipos de curso y categorías |
| `GestionInscripcionesComponent` | (modal/dialog) | Gestión de inscripciones de alumnos a un grupo |
| `FormInscripcionesComponent` | `/inscripciones` | Formulario de perfil del estudiante (tipo documento, facultad, programa, código) |
| `InformacionEstudianteComponent` | `/info-estudiante` | Visualización del perfil del estudiante |
| `InformacionInstructorComponent` | `/info-instructor` | Visualización del perfil del instructor |
| `ListaInstructoresComponent` | `/lista-instructores` | Listado de todos los instructores |
| `FormAlertaComponent` | `/notificacion` | Formulario para crear alertas/notificaciones |
| `VerNotificacionesComponent` | (modal/dialog) | Visualización de notificaciones recibidas |
| `ReportesComponent` | `/reportes` | Dashboard de estadísticas con filtros (fecha, categoría, curso, grupo, alumno, instructor), gráficos ngx-charts y exportación PDF |
| `DialogComponent` | (modal global) | Diálogo de confirmación para eliminación de categorías y cursos |

---

## Rutas principales (`app-routing.module.ts`)

| Path | Componente |
|---|---|
| `` | Redirige a `/home` |
| `/home` | HomeComponent |
| `/login` | LoginComponent |
| `/inscripciones` | FormInscripcionesComponent |
| `/cursos_deportivos/:identificador` | CursosDeportivosComponent |
| `/listaDeportistasCurso/:categoria/:curso/:anio/:iterable` | ListDeportistasdeCursoComponent |
| `/configuracionCatCurso` | ConfigTipoCursoComponent |
| `/registroDeCursoDeportivo` | FormCursoDeportiviComponent |
| `/nuevoCursoCategoria` | NuevoCursoCategoriaComponent |
| `/list-grupos/:categoria/:curso` | ListGruposComponent |
| `/info-instructor` | InformacionInstructorComponent |
| `/info-curso` | InformacionCursoComponent |
| `/lista-instructores` | ListaInstructoresComponent |
| `/reportes` | ReportesComponent |
| `/info-estudiante` | InformacionEstudianteComponent |
| `/notificacion` | FormAlertaComponent |

---

## Convenciones de código del proyecto

### Antes de escribir cualquier código

1. Lee el componente y su servicio asociado completos antes de modificar.
2. Identifica qué DTO usa el componente; verifica que el DTO TypeScript refleja lo que retorna el backend.
3. Si el backend agregó un campo nuevo, primero actualiza el DTO en `Models/DTOs/`, luego el servicio, luego el componente.
4. Indica qué archivos vas a cambiar antes de escribir código y espera confirmación.

### DTOs

- Ubicación: `src/app/Models/DTOs/`
- Deben ser interfaces TypeScript (no clases): `export interface CursoDto { ... }`
- Los campos deben coincidir exactamente con los que retorna el backend
- Typo histórico: el archivo de perfil se llama `perfil-tdo.ts` — no renombrar sin actualizar todos los imports

### Servicios

- Ubicación: `src/app/services/`
- Todos extienden el patrón: `this.http.get<T>(url, { params }).pipe(catchError(...))`
- La URL base siempre es `http://127.0.0.1:8082/api/v2` — no duplicar, extraer como constante local si el servicio la repite
- Retornar siempre `Observable<T>`, nunca subscribir dentro del servicio
- Usar `catchError` y `throwError` para propagar errores al componente

### Componentes

- La mayoría son **standalone** (`standalone: true` en el decorador); deben importar explícitamente sus dependencias en `imports: [...]`
- Los que no son standalone están declarados en `app.module.ts`
- No mezclar los dos enfoques en un mismo feature nuevo
- Inyectar servicios en el constructor, no con `inject()`
- Usar `BreakpointObserver` del CDK para adaptar layouts a mobile/desktop
- Los formularios de confirmación de borrado deben usar `DialogComponent` vía `MatDialog`

### Manejo de estado

- `PerfilService` expone el perfil activo como `BehaviorSubject`; subscribir en `ngOnInit()` y desuscribir en `ngOnDestroy()`
- `AlertaServiceService` maneja notificaciones locales sin HTTP
- No introducir estado global adicional sin discutirlo primero

### Imágenes

- Las imágenes se almacenan como base64 en el backend
- Se cargan y envían mediante `ImagenService` usando `multipart/form-data`
- No almacenar imágenes en assets locales para contenido dinámico

### Roles y acceso

- Los roles se gestionan en `PerfilService`
- Actualmente **no hay guards de ruta**; la lógica de restricción está en cada componente
- Al agregar funcionalidad sensible por rol, verificar el rol en `ngOnInit()` del componente

---

## Backlog de tareas pendientes (HU completadas en backend)

Las siguientes historias de usuario ya tienen implementación en el backend. El frontend debe integrarse.

---

### HE-03 HU-01 — Mostrar `estadoCurso` en tarjeta de curso

**Estado backend:** Completado — `GET /cursos/{id}` retorna `estadoCurso` (enum: `ACTIVO`, `INACTIVO`, `CERRADO`)

**Tareas frontend:**

1. Actualizar `CursoDto` (`src/app/Models/DTOs/curso-dto.ts`):
   añadir campo `estadoCurso: 'ACTIVO' | 'INACTIVO' | 'CERRADO'`

2. En `CursosDeportivosComponent`: mostrar una etiqueta/badge visual en cada tarjeta de curso que refleje el `estadoCurso`. Sugerencia: chip de Angular Material o badge de Bootstrap con color semántico (verde/gris/rojo).

3. No cambiar los métodos del servicio; el campo ya viene en la respuesta JSON.

**Criterio de aceptación:** Al cargar `/cursos_deportivos/:identificador`, cada tarjeta muestra visualmente su estado actual.

---

### HE-05 HU-01 — Botón deshabilitar/habilitar curso

**Estado backend:** Completado — `PATCH /cursos/{id}/estado` con body `{ "estado": "INACTIVO" | "ACTIVO" }`

**Tareas frontend:**

1. Agregar método en `cursodeportivo.service.ts`:
   ```ts
   cambiarEstadoCurso(id: number, estado: string): Observable<CursoDto>
   ```
   apuntando a `PATCH /cursos/{id}/estado`

2. En `CursosDeportivosComponent`: agregar botón "Deshabilitar" / "Habilitar" en el menú de acciones de cada tarjeta de curso. El texto del botón debe alternar según el `estadoCurso` actual.

3. Al hacer clic, llamar al servicio y refrescar la lista de cursos sin recargar la página.

4. El botón solo debe ser visible para roles con permiso de edición (no para `ESTUDIANTE`).

**Criterio de aceptación:** Un administrador puede deshabilitar un curso activo y habilitarlo nuevamente desde la vista de cursos.

---

### HE-05 HU-02 — Botón eliminar curso con confirmación

**Estado backend:** Completado — `DELETE /cursos/{id}` realiza borrado lógico (retorna 409 si ya está eliminado)

**Tareas frontend:**

1. El botón "Eliminar" ya existe en `CursosDeportivosComponent`. Verificar que:
   - Abre `DialogComponent` vía `MatDialog` para pedir confirmación antes de ejecutar el borrado.
   - Si el backend retorna **409 Conflict**, mostrar mensaje de error al usuario ("El curso ya se encuentra eliminado").
   - Tras eliminar con éxito, remover la tarjeta del listado sin recargar la página.

2. Si el flujo actual salta la confirmación, corregirlo para que siempre pase por `DialogComponent`.

**Criterio de aceptación:** Al confirmar la eliminación, el curso desaparece del listado. Si ya estaba eliminado, aparece un mensaje de error claro.

---

### HE-04 HU-02 — Mostrar campo `horario` en detalle de curso

**Estado backend:** Completado — `horario` ya se persiste y se expone en `GET /cursos/{id}` y `POST /cursos`

**Tareas frontend:**

1. Actualizar `CursoDto`: agregar campo `horario: string` (actualmente el componente muestra "Horario por Definir" hardcodeado).

2. En `InformacionCursoComponent` y en las tarjetas de `CursosDeportivosComponent`: reemplazar el texto hardcodeado por el valor `curso.horario` recibido del backend.

3. En `FormCursoDeportiviComponent`: verificar que el campo `horario` se envía en el body del POST al crear un curso.

**Criterio de aceptación:** El horario real del curso se muestra en la tarjeta y en el detalle. Al crear un curso, el horario se guarda.

---

### HE-06 HU-04 — Configurar fechas de inscripción por grupo

**Estado backend:** Completado — `PATCH /cursos/{id}/inscripciones` con body `{ "estadoInscripciones": "ABIERTO" | "CERRADO" }`

**Tareas frontend:**

1. Agregar método en `cursodeportivo.service.ts`:
   ```ts
   cambiarEstadoInscripciones(id: number, estadoInscripciones: string): Observable<CursoDto>
   ```

2. Actualizar `CursoDto`: agregar campo `estadoInscripciones: 'ABIERTO' | 'CERRADO'`

3. En `GestionInscripcionesComponent` o en la vista de `ListGruposComponent`: mostrar el estado de inscripciones del curso y agregar un botón para abrirlas/cerrarlas (solo para roles con permiso).

4. El estado debe reflejarse visualmente (e.g., badge "Inscripciones abiertas" / "Inscripciones cerradas").

**Criterio de aceptación:** Un administrador puede abrir o cerrar inscripciones de un curso desde el frontend, y el estado se actualiza visualmente de forma inmediata.
