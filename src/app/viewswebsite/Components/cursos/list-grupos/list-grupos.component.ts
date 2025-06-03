import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGruposComponent } from '../../cursos/form-grupos/form-grupos.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../genericos/dialog/dialog.component';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { CursodeportivoService } from 'src/app/services/cursodeportivo.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CursoDTO } from 'src/app/Models/DTOs/curso-dto';
import { GrupoDTO } from 'src/app/Models/DTOs/grupo-dto';
import { GrupoService } from 'src/app/services/grupo.service';
import { FormInscripcionesComponent } from '../../usuarios/form-inscripciones/form-inscripciones.component';
import { PerfilService } from 'src/app/services/perfil.service';

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
  ],
  templateUrl: './list-grupos.component.html',
  styleUrls: ['./list-grupos.component.css'],
})
export class ListGruposComponent implements OnInit {
  curso: CursoDTO | null = null;
  public colsize = 3;
  public isMobile: boolean = false;
  public grupos: GrupoDTO[] = [];
  perfil?: string;

  constructor(
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private cursoService: CursodeportivoService,
    private grupoService: GrupoService,
    private dialog: MatDialog,
    private perfilService: PerfilService
  ) { }

  inscrito: boolean = false; // Estado de la inscripción

  ngOnInit(): void {
    const titulo = this.route.snapshot.paramMap.get('identificador');
    if (titulo) {
      this.cursoService.getCurso(titulo).subscribe(
        (curso) => {
          this.curso = curso;
          this.grupos = this.curso.grupos;
        },
        (error) => console.error('Error al obtener el curso', error)
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

    this.perfilService.perfil$.subscribe(perfil => {
      this.perfil = perfil;
      // Lógica para mostrar/ocultar contenido basado en el perfil
    });
  }

  inscribirseAcurso() {
    this.inscrito = !this.inscrito;
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }

  loadGrupos(): void {
    this.grupoService.getGrupos().subscribe(
      (data) => {
        this.grupos = data;
      },
      (error) => {
        console.error('Error al obtener la lista de grupos', error);
      }
    );
  }

  onUpdate(): void {
    const dialogRef = this.dialog.open(FormGruposComponent, {
      width: '40%', // Ancho
      height: '70%', // Alto
      maxWidth: 'none', // Esto asegura que no haya un máximo
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }
  onDelete(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40%', // Ancho
      height: '25%', // Alto
      maxWidth: 'none', // Esto asegura que no haya un máximo
      /*data: {name: this.name(), animal: this.animal()},*/
    });
  }
  nuevoGrupo(): void {
    const dialogRef = this.dialog.open(FormGruposComponent, {});
  }

  verEstudiantesGrupo(param: any): void {
    if (this.perfil !== 'Estudiante') {
      this.router.navigate([param]);
    }else{
      alert('No tienes permiso para acceder a esta sección, comuniquese con el administrador para más información');
    }
  }
}

/*
  ngOnInit(): void {
    const titulo = this.route.snapshot.paramMap.get('identificador');
    console.log('Valor del titulo en grupos ', titulo);
    if (titulo) {
      this.cursoService.getCurso(titulo).subscribe(
        (curso) => {
          this.curso = curso;
        },
        (error) => console.error('Error al obtener el curso', error)
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
  }*/
