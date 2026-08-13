import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError} from 'rxjs';
import { HorarioDTO } from '../Models/DTOs/horario-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private apiUrl = 'http://127.0.0.1:8082/api/v2';
  constructor(private http: HttpClient) { }

  getHorarios(categoria: string, curso: string, anio: number, iterable: number): Observable<HorarioDTO[]> {
    return this.http.get<HorarioDTO[]>(`${this.apiUrl}/horarios?categoria=${encodeURIComponent(categoria)}&curso=${encodeURIComponent(curso)}&anio=${anio}&iterable=${iterable}`).pipe(
      catchError((error) => throwError(error))
    );
  }

  crearHorario(horario: HorarioDTO): Observable<HorarioDTO> {
    return this.http.post<HorarioDTO>(`${this.apiUrl}/horario`, horario).pipe(
      catchError((error) => throwError(error))
    );
  }

  eliminarHorario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/horario?prmId=${id}`).pipe(
      catchError((error) => throwError(error))
    );
  }
}
