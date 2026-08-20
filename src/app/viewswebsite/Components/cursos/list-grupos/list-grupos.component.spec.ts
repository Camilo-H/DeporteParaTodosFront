// Candidato a refactorización: letraDeIterable() es idéntica en ListGruposComponent,
// ListDeportistasde-cursoComponent y ReportesComponent. Mover a un pipe o util compartido
// eliminaría esta duplicación. Ver los otros .spec.ts de esta función.
//
// Estrategia de test: Object.create(prototype) permite llamar métodos de la clase sin
// instanciar a través de Angular DI (que requeriría stubs para 10 dependencias).
// Válido porque letraDeIterable no accede a `this`.

import { ListGruposComponent } from './list-grupos.component';

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
