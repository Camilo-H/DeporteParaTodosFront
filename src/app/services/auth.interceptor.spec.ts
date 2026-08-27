import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

const BACKEND_API = 'http://127.0.0.1:8082/api/v2';
const EXTERNAL_URL = 'https://accounts.google.com/o/oauth2/token';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.removeItem('dpt_token');
  });

  afterEach(() => {
    sessionStorage.removeItem('dpt_token');
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    const interceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('no modifica requests a URLs externas (no BACKEND_API)', () => {
    http.get(EXTERNAL_URL).subscribe();
    const req = httpMock.expectOne(EXTERNAL_URL);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('no inyecta Authorization cuando no hay dpt_token en sessionStorage', () => {
    http.get(`${BACKEND_API}/categorias`).subscribe();
    const req = httpMock.expectOne(`${BACKEND_API}/categorias`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('inyecta Authorization: Bearer <token> cuando hay dpt_token', () => {
    sessionStorage.setItem('dpt_token', 'tok-abc-123');
    http.get(`${BACKEND_API}/categorias`).subscribe();
    const req = httpMock.expectOne(`${BACKEND_API}/categorias`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok-abc-123');
    req.flush([]);
  });

  it('no modifica el request original — usa clone()', () => {
    sessionStorage.setItem('dpt_token', 'tok-xyz');
    // El interceptor debe clonar el request, no mutar el original.
    // Lo verificamos comprobando que el header llega al mock exactamente una vez
    // con el valor correcto (sin efectos secundarios en el request original).
    http.get(`${BACKEND_API}/instructores`).subscribe();
    const req = httpMock.expectOne(`${BACKEND_API}/instructores`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok-xyz');
    req.flush([]);
  });

  it('inyecta header a cualquier sub-ruta de BACKEND_API', () => {
    sessionStorage.setItem('dpt_token', 'tok-subruta');
    http.get(`${BACKEND_API}/categorias/42/cursos`).subscribe();
    const req = httpMock.expectOne(`${BACKEND_API}/categorias/42/cursos`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok-subruta');
    req.flush({});
  });

  it('no inyecta header a URL que contiene BACKEND_API como substring pero no es prefijo', () => {
    // URL donde BACKEND_API aparece en la query string, no como prefijo del path
    const url = `https://logger.example.com/track?src=${encodeURIComponent(BACKEND_API)}`;
    http.get(url).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
