import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaDTO } from 'src/app/Models/DTOs/categoria-dto';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-nuevo-curso-categoria',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: './nuevo-curso-categoria.component.html',
  styleUrls: ['./nuevo-curso-categoria.component.css'],
})
export class NuevoCursoCategoriaComponent implements OnInit {
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  isEditing: boolean = false;
  selectedFile: File | null = null;

  categoria: CategoriaDTO = {
    titulo: '',
    descripcion: '',
    rutaImagen: '',
    imagen: null,
    cursos: [],
  };

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialogRef<NuevoCursoCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string }
  ) {}

  ngOnInit(): void {
    // const titulo = this.route.snapshot.paramMap.get('titulo');
    console.log('este es el titulo', this.data.titulo);
    if (this.data && this.data.titulo) {
      this.isEditing = true;
      this.loadCategoria(this.data.titulo);
    }
  }

  /*loadCategoria(titulo: string): void {
    this.categoriaService.getCategoria(titulo).subscribe(
      (categoria) => {
        this.categoria = categoria;
      },
      (error) => console.error('Error al cargar la categoría', error)
    );
  }*/

  loadCategoria(titulo: string): void {
    this.categoriaService.getCategoria(titulo).subscribe(
      (categoria) => {
        this.categoria = categoria;
      },
      (error) => console.error('Error al cargar la categoría', error)
    );
  }

  /*onSubmit(form: NgForm): void {
    if (this.isEditing) {
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
    }
  }*/

  onSubmit(form: NgForm): void {
    // Crear una copia del objeto categoría sin la propiedad imagen
    const categoriaSinImagen = { ...this.categoria };
    delete categoriaSinImagen.imagen;

    if (this.isEditing) {
      this.categoriaService
        .updateCategoria(this.categoria.titulo, categoriaSinImagen)
        .subscribe(
          () => {
            console.log('Categoría actualizada exitosamente');
            this.router.navigate(['/categorias']);
          },
          (error) => console.error('Error al actualizar la categoría', error)
        );
      this.dialogRef.close(true);
    } else {
      this.categoriaService.createCategoria(categoriaSinImagen).subscribe(
        () => {
          console.log('Categoría creada exitosamente');
          this.router.navigate(['/categorias']);
        },
        (error) => console.error('Error al crear la categoría', error)
      );
      this.dialogRef.close(true);
    }
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

  onCancel(): void {
    this.dialogRef.close();
  }
}
