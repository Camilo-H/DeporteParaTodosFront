export interface ImagenDTO {
  id: number;
  nombre: string;
  tipoArchivo: string;
  longitud: number;
  datos: Uint8Array;
}
