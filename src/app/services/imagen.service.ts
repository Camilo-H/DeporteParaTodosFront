import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ImagenDTO } from '../Models/DTOs/imagen-dto';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  private apiUrl = 'http://127.0.0.1:8082/api/v2';

  constructor(private http: HttpClient) { }

  // Método para obtener la imagen
  getimagen(idImagen: number): Observable<ImagenDTO> {
    return this.http.get<ImagenDTO>(`${this.apiUrl}/imagen?idImagen=${idImagen}`).pipe(
      catchError((error) => {
        console.error(
          'Se produjo un error al obtener la imagen de la categoría'
        );
        return throwError(error);
      })
    );
    
  }

  postImagen(file: File): Observable<ImagenDTO> {
    const formData = new FormData();
    formData.append('datosMultipartFile', file);
    formData.append('nombre', file.name);
    formData.append('tipoArchivo', file.type);
    formData.append('longitud', file.size.toString());

    return this.http.post<ImagenDTO>(`${this.apiUrl}/imagenMultipart`, formData).pipe(
      catchError((error) => {
        console.error('Se produjo un error al crear la imagen en el sistema', error);
        return throwError(() => error);
      })
    );
  }
  //this.http.get<ImagenDTO>(`${this.apiUrl}/imagen/${idImagen}`)
}
