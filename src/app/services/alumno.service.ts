import { Injectable } from "@angular/core";
import { Observable, throwError, catchError } from "rxjs";
import { AlumnoDTO } from "../Models/DTOs/alumno-dto";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})

export class AlumnoService {

    private apiUrl = 'http://127.0.0.1:8082/api/v2'

    constructor(private http: HttpClient) { }

    getAlumnosGrupo(categoria: string, curso: string, anio: number, iterable: number): Observable<AlumnoDTO[]> {
        return this.http.get<AlumnoDTO[]>(`${this.apiUrl}/alumnosGrupo?categoria=${encodeURIComponent(categoria)}&curso=${encodeURIComponent(curso)}&anio=${anio}&iterable=${iterable}`).pipe(
        );
    }

    actualizarAlumno(id: number, data: { nombre: string, correo: string, tipoAlumno: string }): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/alumnos/${id}`, data).pipe(
            catchError((error) => throwError(error))
        );
    }
}