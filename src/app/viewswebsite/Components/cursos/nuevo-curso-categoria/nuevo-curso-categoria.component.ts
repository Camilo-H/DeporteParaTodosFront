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
import { ImagenService } from 'src/app/services/imagen.service';

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
    imagenId: null,
  };

  constructor(
    private categoriaService: CategoriaService,
    private imagenService: ImagenService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialogRef<NuevoCursoCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string }
  ) { }

  ngOnInit(): void {
    // const titulo = this.route.snapshot.paramMap.get('titulo');
    if (this.data && this.data.titulo) {
      this.isEditing = true;
      this.loadCategoria(this.data.titulo);
    }
  }

  loadCategoria(titulo: string): void {
    this.categoriaService.getCategoria(titulo).subscribe(
      (categoria) => {
        this.categoria = categoria;
        if (categoria.imagenId != null) {
          this.imagenService.getimagen(categoria.imagenId).subscribe(
            (imagenData) => {
              categoria.imagenBase64 = imagenData.datosBase64;
              categoria.tipoArchivo = imagenData.tipoArchivo;
              this.imagenPreview = `data:${categoria.tipoArchivo};base64,${categoria.imagenBase64}`;
            },
            (error) => {
              console.error(`Error al obtener la imagen de la categoría  ${categoria.titulo}`, error);
            }
          )
        }
      },
      (error) => console.error('Error al cargar la categoría', error)
    );
  }

  onSubmit(form: NgForm): void {
    // Crear una copia del objeto categoría sin la propiedad imagen
    if (this.selectedFile) {
      this.imagenService.postImagen(this.selectedFile).subscribe(
        (imagenResponse) => {
          const idImagen = imagenResponse.id;

          const nuevaCategoria: CategoriaDTO = {
            titulo: this.categoria.titulo,
            descripcion: this.categoria.descripcion,
            imagenId: idImagen
          };

          this.categoriaService.createCategoria(nuevaCategoria).subscribe(
            (response) => {
              console.log('Categoría creada con éxito', response);
              this.dialogRef.close(true);
            },
            (error) => {
              console.error('Error al crear la categoría', error);
            }
          );
        },
        (error) => {
          console.error('Error al subir la imagen', error);
        }
      );
    } else {
      const nuevaCategoria: CategoriaDTO = {
        titulo: this.categoria.titulo,
        descripcion: this.categoria.descripcion,
        imagenId: null
      };
      this.categoriaService.createCategoria(nuevaCategoria).subscribe(
        (response) => {
          console.log('Categoría creada con éxito', response);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al crear la categoría', error);
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.imagenSeleccionada = input.files[0];
      this.selectedFile = input.files[0];

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
