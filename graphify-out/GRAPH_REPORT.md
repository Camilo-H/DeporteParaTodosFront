# Graph Report - src  (2026-09-21)

## Corpus Check
- Corpus is ~39,598 words - fits in a single context window. You may not need a graph.

## Summary
- 491 nodes · 1449 edges · 18 communities (11 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17

## God Nodes (most connected - your core abstractions)
1. `PerfilService` - 36 edges
2. `ReportesComponent` - 24 edges
3. `CursoDTO` - 23 edges
4. `AuthService` - 23 edges
5. `CursodeportivoService` - 22 edges
6. `GrupoService` - 21 edges
7. `ImagenService` - 20 edges
8. `GrupoDTO` - 19 edges
9. `CategoriaService` - 19 edges
10. `InstructorServisce` - 18 edges

## Surprising Connections (you probably didn't know these)
- `ReportesComponent` --references--> `CategoriaDTO`  [EXTRACTED]
  app/viewswebsite/Components/estadisticas/reportes/reportes.component.ts → app/Models/DTOs/categoria-dto.ts
- `ListGruposComponent` --references--> `CursoDTO`  [EXTRACTED]
  app/viewswebsite/Components/cursos/list-grupos/list-grupos.component.ts → app/Models/DTOs/curso-dto.ts
- `ReportesComponent` --references--> `CursoDTO`  [EXTRACTED]
  app/viewswebsite/Components/estadisticas/reportes/reportes.component.ts → app/Models/DTOs/curso-dto.ts
- `FormGruposComponent` --references--> `GrupoDTO`  [EXTRACTED]
  app/viewswebsite/Components/cursos/form-grupos/form-grupos.component.ts → app/Models/DTOs/grupo-dto.ts
- `ListDeportistasdeCursoComponent` --references--> `GrupoDTO`  [EXTRACTED]
  app/viewswebsite/Components/cursos/list-deportistasde-curso/list-deportistasde-curso.component.ts → app/Models/DTOs/grupo-dto.ts

## Import Cycles
- None detected.

## Communities (18 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (31): PerfilDTO, AlumnoService, Injectable, AuthService, Injectable, PerfilService, Injectable, mockPerfilAdmin (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (12): CursoDTO, DeporteDTO, CursodeportivoService, Injectable, DeporteService, Injectable, CursosDeportivosComponent, Component (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (29): routes, TODO: Al crear un curso deportivo se requiere que si el deporte no se encuentra…, DialogComponent, Component, EstadoBusqueda, SidenavComponent, Component, ref_angular_common (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (13): GrupoDTO, HorarioDTO, InscripcionDTO, GrupoService, Injectable, HorarioService, Injectable, InscripcionesService (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (11): CategoriaDTO, ImagenDTO, CategoriaService, Injectable, ImagenService, Injectable, NuevoCursoCategoriaComponent, Component (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (12): EstadisticasDTO, ReportesService, Injectable, ReportesComponent, Component, ref_angular_material_sort, ref_angular_material_tabs, ref_html2canvas (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (20): AppComponent, Component, AppModule, NgModule, AppRoutingModule, NgModule, AlertaDTO, AlertaServiceService (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (9): AlumnoDTO, AtencionDTO, ClaseDTO, AsistenciaService, Injectable, ClaseService, Injectable, ListDeportistasdeCursoComponent (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (9): InstructorDTO, PerfilInstructor, InstructorServisce, Injectable, FormGruposComponent, Component, Inject, ListaInstructoresComponent (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (6): EscenarioDTO, EscenarioService, Injectable, FormHorarioComponent, Component, Inject

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (4): FormInscripcionesComponent, Component, Inject, Optional

## Knowledge Gaps
- **11 isolated node(s):** `PerfilInstructor`, `routes`, `mockPerfilAdmin`, `mockCurso`, `mockGrupo` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 164 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ReportesComponent` connect `Community 5` to `Community 1`, `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `PerfilService` connect `Community 0` to `Community 10`, `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `ListDeportistasdeCursoComponent` connect `Community 7` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `PerfilInstructor`, `routes`, `mockPerfilAdmin` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07382091592617908 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06219426974143955 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07908163265306123 - nodes in this community are weakly interconnected._