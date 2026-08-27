import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OAuthService } from 'angular-oauth2-oidc';
import { of, throwError } from 'rxjs';
import { CompletarPerfilComponent } from './completar-perfil.component';
import { PerfilService } from 'src/app/services/perfil.service';
import { PerfilDTO } from 'src/app/Models/DTOs/perfil-tdo';

const perfilDummy: PerfilDTO = {
  id: 0,
  nombre: 'Ana Ruiz',
  correo: 'ana@unicauca.edu.co',
  tipoId: 'CC',
  sexo: 'F',
  facultad: '',
  tipoAlumno: 'Estudiante',
  role: '',
  alumnoCodigo: 'A123',
};

describe('CompletarPerfilComponent', () => {
  let component: CompletarPerfilComponent;
  let fixture: ComponentFixture<CompletarPerfilComponent>;
  let oauthSpy: jasmine.SpyObj<OAuthService>;
  let perfilSpy: jasmine.SpyObj<PerfilService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    oauthSpy = jasmine.createSpyObj('OAuthService', ['getIdentityClaims', 'logOut']);
    perfilSpy = jasmine.createSpyObj('PerfilService', ['registrarPerfil']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [CompletarPerfilComponent, NoopAnimationsModule],
      providers: [
        { provide: OAuthService, useValue: oauthSpy },
        { provide: PerfilService, useValue: perfilSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
    // MatSnackBar se resuelve desde el MatSnackBarModule del propio standalone component;
    // overrideComponent garantiza que el mock reemplaza esa instancia.
    .overrideComponent(CompletarPerfilComponent, {
      set: { providers: [{ provide: MatSnackBar, useValue: snackSpy }] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletarPerfilComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    oauthSpy.getIdentityClaims.and.returnValue(null as any);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit() pre-rellena nombre y correo desde claims de Google', () => {
    oauthSpy.getIdentityClaims.and.returnValue({ name: 'Ana Ruiz', email: 'ana@unicauca.edu.co' });
    fixture.detectChanges();
    expect(component.perfil.nombre).toBe('Ana Ruiz');
    expect(component.perfil.correo).toBe('ana@unicauca.edu.co');
  });

  it('ngOnInit() no lanza error cuando claims es null', () => {
    oauthSpy.getIdentityClaims.and.returnValue(null as any);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component.perfil.nombre).toBe('');
    expect(component.perfil.correo).toBe('');
  });

  it('onSubmit() no llama a registrarPerfil si el form es inválido', () => {
    oauthSpy.getIdentityClaims.and.returnValue(null as any);
    fixture.detectChanges();
    const formMock = { invalid: true } as NgForm;
    component.onSubmit(formMock);
    expect(perfilSpy.registrarPerfil).not.toHaveBeenCalled();
  });

  it('onSubmit() llama a registrarPerfil con role: "" y facultad: "" independientemente del rol elegido', () => {
    oauthSpy.getIdentityClaims.and.returnValue({ name: 'Ana', email: 'ana@u.co' });
    fixture.detectChanges();
    perfilSpy.registrarPerfil.and.returnValue(of(perfilDummy));
    component.perfil.tipoAlumno = 'Docente';
    const formMock = { invalid: false } as NgForm;
    component.onSubmit(formMock);
    const callArg: PerfilDTO = perfilSpy.registrarPerfil.calls.mostRecent().args[0];
    expect(callArg.role).toBe('');
    expect(callArg.facultad).toBe('');
  });

  it('onSubmit() éxito: muestra snackbar de éxito y navega a /home', () => {
    oauthSpy.getIdentityClaims.and.returnValue({ name: 'Ana', email: 'ana@u.co' });
    fixture.detectChanges();
    perfilSpy.registrarPerfil.and.returnValue(of(perfilDummy));
    const formMock = { invalid: false } as NgForm;
    component.onSubmit(formMock);
    expect(snackSpy.open).toHaveBeenCalledWith(
      'Registro exitoso, bienvenido/a',
      'Cerrar',
      jasmine.objectContaining({ duration: 4000 }),
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('onSubmit() error: muestra snackbar de error', () => {
    oauthSpy.getIdentityClaims.and.returnValue({ name: 'Ana', email: 'ana@u.co' });
    fixture.detectChanges();
    perfilSpy.registrarPerfil.and.returnValue(throwError(() => new Error('500')));
    spyOn(console, 'error');
    const formMock = { invalid: false } as NgForm;
    component.onSubmit(formMock);
    expect(snackSpy.open).toHaveBeenCalledWith(
      'No se pudo completar el registro, intenta de nuevo',
      'Cerrar',
      jasmine.objectContaining({ duration: 6000 }),
    );
  });

  it('onSubmit() error: llama a console.error con el error', () => {
    oauthSpy.getIdentityClaims.and.returnValue(null as any);
    fixture.detectChanges();
    const err = new Error('fallo de red');
    perfilSpy.registrarPerfil.and.returnValue(throwError(() => err));
    const consoleSpy = spyOn(console, 'error');
    const formMock = { invalid: false } as NgForm;
    component.onSubmit(formMock);
    expect(consoleSpy).toHaveBeenCalledWith('Error al completar perfil:', err);
  });

  it('cancelar() llama a oauthService.logOut() y navega a /login', () => {
    oauthSpy.getIdentityClaims.and.returnValue(null as any);
    fixture.detectChanges();
    component.cancelar();
    expect(oauthSpy.logOut).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
