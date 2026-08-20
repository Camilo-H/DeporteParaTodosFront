import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EscenarioService } from './escenario.service';
import { EscenarioDTO } from '../Models/DTOs/escenario-dto';

describe('EscenarioService', () => {
  let service: EscenarioService;
  let httpMock: HttpTestingController;
  const API = 'http://127.0.0.1:8082/api/v2';

  const escenarioDummy: EscenarioDTO = {
    id: 1,
    nombre: 'Piscina Olímpica',
    descripcion: 'Piscina principal del campus',
    numTribunas: 500,
    disponible: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EscenarioService],
    });
    service = TestBed.inject(EscenarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── getEscenarios ─────────────────────────────────────────────────────────

  it('getEscenarios: GET /escenarios y retorna lista', () => {
    service.getEscenarios().subscribe(lista => {
      expect(lista.length).toBe(1);
      expect(lista[0].nombre).toBe('Piscina Olímpica');
      expect(lista[0].disponible).toBeTrue();
    });
    const req = httpMock.expectOne(`${API}/escenarios`);
    expect(req.request.method).toBe('GET');
    req.flush([escenarioDummy]);
  });

  it('getEscenarios: propaga error HTTP 500', () => {
    let errorCapturado: any;
    service.getEscenarios().subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/escenarios`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    expect(errorCapturado).toBeTruthy();
  });
});
