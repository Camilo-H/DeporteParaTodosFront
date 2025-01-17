import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SidenavComponent } from '../../../pages/sidenav/sidenav.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RegistroInstructorComponent } from '../registro-instructor/registro-instructor.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-instructores',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    SidenavComponent,
    MatDialogModule,
    FormsModule
    
  ],
  templateUrl: './lista-instructores.component.html',
  styleUrls: ['./lista-instructores.component.css'],
})
export class ListaInstructoresComponent {
 
  isButtonEnabled = false;
  checked = false;
  displayedColumns: string[] = ['nombre', 'atenciones', 'acciones'];

  constructor(
    private dialog: MatDialog
  ) {}

  deportistas = [
    { nombre: 'Oscar Jovany Ortega', checked : false },
    { nombre: 'Juan Carlos Lopez carrillo', checked : false },
    { nombre: 'Fabian Torres Perdomo', checked : false },
    { nombre: 'Daniel Eduardo Gaviria', checked : false },
    { nombre: 'Juan Camilo Erazo', checked : false },
    { nombre: 'Adriana Lucia Ortíz', checked : false },
    { nombre: 'Daniel Muños Coral', checked : false },
  ];

  onCheckboxChange(event: any) {
    this.isButtonEnabled = event.checked; // Activa el botón si el checkbox está seleccionado
    this.isButtonEnabled = this.deportistas.some(deportista => deportista.checked);
  }

  registroInstructor() {
    const dialogRef = this.dialog.open(RegistroInstructorComponent, {
     
    });
  }


  guardar(){
    this.deportistas.forEach(deportista => (deportista.checked = false)); // Desactiva todos los checkboxes
    this.isButtonEnabled = false; // Desactiva el botón
  }
}
