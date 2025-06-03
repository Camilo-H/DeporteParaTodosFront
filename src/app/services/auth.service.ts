import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private oauthService: OAuthService) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '31695746487-jc39l5fo0m52oqo0fpt7ctpgjct9f0fn.apps.googleusercontent.com',
      redirectUri: 'http://localhost:4200/home',
      //redirectUri: window.location.origin + '/home',
      scope: 'openid profile email',
      
    }
    
    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initLoginFlow();
    console.log("En el servicio")
    //this.oauthService.initImplicitFlow();
    console.log("Pasó")
    //window.location.href = this.oauthService.authorizationUrl!;
  }

  logout() {
    this.oauthService.logOut();
  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }
  
  getAccesToken(){
    return this.oauthService.getAccessToken();
  }
}
