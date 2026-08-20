import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionDTO } from '../Models/DTOs/inscripcion-dto';

describe('InscripcionesService', () => {
  let service: InscripcionesService;
  let httpMock: HttpTestingController;
  const API = 'http://127.0.0.1:8082/api/v2';

  const inscripcionDummy: InscripcionDTO = {
    fechaInscripcion: '2026-08-19',
    fechaDesvinculacion: '',
    alumnoId: 42,
    categoria: 'Acuáticos',
    curso: 'Natación',
    anio: 2026,
    iterable: 1,
    eliminado: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InscripcionesService],
    });
    service = TestBed.inject(InscripcionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // postInscripcion
  it('postInscripcion: POST /inscripcion con body correcto', () => {
    service.postInscripcion(inscripcionDummy).subscribe(resp => {
      expect(resp.alumnoId).toBe(42);
      expect(resp.eliminado).toBe(0);
    });
    const req = httpMock.expectOne(`${API}/inscripcion`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(inscripcionDummy);
    req.flush(inscripcionDummy);
  });

  it('postInscripcion: propaga error HTTP 409 (ya inscrito)', () => {
    let errorCapturado: any;
    service.postInscripcion(inscripcionDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/inscripcion`);
    req.flush('Ya inscrito', { status: 409, statusText: 'Conflict' });
    expect(errorCapturado).toBeTruthy();
  });

  it('postInscripcion: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.postInscripcion(inscripcionDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/inscripcion`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });

  // eliminarInscripcion
  it('eliminarInscripcion: PUT /desvincularInscripcion con body correcto', () => {
    const desvinculacion: InscripcionDTO = {
      ...inscripcionDummy,
      fechaDesvinculacion: '2026-08-19',
      eliminado: 1,
    };
    service.eliminarInscripcion(desvinculacion).subscribe(resp => {
      expect(resp.eliminado).toBe(1);
      expect(resp.fechaDesvinculacion).toBe('2026-08-19');
    });
    const req = httpMock.expectOne(`${API}/desvincularInscripcion`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(desvinculacion);
    req.flush(desvinculacion);
  });

  it('eliminarInscripcion: solo los 5 campos mínimos también llegan al endpoint', () => {
    const soloClaves = {
      alumnoId: 42,
      categoria: 'Acuáticos',
      curso: 'Natación',
      anio: 2026,
      iterable: 1,
    } as any;
    service.eliminarInscripcion(soloClaves).subscribe(resp => {
      expect(resp).toBeDefined();
    });
    const req = httpMock.expectOne(`${API}/desvincularInscripcion`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.alumnoId).toBe(42);
    expect(req.request.body.curso).toBe('Natación');
    req.flush(soloClaves);
  });

  it('eliminarInscripcion: propaga error HTTP 404 (inscripción no encontrada)', () => {
    let errorCapturado: any;
    service.eliminarInscripcion(inscripcionDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/desvincularInscripcion`);
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  it('eliminarInscripcion: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.eliminarInscripcion(inscripcionDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/desvincularInscripcion`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });
});
