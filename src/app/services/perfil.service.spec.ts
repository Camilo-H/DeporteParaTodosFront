import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PerfilService } from './perfil.service';
import { PerfilDTO } from '../Models/DTOs/perfil-tdo';

describe('PerfilService', () => {
  let service: PerfilService;
  let httpMock: HttpTestingController;
  const API = 'http://127.0.0.1:8082/api/v2';

  // TestBed.configureTestingModule en beforeEach garantiza una instancia
  // nueva del servicio (y por tanto un BehaviorSubject nuevo) en cada test,
  // eliminando cualquier dependencia de orden de ejecución.
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PerfilService],
    });
    service = TestBed.inject(PerfilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const perfilDummy: PerfilDTO = {
    id: 0,
    nombre: 'Ana Ruiz',
    correo: 'ana@unicauca.edu.co',
    tipoId: 'CC',
    sexo: 'F',
    facultad: '',
    tipoAlumno: 'Estudiante',
    role: '',
    alumnoCodigo: 'A123',
  };

  // ── BehaviorSubject ──────────────────────────────────────────────────────

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('perfil$ emite el valor inicial "Administrador"', (done) => {
    service.perfil$.subscribe(valor => {
      expect(valor).toBe('Administrador');
      done();
    });
  });

  it('getPerfil retorna el valor inicial "Administrador"', () => {
    expect(service.getPerfil()).toBe('Administrador');
  });

  it('setPerfil actualiza el valor y perfil$ emite el nuevo valor', (done) => {
    service.setPerfil('Estudiante');
    service.perfil$.subscribe(valor => {
      expect(valor).toBe('Estudiante');
      done();
    });
  });

  it('setPerfil actualiza getPerfil sincrónicamente', () => {
    service.setPerfil('Instructor');
    expect(service.getPerfil()).toBe('Instructor');
  });

  it('múltiples setPerfil: el último valor prevalece', () => {
    service.setPerfil('Estudiante');
    service.setPerfil('Instructor');
    service.setPerfil('Administrador');
    expect(service.getPerfil()).toBe('Administrador');
  });

  it('estado inicial no está contaminado por tests anteriores (aislamiento)', () => {
    // Cada test recibe una instancia nueva — el BehaviorSubject siempre
    // arranca en 'Administrador' sin importar el orden de ejecución.
    expect(service.getPerfil()).toBe('Administrador');
  });

  // ── registrarPerfil ──────────────────────────────────────────────────────

  it('registrarPerfil: POST /RegistroPerfilAlumno con body correcto', () => {
    service.registrarPerfil(perfilDummy).subscribe(resp => {
      expect(resp.nombre).toBe('Ana Ruiz');
      expect(resp.tipoAlumno).toBe('Estudiante');
    });
    const req = httpMock.expectOne(`${API}/RegistroPerfilAlumno`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(perfilDummy);
    req.flush(perfilDummy);
  });

  it('registrarPerfil: propaga error HTTP 409 (perfil duplicado)', () => {
    let errorCapturado: any;
    service.registrarPerfil(perfilDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/RegistroPerfilAlumno`);
    req.flush('Ya existe', { status: 409, statusText: 'Conflict' });
    expect(errorCapturado).toBeTruthy();
  });

  it('registrarPerfil: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.registrarPerfil(perfilDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/RegistroPerfilAlumno`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });

  // ── registrarInstructor ──────────────────────────────────────────────────

  it('registrarInstructor: POST /RegistroPerfilInstructor con tipoAlumno Docente', () => {
    const instructor: PerfilDTO = {
      ...perfilDummy,
      tipoAlumno: 'Docente',
      role: 'Instructor',
    };
    service.registrarInstructor(instructor).subscribe(resp => {
      expect(resp.tipoAlumno).toBe('Docente');
      expect(resp.role).toBe('Instructor');
    });
    const req = httpMock.expectOne(`${API}/RegistroPerfilInstructor`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.tipoAlumno).toBe('Docente');
    expect(req.request.body.role).toBe('Instructor');
    req.flush(instructor);
  });

  it('registrarInstructor: propaga error HTTP 409 (instructor duplicado)', () => {
    let errorCapturado: any;
    service.registrarInstructor(perfilDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/RegistroPerfilInstructor`);
    req.flush('Ya existe', { status: 409, statusText: 'Conflict' });
    expect(errorCapturado).toBeTruthy();
  });

  it('registrarInstructor: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.registrarInstructor(perfilDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/RegistroPerfilInstructor`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });
});
