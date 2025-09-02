import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';
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
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  validadorCorreo = new FormControl('', [
    Validators.required,
    Validators.email,
    //this.unicaucaValidadorCorreoElectronico,
  ]);

  formularioInicioSesion: FormGroup;
  validadorContrasenia = new FormControl('', [Validators.required]);
  showTooltip: boolean = false;
  hide = true;
  buttomPaswword = false;
  buttomSummit = false;
  private userProfile: any;
  //form: FormGroup;
  userInfo: any;
  constructor(
    private authGoogleService: AuthService,
    private oauthService: OAuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {

    this.loginForm = fb.group({
      correo: ['', Validators.required],
      contrasenia: ['', Validators.required],
    });

    this.formularioInicioSesion = this.formBuilder.group({
      correo: this.validadorCorreo,
      contrasenia: this.validadorContrasenia,
    });
  }

  ngOnInit() {
    const usuario = this.authGoogleService.getInfoUsuario();
    console.log('Usuario en componente:', usuario);
  }

  login(): void {
    this.authGoogleService.login();
    this.authGoogleService.getInfoUsuario();
  }

}