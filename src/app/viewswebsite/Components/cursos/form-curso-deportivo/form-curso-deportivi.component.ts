import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CursodeportivoService } from 'src/app/services/cursodeportivo.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-curso-deportivi',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule, 
    MatSelectModule

  ],
  templateUrl: './form-curso-deportivi.component.html',
  styleUrls: ['./form-curso-deportivi.component.css'],
})
export class FormCursoDeportiviComponent {
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  isEditing: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private cursodeportivoserce: CursodeportivoService,
  ) { }

  onSubmit(): void {
    /*if (this.isEditing) {
      this.categoriaService
        .updateCategoria(this.categoria.titulo, this.categoria)
        .subscribe(
          () => {
            console.log('Categoría actualizada exitosamente');
            this.router.navigate(['/categorias']);
          },
          (error) => console.error('Error al actualizar la categoría', error)
        );
      this.dialogRef.close(true);
    } else {
      this.categoriaService.createCategoria(this.categoria).subscribe(
        () => {
          console.log('Categoría creada exitosamente');
          this.router.navigate(['/categorias']);
        },
        (error) => console.error('Error al crear la categoría', error)
      );
      this.dialogRef.close(true);
    }*/
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.imagenSeleccionada = input.files[0];

      // Crear una URL para la vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(this.imagenSeleccionada);
    }
  }

  cancelar(): void {
    this.router.navigate(['/cursos_deportivos']);
  }
}
