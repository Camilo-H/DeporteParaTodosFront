import { CursoDTO } from './curso-dto';
import { ImagenDTO } from './imagen-dto';

export interface GrupoDTO {
  nombre: string;
  anio: number;
  iterable: number;
  curso: CursoDTO;
  imagen: ImagenDTO;
  cupos: number;
  estado: string;
  fechaCreacion: Date;
  fechaFinalizacion: Date;
}
