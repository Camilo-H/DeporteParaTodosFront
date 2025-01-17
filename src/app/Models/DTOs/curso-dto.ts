import { CategoriaDTO } from './categoria-dto';
import { DeporteDTO } from './deporte-dto';
import { GrupoDTO } from './grupo-dto';
import { ImagenDTO } from './imagen-dto';

export interface CursoDTO {
  nombre: string;

  deporte: DeporteDTO;

  categoria: CategoriaDTO;

  descripcion: string;

  imagen: ImagenDTO;

  grupos: GrupoDTO[];
}
