import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CategoriaDTO } from 'src/app/Models/DTOs/categoria-dto';
import { CursoDTO } from 'src/app/Models/DTOs/curso-dto';
import { GrupoDTO } from 'src/app/Models/DTOs/grupo-dto'; //eliminar luego
import { CursodeportivoService } from 'src/app/services/cursodeportivo.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GrupoService } from 'src/app/services/grupo.service';

@Component({
  selector: 'app-lista-cursos',
  standalone: true,
  imports: [
    CommonModule,
    SidenavComponent,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.css'],
})
export class ListaCursosComponent {
  categoria: CategoriaDTO | null = null;
  public colsize = 3;
  public isMobile: boolean = false;
  public cursoSeleccionado: CursoDTO | null = null;
  public titulocurso: any='';
  public grupos: GrupoDTO[] = [];

  constructor(

    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private cursoService: CursodeportivoService,
    private grupoService: GrupoService
  ) {
}

ngOnInit(): void {
  const titulo = this.route.snapshot.paramMap.get('identificador');
  this.titulocurso = titulo;
  this.loadGrupos();

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
nuevoGrupo(): void {
}

verEstudiantesGrupo(): void {
}

onUpdate(): void {}

onDelete(): void {}

verInformacion(){}
}
