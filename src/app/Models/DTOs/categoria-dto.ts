import { CursoDTO } from "./curso-dto";
import { ImagenDTO } from "./imagen-dto";

export interface CategoriaDTO {
    titulo: string;
    descripcion: string;
    rutaImagen?: string;
    imagen?: ImagenDTO | null;
    cursos: CursoDTO [];
}
