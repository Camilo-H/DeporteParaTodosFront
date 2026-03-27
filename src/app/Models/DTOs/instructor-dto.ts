export interface PerfilInstructor {
    id: string;
    nombre: string;
    correo: string;
    imagen: number;
    tipoId: string;
    sexo: string;
    rol: string | null;
}

export interface InstructorDTO {
    inst_codigo: string;
    perfil: PerfilInstructor;
}