import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGruposComponent } from '../../cursos/form-grupos/form-grupos.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CursoDTO } from 'src/app/Models/DTOs/curso-dto';
import { GrupoDTO } from 'src/app/Models/DTOs/grupo-dto';
import { GrupoService } from 'src/app/services/grupo.service';
import { FormInscripcionesComponent } from '../../usuarios/form-inscripciones/form-inscripciones.component';
import { PerfilService } from 'src/app/services/perfil.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { InstructorServisce } from 'src/app/services/instructor.service';
import { HorarioService } from 'src/app/services/horario.service';
import { HorarioDTO } from 'src/app/Models/DTOs/horario-dto';

@Component({
  selector: 'app-list-grupos',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    SidenavComponent,
    NgIf,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './list-grupos.component.html',
  styleUrls: ['./list-grupos.component.css'],
})
export class ListGruposComponent implements OnInit {
  curso: CursoDTO | null = null;
  public colsize = 3;
  public isMobile: boolean = false;
  public grupos: GrupoDTO[] = [];
  categoria: string | null = '';
  titulo: string | null = '';
  perfil?: string;

  constructor(
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private grupoService: GrupoService,
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private imagenService: ImagenService,
    private instructorService: InstructorServisce,
    private horarioservice: HorarioService,
  ) { }

  inscrito: boolean = false; // Estado de la inscripción

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria');
      this.titulo = params.get('curso');
      this.loadGrupos(this.categoria, this.titulo);

    });

    this.breakPointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.colsize = 1;
        } else {
          this.colsize = 3;
        }
      });

    this.perfilService.perfil$.subscribe(perfil => {
      this.perfil = perfil;
    });
  }

  inscribirseAcurso() {
    this.inscrito = !this.inscrito;
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }

  private loadGrupos(categoria: any, nombreCurso: any): void {
    this.grupoService.getGrupos(categoria, nombreCurso).subscribe(
      (grupostemp) => {
        this.grupos = grupostemp;

        this.grupos.forEach(
          (itemgrupo) => {
            this.instructorService.getInstructor(itemgrupo.idInstructor!).subscribe(
              (instructor) => {
                itemgrupo.nombreInstructor = instructor.nombre;
              }
            );

            this.horarioservice.getHorarios(categoria, nombreCurso, itemgrupo.anio!, itemgrupo.iterable!).subscribe(
              (horarios) => {
                itemgrupo.horarios = horarios;
              }
            );

            if (itemgrupo.imagenGrupo != null) {
              this.imagenService.getimagen(itemgrupo.imagenGrupo).subscribe(
                (imagenTemp) => {
                  itemgrupo.imagenBase64 = imagenTemp.datosBase64;
                  itemgrupo.tipoArchivo = imagenTemp.tipoArchivo;
                },
              )
            }
          }
        );
      },
      (error) => console.error('Error al obtener los grupos', error)
    );
  }

  onUpdate(anio: number, iterable: number): void {
    const dialogRef = this.dialog.open(FormGruposComponent, {
      data: { categoria: this.categoria, curso: this.titulo, anio: anio, iterable }
    });
  }
  onDelete(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
    });
  }
  nuevoGrupo(): void {
    const dialogRef = this.dialog.open(FormGruposComponent, {
      data: { categoria: this.categoria, curso: this.titulo, anio: 0 }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.ngOnInit();
      }
    });
  }

  alumnosGrupo(categoria: string, curso: string, anio: number, iterable: number): void {
    if (this.perfil !== 'Estudiante') {
      this.router.navigate(['/listaDeportistasCurso', categoria, curso, anio, iterable]);
      //this.router.navigate([param]);
    } else {
      alert('No tienes permiso para acceder a esta sección, comuniquese con el administrador para más información');
    }
  }
}
