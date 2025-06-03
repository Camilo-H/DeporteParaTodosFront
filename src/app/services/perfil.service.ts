import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor() { }

  private perfilSubject = new BehaviorSubject<string>('Administrador');
  perfil$ = this.perfilSubject.asObservable();

  setPerfil(perfil: string) {
    this.perfilSubject.next(perfil);
  }

  getPerfil() {
    return this.perfilSubject.value;
  }

  
}
