import { AlumnoDTO } from "./alumno-dto";
export interface AtencionDTO {
    alumno: AlumnoDTO;
    idClase: number;
    estadoAtendido: boolean;
}