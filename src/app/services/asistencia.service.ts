import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AtencionDTO } from '../Models/DTOs/atencion-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = 'http://127.0.0.1:8082/api/v2';

  constructor(private http: HttpClient) { }
  
}
