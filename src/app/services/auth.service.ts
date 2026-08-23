import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { PerfilDTO } from '../Models/DTOs/perfil-tdo';
import { catchError, throwError, Observable, from, filter, take } from 'rxjs';
import { TokenInterchangeService } from './token-interchange.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlApi: string = 'http://127.0.0.1:8082/api/v2';

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,
    private tokenInterchangeService: TokenInterchangeService,
  ) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '744420107810-h8mprfrme2cav6226hdl960gl40qaebp.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/home',
      scope: 'openid profile email',
    }

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();

    // Intercambio de token con el backend inmediatamente después del login de Google.
    // token_received se emite solo cuando hay un login real (o silent refresh),
    // nunca en cargas de página sin sesión activa.
    // take(1): el intercambio se hace una vez por sesión; cuando SCRUM-159 requiera
    // manejar renovaciones del dpt_token, se quitará el take(1) y se filtrará
    // también por token_refreshed.
    this.oauthService.events.pipe(
      filter(e => e.type === 'token_received'),
      take(1),
    ).subscribe(() => {
      const idToken = this.oauthService.getIdToken();
      if (idToken) {
        this.tokenInterchangeService.exchangeGoogleToken(idToken).subscribe({
          error: err => console.error('Error en intercambio de token con el backend:', err),
        });
      }
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      const claims: any = this.oauthService.getIdentityClaims();
      if (claims) {
        console.log('Usuario autenticado:', claims);
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  verificarUsuario(email: string) {
    this.http.get<PerfilDTO>(`${this.urlApi}/login?email=${encodeURIComponent(email)}`).pipe(
    ).subscribe(
      (data) => {
        console.log('Respuesta del servico de autenticación backend', data);
      }
    );
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }

  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
  }

  getUserProfile(): Observable<any> {
    return from(this.oauthService.loadUserProfile());
  }
}


