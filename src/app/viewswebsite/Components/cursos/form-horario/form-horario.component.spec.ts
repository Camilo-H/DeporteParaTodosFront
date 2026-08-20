// Estrategia: Object.create(prototype) — instancia el prototipo sin Angular DI.
// Válido porque puedeGuardar() solo accede a propiedades de instancia (dias,
// horaInicio, horaFin, escenarioSeleccionado) que se inicializan manualmente
// en cada test. El constructor (que requiere MAT_DIALOG_DATA, MatDialogRef,
// HorarioService, EscenarioService, MatSnackBar) no se invoca.

import { FormHorarioComponent } from './form-horario.component';

describe('FormHorarioComponent › puedeGuardar()', () => {
  let comp: FormHorarioComponent;

  beforeEach(() => {
    comp = Object.create(FormHorarioComponent.prototype) as FormHorarioComponent;

    // Estado base: días con la misma estructura que la clase real, todos sin seleccionar
    comp.dias = [
      { label: 'Lun', valor: 'LUNES',     seleccionado: false },
      { label: 'Mar', valor: 'MARTES',    seleccionado: false },
      { label: 'Mié', valor: 'MIERCOLES', seleccionado: false },
      { label: 'Jue', valor: 'JUEVES',    seleccionado: false },
      { label: 'Vie', valor: 'VIERNES',   seleccionado: false },
      { label: 'Sáb', valor: 'SABADO',    seleccionado: false },
      { label: 'Dom', valor: 'DOMINGO',   seleccionado: false },
    ];
    comp.horaInicio = '';
    comp.horaFin = '';
    comp.escenarioSeleccionado = '';
  });

  it('ningún día seleccionado → false', () => {
    expect(comp.puedeGuardar()).toBeFalse();
  });

  it('día seleccionado pero sin horaInicio → false', () => {
    comp.dias[0].seleccionado = true;
    expect(comp.puedeGuardar()).toBeFalse();
  });

  it('día + horaInicio pero sin horaFin → false', () => {
    comp.dias[0].seleccionado = true;
    comp.horaInicio = '08:00';
    expect(comp.puedeGuardar()).toBeFalse();
  });

  it('día + horaInicio + horaFin pero sin escenario → false', () => {
    comp.dias[0].seleccionado = true;
    comp.horaInicio = '08:00';
    comp.horaFin = '10:00';
    expect(comp.puedeGuardar()).toBeFalse();
  });

  it('todo completo (un día) → true', () => {
    comp.dias[0].seleccionado = true;
    comp.horaInicio = '08:00';
    comp.horaFin = '10:00';
    comp.escenarioSeleccionado = 'Piscina Olímpica';
    expect(comp.puedeGuardar()).toBeTrue();
  });

  it('múltiples días seleccionados + todo completo → true', () => {
    comp.dias[0].seleccionado = true;
    comp.dias[2].seleccionado = true;
    comp.dias[4].seleccionado = true;
    comp.horaInicio = '14:00';
    comp.horaFin = '16:00';
    comp.escenarioSeleccionado = 'Cancha Cubierta';
    expect(comp.puedeGuardar()).toBeTrue();
  });
});
