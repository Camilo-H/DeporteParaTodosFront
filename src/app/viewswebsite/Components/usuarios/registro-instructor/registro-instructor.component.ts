import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './registro-instructor.component.html',
  styleUrls: ['./registro-instructor.component.css'],
})
export class RegistroInstructorComponent {


  constructor(private router: Router) {}
  cancelar(): void {
    this.router.navigate(['/cursos_deportivos']);
  }
  guardar(): void {
    this.router.navigate(['/list_cursos']);
  }
  
}
