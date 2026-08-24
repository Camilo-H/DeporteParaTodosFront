import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterchangeService {
  private readonly apiUrl = 'http://127.0.0.1:8082/api/v2';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  exchangeGoogleToken(idToken: string): Observable<void> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/token`, { idToken }).pipe(
      tap(resp => sessionStorage.setItem('dpt_token', resp.token)),
      map(() => void 0),
      catchError(err => {
        if (err.status === 404) {
          // Usuario autenticado con Google pero sin rol registrado en el sistema.
          // SCRUM-159: redirige a CompletarPerfilComponent donde elige rol
          // y completa sus datos identificativos.
          this.router.navigate(['/completar-perfil']);
          return EMPTY;
        }
        return throwError(() => err);
      })
    );
  }
}
