export interface ImagenDTO {
  id: number | null;
  nombre: string;
  tipoArchivo: string;
  longitud: number;
  datosMultipartFile?: File;
  datosBase64: string;
}
