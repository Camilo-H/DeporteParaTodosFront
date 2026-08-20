import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriaService } from './categoria.service';
import { CategoriaDTO } from '../Models/DTOs/categoria-dto';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;
  const API = 'http://127.0.0.1:8082/api/v2';

  const categoriaDummy: CategoriaDTO = {
    titulo: 'Acuáticos',
    descripcion: 'Deportes acuáticos',
    imagenId: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriaService],
    });
    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── BehaviorSubject (varCategoria / serCategoria) ─────────────────────────

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('varCategoria emite el valor inicial vacío ""', (done) => {
    service.varCategoria.subscribe(valor => {
      expect(valor).toBe('');
      done();
    });
  });

  it('serCategoria actualiza el valor y varCategoria lo emite', (done) => {
    service.serCategoria('Acuáticos');
    service.varCategoria.subscribe(valor => {
      expect(valor).toBe('Acuáticos');
      done();
    });
  });

  it('múltiples serCategoria: el último valor prevalece', (done) => {
    service.serCategoria('Terrestres');
    service.serCategoria('Acuáticos');
    service.varCategoria.subscribe(valor => {
      expect(valor).toBe('Acuáticos');
      done();
    });
  });

  it('estado inicial no está contaminado entre tests (aislamiento)', (done) => {
    service.varCategoria.subscribe(valor => {
      expect(valor).toBe('');
      done();
    });
  });

  // ── getCategorias ─────────────────────────────────────────────────────────

  it('getCategorias: GET /categorias2 y retorna lista', () => {
    service.getCategorias().subscribe(cats => {
      expect(cats.length).toBe(1);
      expect(cats[0].titulo).toBe('Acuáticos');
    });
    const req = httpMock.expectOne(`${API}/categorias2`);
    expect(req.request.method).toBe('GET');
    req.flush([categoriaDummy]);
  });

  it('getCategorias: retorna lista vacía cuando no hay categorías', () => {
    service.getCategorias().subscribe(cats => {
      expect(cats.length).toBe(0);
    });
    const req = httpMock.expectOne(`${API}/categorias2`);
    req.flush([]);
  });

  // ── createCategoria ───────────────────────────────────────────────────────

  it('createCategoria: POST /categoria con body correcto', () => {
    service.createCategoria(categoriaDummy).subscribe(resp => {
      expect(resp.titulo).toBe('Acuáticos');
    });
    const req = httpMock.expectOne(`${API}/categoria`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(categoriaDummy);
    req.flush(categoriaDummy);
  });

  it('createCategoria: propaga error HTTP 409 (categoría duplicada)', () => {
    let errorCapturado: any;
    service.createCategoria(categoriaDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/categoria`);
    req.flush('Ya existe', { status: 409, statusText: 'Conflict' });
    expect(errorCapturado).toBeTruthy();
  });

  // ── getCategoria ──────────────────────────────────────────────────────────

  it('getCategoria: GET con titulo en query string', () => {
    service.getCategoria('Acuáticos').subscribe(cat => {
      expect(cat.titulo).toBe('Acuáticos');
    });
    // el servicio no encodeURI en este método — la URL contiene el título literal
    const req = httpMock.expectOne(`${API}/categoria?titulo=Acuáticos`);
    expect(req.request.method).toBe('GET');
    req.flush(categoriaDummy);
  });

  it('getCategoria: propaga error HTTP 404 (no existe)', () => {
    let errorCapturado: any;
    service.getCategoria('Inexistente').subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/categoria?titulo=Inexistente`);
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  // ── updateCategoria ───────────────────────────────────────────────────────

  it('updateCategoria: PUT con titulo en query string y body correcto', () => {
    const actualizada: CategoriaDTO = { ...categoriaDummy, descripcion: 'Actualizada' };
    service.updateCategoria('Acuáticos', actualizada).subscribe(resp => {
      expect(resp.descripcion).toBe('Actualizada');
    });
    // el servicio no encodeURI en este método — la URL contiene el título literal
    const req = httpMock.expectOne(`${API}/categoria?titulo=Acuáticos`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(actualizada);
    req.flush(actualizada);
  });

  it('updateCategoria: propaga error HTTP 404 (categoría no existe)', () => {
    let errorCapturado: any;
    service.updateCategoria('Inexistente', categoriaDummy).subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/categoria?titulo=Inexistente`);
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  // ── deleteCategoria ───────────────────────────────────────────────────────

  it('deleteCategoria: DELETE con titulo encodeado', () => {
    service.deleteCategoria('Acuáticos').subscribe(resp => {
      expect(resp).toBeDefined();
    });
    const req = httpMock.expectOne(`${API}/categoria?titulo=Acu%C3%A1ticos`);
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });

  it('deleteCategoria: propaga error HTTP 404 (no existe)', () => {
    let errorCapturado: any;
    service.deleteCategoria('Inexistente').subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/categoria?titulo=Inexistente`);
    req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    expect(errorCapturado).toBeTruthy();
  });

  it('deleteCategoria: propaga error HTTP 409 (ya eliminada)', () => {
    let errorCapturado: any;
    service.deleteCategoria('Acuáticos').subscribe({
      next: () => fail('debería haber fallado'),
      error: err => (errorCapturado = err),
    });
    const req = httpMock.expectOne(`${API}/categoria?titulo=Acu%C3%A1ticos`);
    req.flush('Conflicto', { status: 409, statusText: 'Conflict' });
    expect(errorCapturado).toBeTruthy();
  });
});
