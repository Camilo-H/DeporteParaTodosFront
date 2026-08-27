import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TokenInterchangeService } from './token-interchange.service';

const API = 'http://127.0.0.1:8082/api/v2';

describe('TokenInterchangeService', () => {
  let service: TokenInterchangeService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenInterchangeService,
        { provide: Router, useValue: routerSpy },
      ],
    });
    service = TestBed.inject(TokenInterchangeService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.removeItem('dpt_token');
  });

  afterEach(() => {
    sessionStorage.removeItem('dpt_token');
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('POST /auth/token envía idToken en header Authorization: Bearer', () => {
    service.exchangeGoogleToken('my-id-token').subscribe();
    const req = httpMock.expectOne(`${API}/auth/token`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-id-token');
    expect(req.request.body).toEqual({});
    req.flush({ token: 'dpt-token-xyz' });
  });

  it('respuesta 200: guarda dpt_token en sessionStorage y el Observable completa', () => {
    let completed = false;
    service.exchangeGoogleToken('id-tok').subscribe({
      complete: () => { completed = true; },
    });
    const req = httpMock.expectOne(`${API}/auth/token`);
    req.flush({ token: 'guardado-token' });
    expect(sessionStorage.getItem('dpt_token')).toBe('guardado-token');
    expect(completed).toBeTrue();
  });

  it('respuesta 404: navega a /completar-perfil y retorna EMPTY (sin error)', () => {
    let errorCalled = false;
    let nextCalled = false;
    service.exchangeGoogleToken('id-tok').subscribe({
      next: () => { nextCalled = true; },
      error: () => { errorCalled = true; },
    });
    const req = httpMock.expectOne(`${API}/auth/token`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/completar-perfil']);
    expect(errorCalled).toBeFalse();
    expect(nextCalled).toBeFalse();
    expect(sessionStorage.getItem('dpt_token')).toBeNull();
  });

  it('respuesta 500: propaga el error y no navega', () => {
    let errorCaptured: any;
    service.exchangeGoogleToken('id-tok').subscribe({
      next: () => fail('no debería emitir next'),
      error: err => { errorCaptured = err; },
    });
    const req = httpMock.expectOne(`${API}/auth/token`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    expect(errorCaptured.status).toBe(500);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('dpt_token')).toBeNull();
  });

  it('respuesta 401: propaga el error y no navega', () => {
    let errorCaptured: any;
    service.exchangeGoogleToken('bad-token').subscribe({
      next: () => fail('no debería emitir next'),
      error: err => { errorCaptured = err; },
    });
    const req = httpMock.expectOne(`${API}/auth/token`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(errorCaptured.status).toBe(401);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
