import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HorarioDTO } from 'src/app/Models/DTOs/horario-dto';
import { EscenarioDTO } from 'src/app/Models/DTOs/escenario-dto';
import { HorarioService } from 'src/app/services/horario.service';
import { EscenarioService } from 'src/app/services/escenario.service';

@Component({
  selector: 'app-form-horario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './form-horario.component.html',
  styleUrls: ['./form-horario.component.css'],
})
export class FormHorarioComponent implements OnInit {

  horarios: HorarioDTO[] = [];
  escenarios: EscenarioDTO[] = [];
  confirmandoEliminacionId: number | null = null;
  cambiosRealizados = false;

  dias = [
    { label: 'Lun', valor: 'LUNES',     seleccionado: false },
    { label: 'Mar', valor: 'MARTES',    seleccionado: false },
    { label: 'Mié', valor: 'MIERCOLES', seleccionado: false },
    { label: 'Jue', valor: 'JUEVES',    seleccionado: false },
    { label: 'Vie', valor: 'VIERNES',   seleccionado: false },
    { label: 'Sáb', valor: 'SABADO',    seleccionado: false },
    { label: 'Dom', valor: 'DOMINGO',   seleccionado: false },
  ];

  horaInicio = '';
  horaFin = '';
  escenarioSeleccionado = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { categoria: string; curso: string; anio: number; iterable: number },
    private dialogRef: MatDialogRef<FormHorarioComponent>,
    private horarioService: HorarioService,
    private escenarioService: EscenarioService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cargarHorarios();
    this.escenarioService.getEscenarios().subscribe({
      next: (data: any) => { this.escenarios = Array.isArray(data) ? data.filter((e: EscenarioDTO) => e.disponible) : []; },
      error: () => {
        this.snackBar.open('Error al cargar escenarios', 'Cerrar', { duration: 3000, panelClass: ['snack-error'] });
      },
    });
  }

  private cargarHorarios(): void {
    this.horarioService
      .getHorarios(this.data.categoria, this.data.curso, this.data.anio, this.data.iterable)
      .subscribe({
        next: (data: any) => { this.horarios = Array.isArray(data) ? data : []; },
        error: () => {},
      });
  }

  puedeGuardar(): boolean {
    return (
      this.dias.some(d => d.seleccionado) &&
      !!this.horaInicio &&
      !!this.horaFin &&
      !!this.escenarioSeleccionado
    );
  }

  guardar(): void {
    const peticiones = this.dias
      .filter(d => d.seleccionado)
      .map(d =>
        this.horarioService.crearHorario({
          id: 0,
          categoria: this.data.categoria,
          curso: this.data.curso,
          anio: this.data.anio,
          iterable: this.data.iterable,
          dia: d.valor,
          horaInicio: this.horaInicio,
          horaFin: this.horaFin,
          escenario: this.escenarioSeleccionado,
          eliminado: 0,
        })
      );

    forkJoin(peticiones).subscribe({
      next: () => {
        this.cambiosRealizados = true;
        this.dias.forEach(d => (d.seleccionado = false));
        this.horaInicio = '';
        this.horaFin = '';
        this.escenarioSeleccionado = '';
        this.cargarHorarios();
        this.snackBar.open('Horario(s) agregado(s) correctamente', 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
      },
      error: () => {
        this.snackBar.open('Error al agregar horario(s)', 'Cerrar', { duration: 3000, panelClass: ['snack-error'] });
      },
    });
  }

  confirmarEliminacion(id: number): void {
    this.confirmandoEliminacionId = id;
  }

  cancelarEliminacion(): void {
    this.confirmandoEliminacionId = null;
  }

  eliminarHorario(id: number): void {
    this.horarioService.eliminarHorario(id).subscribe({
      next: () => {
        this.horarios = this.horarios.filter(h => h.id !== id);
        this.confirmandoEliminacionId = null;
        this.cambiosRealizados = true;
        this.snackBar.open('Horario eliminado correctamente', 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
      },
      error: () => {
        this.confirmandoEliminacionId = null;
        this.snackBar.open('Error al eliminar el horario', 'Cerrar', { duration: 3000, panelClass: ['snack-error'] });
      },
    });
  }

  onCerrar(): void {
    this.dialogRef.close(this.cambiosRealizados);
  }
}
