import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { InscripcionDTO } from '../Models/DTOs/inscripcion-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private apiUrl = 'http://127.0.0.1:8082/api/v2';
  constructor(private http: HttpClient) { }

  postInscripcion(data: InscripcionDTO): Observable<InscripcionDTO> {
    return this.http.post<InscripcionDTO>(`${this.apiUrl}/inscripcion`, data).pipe(

      catchError((error) => {
        console.error('Se produjo un error al crear la inscripcion');
        return throwError(error);
      })
    );
  }

  eliminarInscripcion(data: InscripcionDTO): Observable<InscripcionDTO> {
    return this.http.put<InscripcionDTO>(`${this.apiUrl}/desvincularInscripcion`, data).pipe(
      catchError((error) => {
        console.error('No se pudo eliminar la inscripcion');
        return throwError(error);
      })
    );
  }
}






