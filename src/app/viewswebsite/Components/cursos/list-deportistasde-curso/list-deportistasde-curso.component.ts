import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnoService } from 'src/app/services/alumno.service';
import { ActivatedRoute } from '@angular/router';
import { AlumnoDTO } from 'src/app/Models/DTOs/alumno-dto';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GrupoDTO } from 'src/app/Models/DTOs/grupo-dto';
import { GrupoService } from 'src/app/services/grupo.service';
import { InstructorServisce } from 'src/app/services/instructor.service';

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
    MatIconModule
  ],
  templateUrl: './list-deportistasde-curso.component.html',
  styleUrls: ['./list-deportistasde-curso.component.css'],
})
export class ListDeportistasdeCursoComponent implements OnInit {

  categoria: string | null = '';
  titulo: string | null = '';
  anio: number | null = null;
  iterable: number | null = null;
  alumnos: AlumnoDTO[] = [];
  displayedColumns: string[] = ['Código', 'Nombre', 'Correo', 'Acciones'];

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

    this.grupoService.getGrupo(this.categoria!, this.titulo!, this.anio!, this.iterable!).subscribe(
      (grupoTemp) => {
        this.grupo = grupoTemp;
        this.consultarInstructor(grupoTemp.idInstructor!);
      }
    );

    this.alumnoService.getAlumnosGrupo(this.categoria!, this.titulo!, this.anio!, this.iterable!).subscribe(
      (alumno) => {
        this.alumnos = alumno;
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

  editarAlumno() {
    console.log('Editar',);
    // Lógica para editar
  }

  eliminarAlumno() {
    console.log('Eliminar',);
    // Lógica para eliminar
  }

}
