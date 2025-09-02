import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { DeporteDTO } from '../Models/DTOs/deporte-dto';

@Injectable({
  providedIn: 'root'
})
export class DeporteService {

  private url = 'http://127.0.0.1:8082/api';

  constructor(private http: HttpClient) { }

  getDeportes(): Observable<DeporteDTO[]> {
    return this.http.get<DeporteDTO[]>(`${this.url}/deportes`).pipe(
      catchError((error) => {
        console.error("Se produjo un error al consultar los deportes.");
        return throwError(error);
      })
    );
  }

  crearDeporte(deporte: DeporteDTO): Observable<DeporteDTO> {
    return this.http.post<DeporteDTO>(`${this.url}/deportes`, deporte).pipe(
      catchError((error) => {
        console.error('Se produjo un error al crear el elemento ');
        return throwError(error);
      })
    );
  }
}
