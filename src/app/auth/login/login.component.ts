import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  validadorCorreo = new FormControl('', [
    Validators.required,
    Validators.email,
    this.unicaucaValidadorCorreoElectronico,
  ]);
  formularioInicioSesion: FormGroup;
  validadorContrasenia = new FormControl('', [Validators.required]);

  showTooltip: boolean = false;
  hide = true;
  buttomPaswword = false;
  buttomSummit = false;
  form: FormGroup;

  constructor(
    private authGoogleService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,

    private formBuilder: FormBuilder
  ) {
    this.form = fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.formularioInicioSesion = this.formBuilder.group({
      correo: this.validadorCorreo,
      contrasenia: this.validadorContrasenia,
    });
  }

  login() {
    this.authGoogleService.login();

    setTimeout(() => {
      const profile = this.authGoogleService.getProfile();
      const token = this.authGoogleService.getAccesToken();
      if (token) {
        console.log(token);
        console.log('Profile:', profile);
        console.log('Access Token:', token);
        // Ahora, llamamos a un endpoint del backend usando el token
        this.callBackendWithToken(token);
      } else {
        console.error('Error: No se pudo obtener el token');
      }
    }, 1000);
  }

  callBackendWithToken(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Enviamos el token JWT al backend
    });

    this.http.get('/api/protected', { headers }).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
      },
      (error) => {
        console.error('Error al comunicarse con el backend:', error);
      }
    );
  }

  unicaucaValidadorCorreoElectronico(
    control: AbstractControl
  ): ValidationErrors | null {
    const correo = control.value;
    const dominio = correo.split('@')[1];
    return dominio !== 'unicauca.edu.co' ? { dominioInvalido: true } : null;
  }
}
