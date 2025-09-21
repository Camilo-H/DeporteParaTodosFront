import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { PerfilService } from 'src/app/services/perfil.service';
import { PerfilDTO } from 'src/app/Models/DTOs/perfil-tdo';
import { id } from '@swimlane/ngx-charts';
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
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './form-inscripciones.component.html',
  styleUrls: ['./form-inscripciones.component.css'],
})
export class FormInscripcionesComponent {
  isEditing: boolean = false;
  tipoDocumento: string[] = ['CC', 'TI', 'CE', 'PP', 'PEP', 'DIE'];
  sexo: string[] = ['M', 'F'];

  perfil: PerfilDTO = {
    id: 0,
    nombre: '',
    correo: '',
    tipoId: '',
    sexo: '',
    facultad: '',
    tipoAlumno: '',
    role: '',
    alumnoCodigo: '',
  }
  constructor(
    private router: Router,
    private perfilService: PerfilService,
    private dialogref: MatDialogRef<FormInscripcionesComponent>,

  ) { }

  onSubmit(form: NgForm) {
    const perfil: PerfilDTO = {
      id: this.perfil.id,
      nombre: this.perfil.nombre,
      correo: this.perfil.correo,
      tipoId: this.perfil.tipoId,
      sexo: this.perfil.sexo,
      facultad: '',
      tipoAlumno: 'Estudiante',
      role: '',
      alumnoCodigo: this.perfil.alumnoCodigo,
    }

    this.perfilService.registrarPerfil(perfil).subscribe(
      (response) => {
        if (response != null) {
          this.dialogref.close({confirmacionCreacion:true, idAlumno: response.id});
        }
      },
    );
  }

  private numberToString(value: number | null | undefined): string {
    return value != null ? value.toString() : '';
  }

  cancelar(): void {
    this.router.navigate(['/cursos_deportivos']);
  }
  guardar() {
    this.dialogref.close();
    this.router.navigate(['/info-curso']);
  }

  onCancel(): void {
    this.dialogref.close();
  }
}
