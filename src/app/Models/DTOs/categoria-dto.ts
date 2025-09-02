export interface CategoriaDTO {
    titulo: string;
    descripcion: string;
    imagenId?: number | null;
    eliminado?: number | null;
    imagenBase64?: string | null;
    tipoArchivo?: string | null;
}
