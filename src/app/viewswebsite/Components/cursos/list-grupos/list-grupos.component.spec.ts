// Candidato a refactorización: letraDeIterable() es idéntica en ListGruposComponent,
// ListDeportistasde-cursoComponent y ReportesComponent. Mover a un pipe o util compartido
// eliminaría esta duplicación. Ver los otros .spec.ts de esta función.
//
// Estrategia de test: Object.create(prototype) permite llamar métodos de la clase sin
// instanciar a través de Angular DI (que requeriría stubs para 10 dependencias).
// Válido porque letraDeIterable no accede a `this`.

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { ListGruposComponent } from './list-grupos.component';
import { GrupoService } from 'src/app/services/grupo.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { InstructorServisce } from 'src/app/services/instructor.service';
import { HorarioService } from 'src/app/services/horario.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenInterchangeService } from 'src/app/services/token-interchange.service';
import { CursodeportivoService } from 'src/app/services/cursodeportivo.service';
import { CursoDTO } from 'src/app/Models/DTOs/curso-dto';

describe('ListGruposComponent › letraDeIterable', () => {
  let comp: ListGruposComponent;

  beforeEach(() => {
    comp = Object.create(ListGruposComponent.prototype) as ListGruposComponent;
  });

  it('1  → "A"', () => expect(comp.letraDeIterable(1)).toBe('A'));
  it('2  → "B"', () => expect(comp.letraDeIterable(2)).toBe('B'));
  it('3  → "C"', () => expect(comp.letraDeIterable(3)).toBe('C'));
  it('26 → "Z" (límite superior del alfabeto)', () => expect(comp.letraDeIterable(26)).toBe('Z'));
  it('0   → "?" (cero es falsy)', () => expect(comp.letraDeIterable(0)).toBe('?'));
  it('-1  → "?" (negativo < 1)', () => expect(comp.letraDeIterable(-1)).toBe('?'));
  it('null → "?" (null es falsy)', () => expect(comp.letraDeIterable(null)).toBe('?'));
});

describe('ListGruposComponent › alumnosGrupo', () => {
  let component: ListGruposComponent;
  let fixture: ComponentFixture<ListGruposComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let perfilSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    routerSpy     = jasmine.createSpyObj('Router', ['navigate']);
    perfilSubject = new BehaviorSubject<string>('');

    await TestBed.configureTestingModule({
      imports: [ListGruposComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: Router,       useValue: routerSpy },
        { provide: PerfilService, useValue: { perfil$: perfilSubject.asObservable() } },
        { provide: AuthService,  useValue: jasmine.createSpyObj('AuthService', ['login', 'logout', 'isAuthenticated', 'getProfile']) },
        { provide: TokenInterchangeService, useValue: {} },
        { provide: OAuthService, useValue: { configure: () => {}, setupAutomaticSilentRefresh: () => {}, events: of(), loadDiscoveryDocumentAndTryLogin: () => Promise.resolve(), getIdentityClaims: () => null, hasValidAccessToken: () => false, hasValidIdToken: () => false } },
        { provide: GrupoService,  useValue: { getGrupos: jasmine.createSpy().and.returnValue(of([])) } },
        { provide: CursodeportivoService, useValue: { getCurso: jasmine.createSpy().and.returnValue(of({ nombre: 'Test', deporte: 'F', categoriaCurso: 'C', descripcion: 'D', estadoCurso: 'ACTIVO', estadoInscripciones: 'ABIERTO' } as CursoDTO)) } },
        { provide: ImagenService, useValue: { getimagen: jasmine.createSpy().and.returnValue(of({})) } },
        { provide: InstructorServisce, useValue: { getInstructor: jasmine.createSpy().and.returnValue(of({})) } },
        { provide: HorarioService, useValue: { getHorarios: jasmine.createSpy().and.returnValue(of([])) } },
        { provide: MatSnackBar,  useValue: { open: jasmine.createSpy() } },
        { provide: MatDialog,    useValue: { open: jasmine.createSpy().and.returnValue({ afterClosed: () => of(null) }) } },
        { provide: BreakpointObserver, useValue: { observe: jasmine.createSpy().and.returnValue(of({ matches: false })) } },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ categoria: 'Recreativo', curso: 'Natacion' })) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(ListGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('alumnosGrupo(): rol "Alumno" navega a /inscripcion-grupo', () => {
    component.perfil = 'Alumno';
    component.alumnosGrupo('Recreativo', 'Natacion', 2026, 1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/inscripcion-grupo', 'Recreativo', 'Natacion', 2026, 1]
    );
  });

  it('alumnosGrupo(): rol "Coordinador" navega a /listaDeportistasCurso', () => {
    component.perfil = 'Coordinador';
    component.alumnosGrupo('Recreativo', 'Natacion', 2026, 2);
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/listaDeportistasCurso', 'Recreativo', 'Natacion', 2026, 2]
    );
  });

  it('loadGrupos: mantiene curso como null cuando getCurso falla', () => {
    (component['cursodeportivoService'].getCurso as jasmine.Spy)
      .and.returnValue(throwError(() => new Error('error')));
    component.curso = null;
    component['loadGrupos']('Recreativo', 'Natacion');
    expect(component.curso).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// puedeInscribirse() — pruebas con Object.create para evitar 10 dependencias DI
// ─────────────────────────────────────────────────────────────────────────────
describe('ListGruposComponent › puedeInscribirse', () => {
  let comp: ListGruposComponent;

  const cursoActivo: CursoDTO = {
    nombre: 'Test',
    deporte: 'Futbol',
    categoriaCurso: 'Deportes',
    descripcion: 'Curso de prueba',
    estadoCurso: 'ACTIVO',
    estadoInscripciones: 'ABIERTO',
  };

  beforeEach(() => {
    comp = Object.create(ListGruposComponent.prototype) as ListGruposComponent;
    comp.curso = cursoActivo;
    comp.categoria = 'Futbol';
  });

  it('ACTIVO + ABIERTO → true', () => {
    expect(comp.puedeInscribirse()).toBeTrue();
  });

  it('ACTIVO + CERRADO → false', () => {
    comp.curso = { ...cursoActivo, estadoInscripciones: 'CERRADO' };
    expect(comp.puedeInscribirse()).toBeFalse();
  });

  it('INACTIVO + ABIERTO → false', () => {
    comp.curso = { ...cursoActivo, estadoCurso: 'INACTIVO' };
    expect(comp.puedeInscribirse()).toBeFalse();
  });

  it('INACTIVO + CERRADO → false', () => {
    comp.curso = { ...cursoActivo, estadoCurso: 'INACTIVO', estadoInscripciones: 'CERRADO' };
    expect(comp.puedeInscribirse()).toBeFalse();
  });

  it('categoria "seleccionado" → false aunque el curso esté ACTIVO+ABIERTO', () => {
    comp.categoria = 'seleccionado';
    expect(comp.puedeInscribirse()).toBeFalse();
  });
});
