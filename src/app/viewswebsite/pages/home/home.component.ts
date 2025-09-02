import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
/**Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../Components/genericos/dialog/dialog.component';
import { NuevoCursoCategoriaComponent } from '../../Components/cursos/nuevo-curso-categoria/nuevo-curso-categoria.component';
import { HeaderComponent } from '../header/header.component';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaDTO } from 'src/app/Models/DTOs/categoria-dto';
import * as bootstrap from 'bootstrap';
import { PerfilService } from 'src/app/services/perfil.service';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatGridListModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    HeaderComponent,
    //MatDatepickerModule,
    //MatNativeDateModule
  ],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
  public colsize = 3;
  public isMobile: boolean = false;
  public listaEscenarios: CategoriaDTO[] = [];
  public categoriaSeleccionada: CategoriaDTO | null = null; // Variable para almacenar la categoría seleccionada
  perfil?: string;

  constructor(
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private categoriaService: CategoriaService,
    private imagenService: ImagenService,
    private dialog: MatDialog,
    private perfilService: PerfilService,
  ) { }

  ngOnInit(): void {
    this.loadCategorias();
    this.breakPointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        this.colsize = this.isMobile ? 1 : 3;
      });
    this.perfilService.perfil$.subscribe(perfil => {
      this.perfil = perfil;
    });
  }

  // Método para cargar las categorías desde el servicio
  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (data) => {
        this.listaEscenarios = data;

        this.listaEscenarios.forEach((categoria) => {
          if (categoria.imagenId != null) {
            this.imagenService.getimagen(categoria.imagenId).subscribe(
              (imagenData) => {
                categoria.imagenBase64 = imagenData.datosBase64;
                categoria.tipoArchivo = imagenData.tipoArchivo;
              },
              (error) => {
                console.error(`Error al obtener la imagen de la categoría  ${categoria.titulo}`, error);
              }
            );
          }
        });
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
  }

  // Método para abrir la modal y mostrar la descripción
  verInformacion(item: CategoriaDTO): void {
    this.categoriaSeleccionada = item;
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  configurarTipoCurso() {
    this.router.navigate(['/configuracionCatCurso']);
  }

  //Método para cargar los cursos de la categoría
  abrirCursosDeportivos(identificador: string): void {
    this.router.navigate(['/cursos_deportivos', identificador]);
  }

  //Método para actualizar la categoría
  onUpdate(titulo: string): void {
    const dialogRef = this.dialog.open(NuevoCursoCategoriaComponent, {
      data: { titulo },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategorias();
      }
    });
  }

  //Método para eliminar la categoría
  onDelete(identificador: string): void {
    let elemento: string = ' la categoría';
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { elemento, identificador },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmado) {
        this.loadCategorias();
      }
    });
  }

  //Método para registrar una categoría
  nuevaCategoria(): void {
    const dialogRef = this.dialog.open(NuevoCursoCategoriaComponent, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadCategorias();
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
