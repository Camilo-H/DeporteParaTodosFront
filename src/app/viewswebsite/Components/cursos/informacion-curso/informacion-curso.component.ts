import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
})
export class InformacionCursoComponent {
  isButtonEnabled = false; // Controla si el botón "Guardar" está habilitado
  displayedColumns: string[] = ['nombre', 'atenciones', 'acciones'];
  constructor(
    private router: Router,
    private dialog: MatDialog
  ){}
  
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

  inscribir(){
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {
          /*data: {name: this.name(), animal: this.animal()},*/
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
}
