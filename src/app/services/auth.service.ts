import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // urlApi: string = 'http://127.0.0.1:8082/api/v2';
  usuarioLogued: any;

  constructor(private oauthService: OAuthService) {
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
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const claims: any = this.oauthService.getIdentityClaims();
        console.log('Usuario autenticado:', claims);
        this.usuarioLogued=claims;
      }
      console.log('No hay usuario autenticado');
      // const claims: any = this.oauthService.getIdentityClaims();
      // if (claims) {
      //   console.log('Usuario autenticado:', claims);
      // } else {
      //   console.log('No hay usuario autenticado', claims);
      // }
    });
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

  getInfoUsuario():any{
    console.log('Datos del usuario logueado', this.usuarioLogued)
  }
}
