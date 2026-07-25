
export interface CursoDTO {
  nombre: string;

  deporte: string;

  categoriaCurso: string;

  descripcion: string;

  idImagen?: number | null;

  eliminado?: number | null;

  estadoCurso?: 'ACTIVO' | 'INACTIVO' | 'CERRADO';

  horario?: string | null;

  estadoInscripciones?: 'ABIERTO' | 'CERRADO';

  imagenBase64?: string | null;

  tipoArchivo?: string | null;
}
