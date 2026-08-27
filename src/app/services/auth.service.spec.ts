import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { TokenInterchangeService } from './token-interchange.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let oauthSpy: any;
  let tokenSpy: jasmine.SpyObj<TokenInterchangeService>;
  let eventsSubject: Subject<any>;

  beforeEach(() => {
    eventsSubject = new Subject<any>();

    // OAuthService se mockea como objeto plano para poder controlar
    // 'events' como Subject y evitar llamadas reales a Google OIDC.
    oauthSpy = {
      configure: jasmine.createSpy('configure'),
      setupAutomaticSilentRefresh: jasmine.createSpy('setupAutomaticSilentRefresh'),
      events: eventsSubject.asObservable(),
      loadDiscoveryDocumentAndTryLogin: jasmine.createSpy('loadDiscoveryDocumentAndTryLogin')
        .and.returnValue(Promise.resolve()),
      getIdentityClaims: jasmine.createSpy('getIdentityClaims').and.returnValue(null),
      getIdToken: jasmine.createSpy('getIdToken').and.returnValue(null),
      logOut: jasmine.createSpy('logOut'),
      initLoginFlow: jasmine.createSpy('initLoginFlow'),
      hasValidAccessToken: jasmine.createSpy('hasValidAccessToken').and.returnValue(false),
      hasValidIdToken: jasmine.createSpy('hasValidIdToken').and.returnValue(false),
      loadUserProfile: jasmine.createSpy('loadUserProfile').and.returnValue(Promise.resolve({})),
    };

    tokenSpy = jasmine.createSpyObj('TokenInterchangeService', ['exchangeGoogleToken']);
    tokenSpy.exchangeGoogleToken.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: OAuthService, useValue: oauthSpy },
        { provide: TokenInterchangeService, useValue: tokenSpy },
      ],
    });
    service = TestBed.inject(AuthService);
    sessionStorage.removeItem('dpt_token');
  });

  afterEach(() => {
    sessionStorage.removeItem('dpt_token');
    eventsSubject.complete();
  });

  // ── Creación e initLogin ─────────────────────────────────────────────────

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('initLogin() configura OAuthService con el issuer de Google y los scopes correctos', () => {
    expect(oauthSpy.configure).toHaveBeenCalledTimes(1);
    const config = oauthSpy.configure.calls.mostRecent().args[0];
    expect(config.issuer).toBe('https://accounts.google.com');
    expect(config.scope).toBe('openid profile email');
  });

  it('initLogin() llama a setupAutomaticSilentRefresh y loadDiscoveryDocumentAndTryLogin', () => {
    expect(oauthSpy.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(1);
    expect(oauthSpy.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalledTimes(1);
  });

  it('initLogin() then(): registra el usuario en consola cuando hay claims', fakeAsync(() => {
    const claims = { name: 'Ana', email: 'ana@u.co' };
    oauthSpy.getIdentityClaims.and.returnValue(claims);
    spyOn(console, 'log');
    // Reiniciar el servicio dentro de fakeAsync para poder hacer tick()
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: OAuthService, useValue: oauthSpy },
        { provide: TokenInterchangeService, useValue: tokenSpy },
      ],
    });
    TestBed.inject(AuthService);
    tick(); // flush Promise.resolve() del loadDiscoveryDocumentAndTryLogin
    expect(console.log).toHaveBeenCalledWith('Usuario autenticado:', claims);
  }));

  // ── Suscripción a token_received ─────────────────────────────────────────

  it('token_received: llama a exchangeGoogleToken con el idToken del usuario', () => {
    oauthSpy.getIdToken.and.returnValue('google-id-token-abc');
    eventsSubject.next({ type: 'token_received' });
    expect(tokenSpy.exchangeGoogleToken).toHaveBeenCalledWith('google-id-token-abc');
  });

  it('token_received: no llama a exchangeGoogleToken si idToken es null', () => {
    oauthSpy.getIdToken.and.returnValue(null);
    eventsSubject.next({ type: 'token_received' });
    expect(tokenSpy.exchangeGoogleToken).not.toHaveBeenCalled();
  });

  it('take(1): solo dispara el intercambio una vez aunque token_received se emita varias veces', () => {
    oauthSpy.getIdToken.and.returnValue('tok-xyz');
    eventsSubject.next({ type: 'token_received' });
    eventsSubject.next({ type: 'token_received' });
    eventsSubject.next({ type: 'token_received' });
    expect(tokenSpy.exchangeGoogleToken).toHaveBeenCalledTimes(1);
  });

  it('otros eventos OAuth (discovery_document_loaded, silently_refreshed) no disparan el intercambio', () => {
    eventsSubject.next({ type: 'discovery_document_loaded' });
    eventsSubject.next({ type: 'silently_refreshed' });
    eventsSubject.next({ type: 'token_expires' });
    expect(tokenSpy.exchangeGoogleToken).not.toHaveBeenCalled();
  });

  // ── logout ───────────────────────────────────────────────────────────────

  it('logout() llama a oauthService.logOut()', () => {
    service.logout();
    expect(oauthSpy.logOut).toHaveBeenCalledTimes(1);
  });

  it('logout() elimina dpt_token de sessionStorage', () => {
    sessionStorage.setItem('dpt_token', 'tok-a-b-c');
    service.logout();
    expect(sessionStorage.getItem('dpt_token')).toBeNull();
  });

  // ── login ────────────────────────────────────────────────────────────────

  it('login() llama a oauthService.initLoginFlow()', () => {
    service.login();
    expect(oauthSpy.initLoginFlow).toHaveBeenCalledTimes(1);
  });

  // ── getProfile / isAuthenticated / getUserProfile ────────────────────────

  it('getProfile() retorna el resultado de getIdentityClaims()', () => {
    const claims = { name: 'Carlos', email: 'carlos@u.co' };
    oauthSpy.getIdentityClaims.and.returnValue(claims);
    expect(service.getProfile()).toEqual(claims);
  });

  it('isAuthenticated() retorna true cuando accessToken e idToken son válidos', () => {
    oauthSpy.hasValidAccessToken.and.returnValue(true);
    oauthSpy.hasValidIdToken.and.returnValue(true);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('isAuthenticated() retorna false si falta accessToken', () => {
    oauthSpy.hasValidAccessToken.and.returnValue(false);
    oauthSpy.hasValidIdToken.and.returnValue(true);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('isAuthenticated() retorna false si falta idToken', () => {
    oauthSpy.hasValidAccessToken.and.returnValue(true);
    oauthSpy.hasValidIdToken.and.returnValue(false);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('getUserProfile() retorna un Observable que emite el perfil de loadUserProfile()', (done) => {
    const profile = { sub: '12345', name: 'Ana' };
    oauthSpy.loadUserProfile.and.returnValue(Promise.resolve(profile));
    service.getUserProfile().subscribe(result => {
      expect(result).toEqual(profile);
      done();
    });
  });
});
