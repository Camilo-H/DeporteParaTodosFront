import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { GrupoDTO } from '../Models/DTOs/grupo-dto';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  private apiUrl = 'http://127.0.0.1:8082/api/v2';

  constructor(private http: HttpClient) { }

  getGrupos(prmNombreCategoria: string, prmNombreCurso: string): Observable<GrupoDTO[]> {
    return this.http.get<GrupoDTO[]>(`${this.apiUrl}/gruposCurso?prmCategoria=${encodeURIComponent(prmNombreCategoria)}&prmCurso=${encodeURIComponent(prmNombreCurso)}`).pipe(
      catchError((error) => {
        console.error('Se produjo un error al recuperar los elementos ');
        return throwError(error);
      })
    );
  }

  createGrupo(grupo: GrupoDTO): Observable<GrupoDTO> {
    return this.http.post<GrupoDTO>(`${this.apiUrl}/grupo`, grupo).pipe(
      tap ((respuesta) =>{
        //console.log("Respuesta desde el backend", respuesta)
      }),
      catchError((error) => {
        console.error('Se produjo al crear el elemento', grupo);
        return throwError(error);
      })
    );
  }

  getGrupo(prmNombreCategoria: string, prmNombreCurso: string, anio: number, iterable: number): Observable<GrupoDTO> {
    return this.http.get<GrupoDTO>(
      `${this.apiUrl}/grupo?categoria=${encodeURIComponent(prmNombreCategoria)}&curso=${encodeURIComponent(prmNombreCurso)}&anio=${(anio)}&iterable=${(iterable)}`).pipe(
        // tap((respuesta) => {
        //   console.log('Respuesta del backend:', respuesta);
        // }),
        catchError((error) => {
          console.error('Se produjo al obtener el elemento');
          return throwError(error);
        })
      );
  }

  updateGrupo(prmNombreCategoria: string, prmNombreCurso: string, grupo: GrupoDTO): Observable<GrupoDTO> {
    return this.http.put<GrupoDTO>(`${this.apiUrl}/grupo?prmCategoria=${encodeURIComponent(prmNombreCategoria)}&prmCurso=${encodeURIComponent(prmNombreCurso)}`, grupo).pipe(
      catchError((error) => {
        console.error('Se produjo al actualizar el curso con los siguientes datos: ', grupo);
        return throwError(error);
      })
    );
  }

  deleteGrupo(prmNombreCategoria: string, prmNombreCurso: string): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/grupo`).pipe(
      catchError((error) => {
        console.error('Se produjo al actualizar el curso con los siguientes datos: ');
        return throwError(error);
      })
    );
  }
}
