import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SidenavComponent } from '../../../pages/sidenav/sidenav.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { InstructorDTO } from 'src/app/Models/DTOs/instructor-dto';
import { InstructorServisce } from 'src/app/services/instructor.service';
import { FormInscripcionesComponent } from '../form-inscripciones/form-inscripciones.component';

@Component({
  selector: 'app-lista-instructores',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    SidenavComponent,
    MatDialogModule,
    FormsModule

  ],
  templateUrl: './lista-instructores.component.html',
  styleUrls: ['./lista-instructores.component.css'],
})
export class ListaInstructoresComponent implements OnInit {

  instructores: InstructorDTO[] = [];

  isButtonEnabled = false;
  checked = false;
  displayedColumns: string[] = ['Identificacion', 'Nombre', 'Correo', 'Acciones'];

  constructor(
    private dialog: MatDialog,
    private instructorservice: InstructorServisce,
  ) { }

  ngOnInit(): void {
    this.instructorservice.getInstructores().subscribe(
      (instructor) => {
        this.instructores = instructor;
      }
    );
  }

  registroInstructor() {
    const dialogRef = this.dialog.open(FormInscripcionesComponent, {

    });
  }

}
