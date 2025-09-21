import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PerfilDTO } from '../Models/DTOs/perfil-tdo';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  apiUrl: string = 'http://127.0.0.1:8082/api/v2';
  constructor(private http: HttpClient) { }

  private perfilSubject = new BehaviorSubject<string>('Administrador');
  perfil$ = this.perfilSubject.asObservable();

  setPerfil(perfil: string) {
    this.perfilSubject.next(perfil);
  }

  getPerfil() {
    return this.perfilSubject.value;
  }

  registrarPerfil(datos: PerfilDTO): Observable<PerfilDTO> {
    return this.http.post<PerfilDTO>(`${this.apiUrl}/RegistroPerfilAlumno`, datos).pipe(
    );
  }
}
