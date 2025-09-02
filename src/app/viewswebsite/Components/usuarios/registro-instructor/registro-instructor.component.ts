import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InstructorDTO } from 'src/app/Models/DTOs/instructor-dto';

@Component({
  selector: 'app-registro-instructor',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registro-instructor.component.html',
  styleUrls: ['./registro-instructor.component.css'],
})
export class RegistroInstructorComponent implements OnInit {
  isEditing: boolean = false;

  instructor: InstructorDTO = {
    id: 0,
    nombre: '',
    correo: '',
    sexo: '',
  }
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<RegistroInstructorComponent>,
  ) { }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {

  }
  cancelar(): void {
    this.router.navigate(['/cursos_deportivos']);
  }
  guardar(): void {
    this.router.navigate(['/list_cursos']);
  }

   onCancel(): void {
    this.dialogRef.close();
  }

}
