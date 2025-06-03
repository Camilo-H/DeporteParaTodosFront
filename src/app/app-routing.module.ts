import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormInscripcionesComponent } from './viewswebsite/Components/usuarios/form-inscripciones/form-inscripciones.component';
import { HomeComponent } from './viewswebsite/pages/home/home.component';
import { CursosDeportivosComponent } from './viewswebsite/Components/cursos/cursos-deportivos/cursos-deportivos.component';
import { ListDeportistasdeCursoComponent} from './viewswebsite/Components/cursos/list-deportistasde-curso/list-deportistasde-curso.component';
import { ConfigTipoCursoComponent } from './viewswebsite/Components/cursos/config-tipo-curso/config-tipo-curso.component';
import { LoginComponent } from './auth/login/login.component';
import { FormCursoDeportiviComponent } from './viewswebsite/Components/cursos/form-curso-deportivo/form-curso-deportivi.component';
import { NuevoCursoCategoriaComponent } from './viewswebsite/Components/cursos/nuevo-curso-categoria/nuevo-curso-categoria.component';
import { ListGruposComponent } from './viewswebsite/Components/cursos/list-grupos/list-grupos.component';
import { FormularioComponent } from './viewswebsite/Components/usuarios/formulario/formulario.component';
import { InformacinInstructorComponent } from './viewswebsite/Components/usuarios/informacion-instructor/informacion-instructor.component';
import { InformacionCursoComponent } from './viewswebsite/Components/cursos/informacion-curso/informacion-curso.component';
import { ListaInstructoresComponent } from './viewswebsite/Components/usuarios/lista-instructores/lista-instructores.component';
import { ReportesComponent } from './viewswebsite/Components/estadisticas/reportes/reportes.component';
//import { ListaCursosComponent } from './viewswebsite/Components/cursos/lista-cursos/lista-cursos.component';
import { RegistroInstructorComponent } from './viewswebsite/Components/usuarios/registro-instructor/registro-instructor.component';
import { InformacionEstudianteComponent } from './viewswebsite/Components/usuarios/informacion-estudiante/informacion-estudiante.component';
import { FormAlertaComponent } from './viewswebsite/Components/usuarios/form-alerta/form-alerta.component';

const routes: Routes = [
  {path:'', redirectTo:'home',pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'inscripciones', component:FormInscripcionesComponent},
  {path: 'cursos_deportivos/:identificador', component: CursosDeportivosComponent}, //cursos deportivos
  {path: 'listaDeportistasCurso', component: ListDeportistasdeCursoComponent },//deportistas de curso
  {path: 'configuracionCatCurso', component: ConfigTipoCursoComponent},//Configuraciones de categoría
  {path: 'login', component: LoginComponent},
  {path: 'registroDeCursoDeportivo', component: FormCursoDeportiviComponent}, //registrar un deporte
  {path: 'nuevoCursoCategoria', component: NuevoCursoCategoriaComponent},
  {path: 'list-grupos/:identificador', component: ListGruposComponent},
  {path: 'formulario', component: FormularioComponent},
  {path: 'info-instructor', component: InformacinInstructorComponent},
  {path: 'info-curso', component: InformacionCursoComponent},
  {path: 'lista-instructores', component: ListaInstructoresComponent},
  {path: 'reportes', component:ReportesComponent},
  //{path: 'listaCursos', component:ListaCursosComponent},
  {path: 'inscripcionInstructor', component: RegistroInstructorComponent},
  {path: 'info-estudiante', component: InformacionEstudianteComponent},
  {path: 'notificacion', component: FormAlertaComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
