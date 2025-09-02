import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
/**Dependencia Material */
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DialogComponent } from '../../genericos/dialog/dialog.component';
import { MatDialog, MatDialogModule, } from '@angular/material/dialog';
import { FormCursoDeportiviComponent } from '../../cursos/form-curso-deportivo/form-curso-deportivi.component';
import { FormInscripcionesComponent } from '../../usuarios/form-inscripciones/form-inscripciones.component';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import * as bootstrap from 'bootstrap';
import { CursoDTO } from 'src/app/Models/DTOs/curso-dto';
import { GestionInscripcionesComponent } from '../gestion-inscripciones/gestion-inscripciones.component';
import { PerfilService } from 'src/app/services/perfil.service';
import { CursodeportivoService } from 'src/app/services/cursodeportivo.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cursos-deportivos',
  standalone: true,
  templateUrl: './cursos-deportivos.component.html',
  styleUrls: ['./cursos-deportivos.component.css'],
  imports: [
    CommonModule,
    MatGridListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    //DialogComponent,
    MatDialogModule,
    //FormularioComponent,
    SidenavComponent,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,

  ],
})
export class CursosDeportivosComponent implements OnInit {
  public colsize = 3;
  public isMobile: boolean = false;
  public cursos: CursoDTO[] = [];
  public cursoSeleccionado: CursoDTO | null = null;
  public titulo: string | null = null;
  perfil?: string;

  constructor(
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private cursoService: CursodeportivoService,
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private imagenServise: ImagenService,
  ) { }

  ngOnInit(): void {
    this.titulo = this.route.snapshot.paramMap.get('identificador');
    if (this.titulo) {
      this.loadCursos(this.titulo);
    }

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

  private loadCursos(categoria: any): void {
    this.cursoService.getCursos(categoria).subscribe(
      (cursotemp) => {
        this.cursos = cursotemp;

        this.cursos.forEach(
          (itemCurso) => {
            if (itemCurso.idImagen != null) {
              this.imagenServise.getimagen(itemCurso.idImagen).subscribe(
                (imagenData) => {
                  itemCurso.imagenBase64 = imagenData.datosBase64;
                  itemCurso.tipoArchivo = imagenData.tipoArchivo;
                },
                (error) => {
                  console.error(`Error al obtener la imagen del curso ${itemCurso.nombre}`, error);
                }
              );
            }
          }
        );
      },
      (error) => console.error('Error al obtener los cursos', error)
    );
  }

  verInformacion(item: CursoDTO): void {
    this.cursoSeleccionado = item;
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  gruposCurso(categoria: string, curso: string) {
    this.router.navigate(['/list-grupos', categoria, curso]); //Mandar aquí el nombre de la categoría para listar los grupos
  }

  inscribirseAcurso(): void {
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }

  registroDeporte(): void {
    const dialogRef = this.dialog.open(FormCursoDeportiviComponent, {

      data: { tituloCategoria: this.titulo },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCursos(this.titulo);
      }
    });
  }

  onUpdate(nombrecurso: string) {
    const dialogRef = this.dialog.open(FormCursoDeportiviComponent, {
      data: { tituloCategoria: this.titulo, nombrecurso },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCursos(this.titulo);
      }
    });
  }

  onDelete(identificador: string): void {
    let elemento: string = ' el curso ';
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { elemento, identificador },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmado) {
        this.loadCursos(identificador);
      }
    });
  }

  configurarInscripcion() {
    const dialogRef = this.dialog.open(GestionInscripcionesComponent, {
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }
}
