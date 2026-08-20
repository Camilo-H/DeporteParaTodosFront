import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlumnoService } from './alumno.service';
import { AlumnoDTO } from '../Models/DTOs/alumno-dto';

describe('AlumnoService', () => {
  let service: AlumnoService;
  let httpMock: HttpTestingController;
  const API = 'http://127.0.0.1:8082/api/v2';

  const alumnoDummy: AlumnoDTO = {
    id: 42,
    codigo: 'A123',
    tipo: 'Estudiante',
    nombre: 'Ana Ruiz',
    correo: 'ana@unicauca.edu.co',
    sexo: 'F',
    tipoid: 'CC',
    imagen: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlumnoService],
    });
    service = TestBed.inject(AlumnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── getAlumnosGrupo ───────────────────────────────────────────────────────

  it('getAlumnosGrupo: GET /alumnosGrupo con los 4 params encodeados y retorna lista', () => {
    service.getAlumnosGrupo('Acuáticos', 'Natación', 2026, 1).subscribe(alumnos => {
      expect(alumnos.length).toBe(1);
      expect(alumnos[0].nombre).toBe('Ana Ruiz');
    });
    const req = httpMock.expectOne(
      `${API}/alumnosGrupo?categoria=Acu%C3%A1ticos&curso=Nataci%C3%B3n&anio=2026&iterable=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush([alumnoDummy]);
  });

  it('getAlumnosGrupo: retorna lista vacía cuando el grupo no tiene alumnos', () => {
    service.getAlumnosGrupo('Acuáticos', 'Natación', 2026, 1).subscribe(alumnos => {
      expect(alumnos.length).toBe(0);
    });
    const req = httpMock.expectOne(
      `${API}/alumnosGrupo?categoria=Acu%C3%A1ticos&curso=Nataci%C3%B3n&anio=2026&iterable=1`
    );
    req.flush([]);
  });

  it('getAlumnosGrupo: propaga error HTTP 404 (grupo no existe)', () => {
    let errorCapturado: any;
    service.getAlumnosGrupo('Acuáticos', 'Natación', 9999, 99).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(
      `${API}/alumnosGrupo?categoria=Acu%C3%A1ticos&curso=Nataci%C3%B3n&anio=9999&iterable=99`
    );
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  // ── actualizarAlumno ──────────────────────────────────────────────────────

  it('actualizarAlumno: PUT /alumnos/{id} con body correcto (caso exitoso)', () => {
    const payload = { nombre: 'Ana Ruiz', correo: 'ana@unicauca.edu.co', tipoAlumno: 'Estudiante' };
    service.actualizarAlumno(42, payload).subscribe(resp => {
      expect(resp.id).toBe(42);
      expect(resp.nombre).toBe('Ana Ruiz');
    });
    const req = httpMock.expectOne(`${API}/alumnos/42`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...alumnoDummy });
  });

  it('actualizarAlumno: solo los 3 campos editables van en el body (nombre, correo, tipoAlumno)', () => {
    const payload = { nombre: 'Carlos López', correo: 'carlos@unicauca.edu.co', tipoAlumno: 'Docente' };
    service.actualizarAlumno(7, payload).subscribe();
    const req = httpMock.expectOne(`${API}/alumnos/7`);
    expect(req.request.body.nombre).toBe('Carlos López');
    expect(req.request.body.correo).toBe('carlos@unicauca.edu.co');
    expect(req.request.body.tipoAlumno).toBe('Docente');
    // no deben ir campos extra como id, codigo, etc.
    expect(req.request.body.id).toBeUndefined();
    expect(req.request.body.codigo).toBeUndefined();
    req.flush({ ...alumnoDummy, nombre: 'Carlos López' });
  });

  it('actualizarAlumno: el id va en el path, no en el body', () => {
    const payload = { nombre: 'Ana Ruiz', correo: 'ana@unicauca.edu.co', tipoAlumno: 'Estudiante' };
    service.actualizarAlumno(42, payload).subscribe();
    const req = httpMock.expectOne(`${API}/alumnos/42`);
    expect(req.request.url).toContain('/alumnos/42');
    req.flush(alumnoDummy);
  });

  it('actualizarAlumno: propaga error HTTP 404 (alumno no encontrado)', () => {
    let errorCapturado: any;
    service.actualizarAlumno(9999, { nombre: 'X', correo: 'x@x.com', tipoAlumno: 'Estudiante' }).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/alumnos/9999`);
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  it('actualizarAlumno: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.actualizarAlumno(42, { nombre: 'Ana Ruiz', correo: 'ana@unicauca.edu.co', tipoAlumno: 'Estudiante' }).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/alumnos/42`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });
});
