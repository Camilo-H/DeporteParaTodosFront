import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CategoriaDTO } from '../Models/DTOs/categoria-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'http://127.0.0.1:8082/api/v2';

  constructor(private http: HttpClient) { }

  // Método para obtener la lista de categorías
  getCategorias(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${this.apiUrl}/categorias2`).pipe(
      catchError((error) => {
        console.error('Se produjo un error al recuperar los elementos ');
        return throwError(error);
      })
    );
  }

  // Método para crear una nueva categoría
  createCategoria(categoria: CategoriaDTO): Observable<CategoriaDTO> {
    return this.http.post<CategoriaDTO>(`${this.apiUrl}/categoria`, categoria).pipe(
      catchError((error) => {
        console.error('Se produjo un error al crear el elemento ');
        return throwError(error);
      })
    );
  }

  getCategoria(titulo: string): Observable<CategoriaDTO> {
    return this.http.get<CategoriaDTO>(`${this.apiUrl}/categoria?titulo=${titulo}`).pipe(
      catchError((error) => {
        console.error('Se produjo un error al recuperar el elemento ', titulo);
        return throwError(error);
      })
    );
  }

  // Método para actualizar una categoría existente
  updateCategoria(titulo: string,categoria: CategoriaDTO): Observable<CategoriaDTO> {
    return this.http.put<CategoriaDTO>(`${this.apiUrl}/categoria?titulo=${titulo}`, categoria)
      .pipe(
        catchError((error) => {
          console.error(
            'Se produjo un error al actualizar el elemento ',
            titulo
          );
          return throwError(error);
        })
      );
  }

  // Método para eliminar una categoría
  deleteCategoria(titulo: string): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/categoria?titulo=${titulo}`).pipe(
      catchError((error) => {
        console.error('Se produjo un error al eliminar el elemento ', titulo);
        return throwError(error);
      })
    );
  }
}
