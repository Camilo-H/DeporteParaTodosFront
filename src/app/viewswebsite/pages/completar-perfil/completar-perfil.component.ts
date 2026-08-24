import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { OAuthService } from 'angular-oauth2-oidc';
import { PerfilService } from 'src/app/services/perfil.service';
import { PerfilDTO } from 'src/app/Models/DTOs/perfil-tdo';

@Component({
  selector: 'app-completar-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './completar-perfil.component.html',
  styleUrls: ['./completar-perfil.component.css'],
})
export class CompletarPerfilComponent implements OnInit {
  readonly tiposDocumento: string[] = ['CC', 'TI', 'CE', 'PP', 'PEP', 'DIE'];
  readonly opcSexo: string[] = ['M', 'F'];
  readonly roles: string[] = ['Estudiante', 'Administrativo', 'Docente'];

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
  };

  constructor(
    private oauthService: OAuthService,
    private perfilService: PerfilService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const claims: any = this.oauthService.getIdentityClaims();
    if (claims) {
      this.perfil.nombre = claims['name'] ?? '';
      this.perfil.correo = claims['email'] ?? '';
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    // Los 3 roles van al mismo endpoint; role queda vacío (no es instructor del programa)
    this.perfilService.registrarPerfil({ ...this.perfil, role: '', facultad: '' }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: err => console.error('Error al completar perfil:', err),
    });
  }

  cancelar(): void {
    this.oauthService.logOut();
    this.router.navigate(['/login']);
  }
}
