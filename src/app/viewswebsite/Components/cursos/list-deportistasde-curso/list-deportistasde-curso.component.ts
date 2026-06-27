import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AlumnoService } from 'src/app/services/alumno.service';
import { ActivatedRoute } from '@angular/router';
import { AlumnoDTO } from 'src/app/Models/DTOs/alumno-dto';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GrupoDTO } from 'src/app/Models/DTOs/grupo-dto';
import { GrupoService } from 'src/app/services/grupo.service';
import { InstructorServisce } from 'src/app/services/instructor.service';
import { HorarioService } from 'src/app/services/horario.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormInscripcionesComponent } from '../../usuarios/form-inscripciones/form-inscripciones.component';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import { InscripcionDTO } from 'src/app/Models/DTOs/inscripcion-dto';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClaseService } from 'src/app/services/clase.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { ClaseDTO } from 'src/app/Models/DTOs/clase-dto';
import { AtencionDTO } from 'src/app/Models/DTOs/atencion-dto';

@Component({
  selector: 'app-list-deportistasde-curso',
  standalone: true,
  imports: [
    CommonModule,
    SidenavComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './list-deportistasde-curso.component.html',
  styleUrls: ['./list-deportistasde-curso.component.css'],
})
export class ListDeportistasdeCursoComponent implements OnInit {

  categoria: string | null = '';
  titulo: string | null = '';
  anio: number | null = null;
  iterable: number | null = null;
  alumnos = new MatTableDataSource<AlumnoDTO>([]);
  seleccionados: any[] = [];
  displayedColumns: string[] = ['Código', 'Nombre', 'Correo', 'Faltas', 'Asistencia', 'Acciones'];
  fechaActual: Date = new Date();

  grupo: GrupoDTO = {
    categoria: '',
    curso: '',
    anio: 0,
    iterable: 0,
    imagenGrupo: 0,
    idInstructor: '',
    nombreInstructor: '',
    cupos: 0,
    fechaCreacion: '',
    fechaFinalizacion: '',
    fechaInscripcionApertura: '',
    fechaIncripcionCierre: ''
  }

  constructor(
    private alumnoService: AlumnoService,
    private route: ActivatedRoute,
    private grupoService: GrupoService,
    private instructorService: InstructorServisce,
    private horarioSerive: HorarioService,
    private inscripcionService: InscripcionesService,
    private datepipe: DatePipe,
    private dialog: MatDialog,
    private claseService: ClaseService,
    private asistenciaService: AsistenciaService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.categoria = params.get('categoria');
        this.titulo = params.get('curso');
        this.anio = Number(params.get('anio'));
        this.iterable = Number(params.get('iterable'));
      }
    );
    this.cargarDatos();
  }

  cargarDatos(): void {
    //Cargar información del grupo
    this.grupoService.getGrupo(this.categoria!, this.titulo!, this.anio!, this.iterable!).subscribe(
      (grupoTemp) => {
        this.grupo = grupoTemp;
        this.consultarInstructor(grupoTemp.idInstructor!);
        this.horarioSerive.getHorarios(this.categoria!, this.titulo!, this.anio!, this.iterable!).subscribe(
          (horario) => {
            grupoTemp.horarios = horario;
          }
        );
      }
    );

    this.alumnoService.getAlumnosGrupo(this.categoria!, this.titulo!, this.anio!, this.iterable!).subscribe(
      {
        next: (data) => {
          this.alumnos.data = Array.isArray(data) ? data : [];
        },
        error: (err) => {
          console.error('Error al traer alumnos:', err);
          this.alumnos.data = [];
        }
      }
    );
  }

  consultarInstructor(id: string): void {
    this.instructorService.getInstructor(id).subscribe(
      (instructor) => {
        this.grupo.nombreInstructor = instructor.nombre;
      }
    );
  }

  inscribirAlumno() {
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(
      (resultado) => {
        if (resultado.confirmacionCreacion) {

          const inscripcion: InscripcionDTO = {
            fechaInscripcion: this.FormatDate(this.fechaActual!),
            fechaDesvinculacion: '',
            alumnoId: resultado.idAlumno,
            categoria: this.categoria!,
            curso: this.titulo!,
            anio: this.anio!,
            iterable: this.iterable!,
            eliminado: 0,
          }
          this.inscripcionService.postInscripcion(inscripcion).subscribe(
            (response) => {
              if (response != null) {
                this.ngOnInit();
              }
            }
          );
        }
      });
  }

  private FormatDate(fecha: Date): string {
    return this.datepipe.transform(fecha, 'yyyy-MM-dd')!;
  }

  editarAlumno() {
    console.log('Editar',);
    // Lógica para editar
  }

  eliminarAlumno() {
    console.log('Eliminar',);
    // Lógica para eliminar
  }

  toggleSelection(alumno: any, event: any) {
    if (event.checked) {
      this.seleccionados.push(alumno);
    } else {
      this.seleccionados = this.seleccionados.filter(a => a !== alumno);
    }
  }

  isSelected(alumno: any): boolean {
    return this.seleccionados.includes(alumno);
  }

  registrarAsistencia() {
    const claseData: ClaseDTO = {
      codigo: 0,
      idGrupoCategoria: this.categoria!,
      idGrupoCurso: this.titulo!,
      idGrupoAnio: this.anio!,
      idGrupoIterable: this.iterable!,
      idInstructor: this.grupo.idInstructor!,
      fecha: this.FormatDate(this.fechaActual),
      horas: 1,
      minutos: 0,
      observacion: '',
      eliminado: 0,
    };

    this.claseService.postClase(claseData).subscribe({
      next: (clase) => {
        const atenciones: AtencionDTO[] = this.seleccionados.map((alumno: AlumnoDTO) => ({
          idPerfil: String(alumno.id),
          idClase: clase.codigo,
          estaAtendido: true,
        }));

        this.asistenciaService.registrarAsistencias(clase.codigo, atenciones).subscribe({
          next: () => {
            this.seleccionados = [];
            this.snackBar.open('Asistencia registrada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snack-success'],
            });
          },
          error: () => {
            this.snackBar.open('Error al registrar asistencia, intente de nuevo', 'Cerrar', {
              duration: 3000,
              panelClass: ['snack-error'],
            });
          }
        });
      },
      error: () => {
        this.snackBar.open('Error al crear la clase, intente de nuevo', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error'],
        });
      }
    });
  }


}
