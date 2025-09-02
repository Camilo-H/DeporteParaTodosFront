import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { CursoDTO } from '../Models/DTOs/curso-dto';

@Injectable({
  providedIn: 'root',
})
export class CursodeportivoService {
  private apiUrl = 'http://127.0.0.1:8082/api/v2';

  constructor(private http: HttpClient) { }

  getAllCursos():Observable<CursoDTO[]>{
    return this.http.get<CursoDTO[]>(`${this.apiUrl}/cursos`).pipe(
      catchError((error) => {
        console.error('Se produjo un error al recuperar los elementos ');
        return throwError(error);
      })
    );
  }

  getCursos(prmCategoria: string): Observable<CursoDTO[]> {
    return this.http.get<CursoDTO[]>(`${this.apiUrl}/cursosbycategoria?prmCategoria=${encodeURIComponent(prmCategoria)}`).pipe(
      catchError((error) => {
        console.error('Se produjo un error al recuperar los elementos ');
        return throwError(error);
      })
    );
  }

  crearCurso(curso: CursoDTO): Observable<CursoDTO> {
    return this.http.post<CursoDTO>(`${this.apiUrl}/curso`, curso).pipe(
      catchError((error) => {
        console.error('Se produjo un error al crear el elemento ');
        return throwError(error);
      })
    );
  }

  getCurso(categoria: string, nombreCurso: string): Observable<CursoDTO> {
    return this.http.get<CursoDTO>(`${this.apiUrl}/curso?prmCategoria=${encodeURIComponent(categoria)}&prmCurso=${encodeURIComponent(nombreCurso)}`).pipe(
       tap((response) => {
        console.log("Respuesta en el servicio desde back", response);
      }
      ),
      catchError((error) => {
        console.error('Se produjo un error al recuperar el elemento ');
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
