import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CursodeportivoService } from 'src/app/services/cursodeportivo.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  constructor(
    private categoriaservice: CategoriaService,
    private cursoService: CursodeportivoService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { elemento: string, nombreElemento: any, tipoElemento: string, categoria?:string,}
  ) { }

  confirmarEliminar(): void {
    if (this.data.tipoElemento == 'categoria') {
      this.categoriaservice.deleteCategoria(this.data.nombreElemento).subscribe(
      );
      this.dialogRef.close({ confirmado: true, id: this.data.nombreElemento });
    }

    if (this.data.tipoElemento == 'curso') {
      this.cursoService.deleteCurso(this.data.categoria!, this.data.nombreElemento).subscribe(
      );
      this.dialogRef.close({ confirmado: true, id: this.data.nombreElemento});
    }

  }
}
