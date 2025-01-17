import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CursoDTO } from '../Models/DTOs/curso-dto';

@Injectable({
  providedIn: 'root',
})
export class CursodeportivoService {
  private apiUrl = 'http://127.0.0.1:8082/api/cursos';

  constructor(private http: HttpClient) {}

  getCursos(): Observable<CursoDTO[]> {
    return this.http.get<CursoDTO[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Se produjo un error al recuperar los elementos ');
        return throwError(error);
      })
    );
  }

  crearCurso(curso: CursoDTO): Observable<CursoDTO> {
    return this.http.post<CursoDTO>(`${this.apiUrl}`, curso).pipe(
      catchError((error) => {
        console.error('Se produjo un error al crear el elemento ');
        return throwError(error);
      })
    );
  }

  getCurso(identificador: string): Observable<CursoDTO> {
    console.log("Valor del parametro en el service: "+identificador)
    return this.http.get<CursoDTO>(`${this.apiUrl}/${identificador}`).pipe(
      catchError((error) => {
        console.error(
          'Se produjo un error al recuperar el elemento ',
          identificador
        );
        return throwError(error);
      })
    );
  }

  updateCurso(identificador: string, curso: CursoDTO): Observable<CursoDTO> {
    return this.http
      .put<CursoDTO>(`${this.apiUrl}/${identificador}`, curso)
      .pipe(
        catchError((error) => {
          console.error(
            'Se produjo un error al actualizar el elemento ',
            identificador
          );
          return throwError(error);
        })
      );
  }

  deleteCurso(identificador: string): Observable<CursoDTO> {
    return this.http.delete<CursoDTO>(`${this.apiUrl}/${identificador}`).pipe(
      catchError((error) => {
        console.error(
          'Se produjo un error al eliminar el elemento ',
          identificador
        );
        return throwError(error);
      })
    );
  }
}
