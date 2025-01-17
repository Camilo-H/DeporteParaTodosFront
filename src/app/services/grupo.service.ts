import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GrupoDTO } from '../Models/DTOs/grupo-dto';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  private apiUrl = 'http://127.0.0.1:8082/api/grupos';

  constructor(private http: HttpClient) {}

  getGrupos(): Observable<GrupoDTO[]> {
    return this.http.get<GrupoDTO[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Se produjo un error al recuperar los elementos ');
        return throwError(error);
      })
    );
  }
}
