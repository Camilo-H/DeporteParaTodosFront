
export interface CursoDTO {
  nombre: string;

  deporte: string;

  categoriaCurso: string;

  descripcion: string;

  idImagen?: number | null;

  eliminado?: number | null;

  imagenBase64?: string | null;

  tipoArchivo?: string | null;
}
