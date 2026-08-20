import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HorarioService } from './horario.service';
import { HorarioDTO } from '../Models/DTOs/horario-dto';

describe('HorarioService', () => {
  let service: HorarioService;
  let httpMock: HttpTestingController;
  const API = 'http://127.0.0.1:8082/api/v2';

  const horarioDummy: HorarioDTO = {
    id: 1,
    categoria: 'Acuáticos',
    curso: 'Natación',
    anio: 2026,
    iterable: 1,
    dia: 'Lunes',
    horaInicio: '08:00',
    horaFin: '10:00',
    escenario: 'Piscina Olímpica',
    eliminado: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HorarioService],
    });
    service = TestBed.inject(HorarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── getHorarios ───────────────────────────────────────────────────────────

  it('getHorarios: GET con categoria/curso encodeados y anio/iterable numérico directo', () => {
    service.getHorarios('Acuáticos', 'Natación', 2026, 1).subscribe(horarios => {
      expect(horarios.length).toBe(1);
      expect(horarios[0].dia).toBe('Lunes');
    });
    const req = httpMock.expectOne(
      `${API}/horarios?categoria=Acu%C3%A1ticos&curso=Nataci%C3%B3n&anio=2026&iterable=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush([horarioDummy]);
  });

  it('getHorarios: propaga error HTTP 404 (grupo sin horarios)', () => {
    let errorCapturado: any;
    service.getHorarios('Acuáticos', 'Natación', 9999, 9).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(
      `${API}/horarios?categoria=Acu%C3%A1ticos&curso=Nataci%C3%B3n&anio=9999&iterable=9`
    );
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  // ── crearHorario ──────────────────────────────────────────────────────────

  it('crearHorario: POST /horario con body completo', () => {
    service.crearHorario(horarioDummy).subscribe(resp => {
      expect(resp.id).toBe(1);
      expect(resp.escenario).toBe('Piscina Olímpica');
    });
    const req = httpMock.expectOne(`${API}/horario`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(horarioDummy);
    req.flush(horarioDummy);
  });

  it('crearHorario: propaga error HTTP 409 (horario solapado o duplicado)', () => {
    let errorCapturado: any;
    service.crearHorario(horarioDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/horario`);
    req.flush('Conflicto', { status: 409, statusText: 'Conflict' });
    expect(errorCapturado).toBeTruthy();
  });

  it('crearHorario: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.crearHorario(horarioDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/horario`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });

  // ── eliminarHorario ───────────────────────────────────────────────────────

  it('eliminarHorario: DELETE /horario?prmId={id} (id numérico, sin encode)', () => {
    service.eliminarHorario(1).subscribe(resp => {
      expect(resp).toBeDefined();
    });
    const req = httpMock.expectOne(`${API}/horario?prmId=1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });

  it('eliminarHorario: propaga error HTTP 404 (horario no existe)', () => {
    let errorCapturado: any;
    service.eliminarHorario(9999).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/horario?prmId=9999`);
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  it('eliminarHorario: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.eliminarHorario(1).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/horario?prmId=1`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });
});
