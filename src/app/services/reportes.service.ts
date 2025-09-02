import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { EstadisticasDTO } from '../Models/DTOs/estadisticas-dto';

@Injectable({
    providedIn: 'root',
})

export class ReportesService {
    private apiUrl = 'http://127.0.0.1:8082/api/v2';

    constructor(private http: HttpClient) { }

    getEstadisticasCategoria(fechaInicio: string, fechaFin: string, categoria: string): Observable<EstadisticasDTO[]> {
        return this.http.get<EstadisticasDTO[]>(`${this.apiUrl}/estadisticas/categorias?
            fechaInicio=${encodeURIComponent(fechaInicio)}
            &fechaFin=${encodeURIComponent(fechaFin)}
            &categoria=${encodeURIComponent(categoria)}`).pipe(

        );
    }

    getEstadisticasCursos(fechaInicio: string, fechaFin: string, categoria: string, curso: string): Observable<EstadisticasDTO[]> {
        return this.http.get<EstadisticasDTO[]>(`${this.apiUrl}/estadisticas/cursos?
            fechaInicio=${encodeURIComponent(fechaInicio)}
            &fechaFin=${encodeURIComponent(fechaFin)}
            &categoria=${encodeURIComponent(categoria)}
            &curso=${encodeURIComponent(curso)}`).pipe(

        );
    }

    getEstadisticasGrupos(fechaInicio: string, fechaFin: string, categoria: string, curso: string, anio: number, iterable: number): Observable<EstadisticasDTO[]> {
        return this.http.get<EstadisticasDTO[]>(`${this.apiUrl}/estadisticas/grupos?
            fechaInicio=${encodeURIComponent(fechaInicio)}
            &fechaFin=${encodeURIComponent(fechaFin)}
            &categoria=${encodeURIComponent(categoria)}
            &curso=${encodeURIComponent(curso)}
            &anio=${anio}
            &iterable=${iterable}`).pipe(

        );
    }

    getEstadisticasAlumnos(fechaInicio: string, fechaFin: string, alumno: string): Observable<EstadisticasDTO[]> {
        return this.http.get<EstadisticasDTO[]>(`${this.apiUrl}/estadisticas/alumnos?
             fechaInicio=${encodeURIComponent(fechaInicio)}
            &fechaFin=${encodeURIComponent(fechaFin)}
            &alumno=${encodeURIComponent(alumno)}`).pipe(

        );
    }

    getEstadisticasInstructores(fechaInicio: string, fechaFin: string, instructor: string): Observable<EstadisticasDTO[]> {
        return this.http.get<EstadisticasDTO[]>(`${this.apiUrl}/estadisticas/instructores?
            fechaInicio=${encodeURIComponent(fechaInicio)}
            &fechaFin=${encodeURIComponent(fechaFin)}
            &instructor=${encodeURIComponent(instructor)}`).pipe(

        );
    }

    getEstadisticasFacultad(): void {

    }

    getEstadisticasPrograma(): void {

    }

}
