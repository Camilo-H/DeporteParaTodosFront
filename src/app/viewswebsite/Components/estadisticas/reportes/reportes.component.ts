import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from "../../../pages/sidenav/sidenav.component";
import { ReportesService } from 'src/app/services/reportes.service';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaDTO } from 'src/app/Models/DTOs/categoria-dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EstadisticasDTO } from 'src/app/Models/DTOs/estadisticas-dto';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CursodeportivoService } from 'src/app/services/cursodeportivo.service';
import { CursoDTO } from 'src/app/Models/DTOs/curso-dto';
import { GrupoService } from 'src/app/services/grupo.service';
import { GrupoDTO } from 'src/app/Models/DTOs/grupo-dto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    NgxChartsModule,
    MatSelectModule,
    SidenavComponent,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,

  ],

  providers: [
    MatNativeDateModule,
    MatDatepickerModule,
    DatePipe,
  ],

  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  filtros!: FormGroup;
  dataSource = new MatTableDataSource<EstadisticasDTO>();
  displayedColumns: string[] = ['leyenda1', 'clases', 'duracion'];
  chartData: { name: string; value: number }[] = [];
  selectedTabIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categorias: CategoriaDTO[] = [];
  cursos: CursoDTO[] = [];
  grupos: GrupoDTO[] = [];


  dtoEstadisticas: EstadisticasDTO = {
    leyenda1: '',
    leyenda2: '',
    leyenda3: '',
    leyenda4: '',
    clases: 0,
    horas: 0,
    minutos: 0,
    duracion: 0,
  }

  fechaActual: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private repotesService: ReportesService,
    private categoriaService: CategoriaService,
    private cursosService: CursodeportivoService,
    private grupoService: GrupoService,
    private router: Router,
    private datepipe: DatePipe,
  ) { }



  ngOnInit(): void {
    this.initForm();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarCategorias();
    this.cargarCursos();
    this.cargarGrupos();
  }

  private initForm() {
    this.filtros = this.fb.group({
      inicio: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      fin: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      categoria: [''],
      curso: [''],
      anio: [null],
      iterable: [null],
      alumno: [''],
      instructor: ['']
    });
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (categoriasTemp) => {
        this.categorias = categoriasTemp;
      }
    );
  }

  cargarCursos(): void {
    this.cursosService.getAllCursos().subscribe(
      (response) => {
        this.cursos = response;
      }
    );
  }

  cargarGrupos(): void {
    this.grupoService.getGrupos('Categoría 1', 'Curso02').subscribe(
      (response) => {
        this.grupos = response;
      }
    );
  }

  generarReporte() {
    const { inicio, fin, categoria, curso, anio, iterable, alumno, instructor } = this.filtros.value;

    // Ejemplo: escogemos la llamada según los filtros llenados
    let obs$: Observable<EstadisticasDTO[]>;
    if (categoria && !curso) {
      obs$ = this.repotesService.getEstadisticasCategoria(inicio, fin, categoria);
      this.displayedColumns = ['leyenda1', 'clases', 'duracion'];
    } else if (categoria && curso && !anio) {
      obs$ = this.repotesService.getEstadisticasCursos(inicio, fin, categoria, curso);
      this.displayedColumns = ['leyenda1', 'leyenda2', 'clases', 'duracion'];
    } else if (categoria && curso && anio != null && iterable != null) {
      obs$ = this.repotesService.getEstadisticasGrupos(inicio, fin, categoria, curso, anio, iterable);
      this.displayedColumns = ['leyenda1', 'leyenda2', 'leyenda3', 'leyenda4', 'clases', 'duracion'];
    } else if (alumno) {
      obs$ = this.repotesService.getEstadisticasAlumnos(inicio, fin, alumno);
      this.displayedColumns = ['leyenda1', 'clases', 'duracion'];
    } else if (instructor) {
      obs$ = this.repotesService.getEstadisticasInstructores(inicio, fin, instructor);
      this.displayedColumns = ['leyenda1', 'clases', 'duracion'];
    } else {
      // manejas error o llamada default
      return;
    }

    obs$.subscribe(datos => {
      this.dataSource.data = datos;
      this.chartData = datos.map(d => ({
        name: d.leyenda1,
        value: d.clases
      }));
    });
  }

  showTable():void {

  }

  showChart():void{
    
  }


  limpiarFiltros() {
    const hoy = new Date();
    this.filtros.reset({
      inicio: hoy,
      fin: hoy,
      categoria: '',
      curso: '',
      grupo: null,
      alumno: '',
      instructor: ''
    });
    // Nota: no cambiamos selectedTabIndex ni dataSource; si quieres borrar la tabla también:
    // this.dataSource.data = [];
    // this.chartData = [];
  }

  private FormatDate(fecha: string): string {
    return this.datepipe.transform(fecha, 'yyyy-MM-dd')!;
  }

  validarFechaCreacion = (fecha: Date | null): boolean => {
    return !fecha || fecha <= this.fechaActual;
  }

  validarFechaCierre = (fecha: Date | null): boolean => {
    return !fecha || fecha >= this.fechaActual;
  }


  downloadData() {
    // Lógica para descargar datos en CSV o Excel
    console.log('Descargando datos...');
  }
}
