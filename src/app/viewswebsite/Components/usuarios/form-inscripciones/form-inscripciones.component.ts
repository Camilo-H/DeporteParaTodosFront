import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,

  ],
  templateUrl: './form-inscripciones.component.html',
  styleUrls: ['./form-inscripciones.component.css'],
})
export class FormInscripcionesComponent {
  constructor(private router: Router, private dialogref: MatDialogRef <FormInscripcionesComponent>) {}

  cancelar(): void {
    this.router.navigate(['/cursos_deportivos']);
  }
  guardar() {
    this.dialogref.close();
    this.router.navigate(['/info-curso']);
  }
}
