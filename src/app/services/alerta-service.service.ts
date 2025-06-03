import { Injectable } from '@angular/core';
import { AlertaDTO } from '../Models/DTOs/alerta-dto';

@Injectable({
  providedIn: 'root',
})
export class AlertaServiceService {
  public alertas: AlertaDTO[] = [];

  constructor() {}

  public guardarAlerta(alerta: AlertaDTO) {
    this.alertas.push(alerta);
  }

  public retornarAlerta(): AlertaDTO []{
    return this.alertas;
  }
}
