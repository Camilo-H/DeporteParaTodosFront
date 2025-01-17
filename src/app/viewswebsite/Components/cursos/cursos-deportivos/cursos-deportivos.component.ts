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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormularioComponent } from '../../usuarios/formulario/formulario.component';
import { FormCursoDeportiviComponent } from '../../cursos/form-curso-deportivo/form-curso-deportivi.component';
import { FormInscripcionesComponent } from '../../usuarios/form-inscripciones/form-inscripciones.component';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { CategoriaDTO } from 'src/app/Models/DTOs/categoria-dto';
import { CategoriaService } from 'src/app/services/categoria.service';
import * as bootstrap from 'bootstrap';
import { CursoDTO } from 'src/app/Models/DTOs/curso-dto';
import { GestionInscripcionesComponent } from '../gestion-inscripciones/gestion-inscripciones.component';

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
    DialogComponent,
    MatDialogModule,
    //FormularioComponent,
    SidenavComponent,
  ],
})
export class CursosDeportivosComponent implements OnInit {
  categoria: CategoriaDTO | null = null;
  public colsize = 3;
  public isMobile: boolean = false;
  public cursoSeleccionado: CursoDTO | null = null; // Variable para almacenar el curso

  constructor(
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const titulo = this.route.snapshot.paramMap.get('identificador');
    if (titulo) {
      this.categoriaService.getCategoria(titulo).subscribe(
        (categoria) => {
          this.categoria = categoria;
        },
        (error) => console.error('Error al obtener la categoría', error)
      );
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
  }

  verInformacion(item: CursoDTO): void {
    this.cursoSeleccionado = item; // Almacenar la categoría seleccionada
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // Inicializar modal
      modal.show(); // Mostrar la modal
    }
  }

  gruposCurso(identificador: string) {
    this.router.navigate(['/list-grupos', identificador]);
  }

  inscribirseAcurso(): void {
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {
      width: '30%',
      height: '80%',
      maxWidth: 'none',
      panelClass: 'mi-dialogo',

      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }

  registroDeporte(): void {
    const dialogRef = this.dialog.open(FormCursoDeportiviComponent, {

      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }

  onUpdate() {
    const dialogRef = this.dialog.open(FormCursoDeportiviComponent, {
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40%',
      height: '25%',
      maxWidth: 'none',
      /*data: {name: this.name(), animal: this.animal()},*/
    });
    /*dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });*/
  }

  configurarInscripcion(){
    const dialogRef = this.dialog.open(GestionInscripcionesComponent, {
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }
}
