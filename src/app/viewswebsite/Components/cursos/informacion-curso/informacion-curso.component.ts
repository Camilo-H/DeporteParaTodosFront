import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { FormInscripcionesComponent } from '../../usuarios/form-inscripciones/form-inscripciones.component';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormAlertaComponent } from '../../usuarios/form-alerta/form-alerta.component';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import { InscripcionDTO } from 'src/app/Models/DTOs/inscripcion-dto';

@Component({
  selector: 'app-informacion-curso',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    SidenavComponent,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './informacion-curso.component.html',
  styleUrls: ['./informacion-curso.component.css'],
  providers: [DatePipe],
})
export class InformacionCursoComponent implements OnInit {
  isButtonEnabled = false;
  displayedColumns: string[] = ['nombre', 'atenciones', 'acciones'];

  categoria: string | null = null;
  curso: string | null = null;
  anio: number | null = null;
  iterable: number | null = null;
  fechaActual: Date = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private inscripcionService: InscripcionesService,
    private datepipe: DatePipe,
  ){}
  
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.categoria = params.get('categoria');
      this.curso = params.get('curso');
      this.anio = Number(params.get('anio')) || null;
      this.iterable = Number(params.get('iterable')) || null;
    });
  }

  deportistas = [
    { nombre: 'Camilo Hernán Anacona', checked : false},
    { nombre: 'Juan Carlos Lopez carrillo', checked : false },
    { nombre: 'Fabian Gonzales Perdomo', checked : false },
    { nombre: 'Juan Camilo Erazo', checked : false},
    { nombre: 'Daniel Eduardo Gaviria', checked : false },
    { nombre: 'Jhon Fredy Ortega', checked : false},
    
  ];
  

  // Método que se activa cuando cambia un checkbox
  onCheckboxChange(event: any) {
    this.isButtonEnabled = event.checked; // Activa el botón si el checkbox está seleccionado
    this.isButtonEnabled = this.deportistas.some(deportista => deportista.checked);
  }

  inscribir() {
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {});

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.confirmacionCreacion) {
        const inscripcion: InscripcionDTO = {
          fechaInscripcion: this.FormatDate(this.fechaActual),
          fechaDesvinculacion: '',
          alumnoId: resultado.idAlumno,
          categoria: this.categoria!,
          curso: this.curso!,
          anio: this.anio!,
          iterable: this.iterable!,
          eliminado: 0,
        };
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

  guardar(){
    this.deportistas.forEach(deportista => (deportista.checked = false)); // Desactiva todos los checkboxes
    this.isButtonEnabled = false; // Desactiva el botón
  }

  crearNotificacion(param:any){
    const dialogRef = this.dialog.open(FormAlertaComponent);
    this.router.navigate(param);
  }

  private FormatDate(fecha: Date): string {
    return this.datepipe.transform(fecha, 'yyyy-MM-dd')!;
  }
}
