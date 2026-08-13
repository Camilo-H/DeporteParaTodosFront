import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { EscenarioDTO } from '../Models/DTOs/escenario-dto';

@Injectable({
  providedIn: 'root',
})
export class EscenarioService {
  private apiUrl = 'http://127.0.0.1:8082/api/v2';

  constructor(private http: HttpClient) {}

  getEscenarios(): Observable<EscenarioDTO[]> {
    return this.http.get<EscenarioDTO[]>(`${this.apiUrl}/escenarios`).pipe(
      catchError((error) => throwError(error))
    );
  }
}
