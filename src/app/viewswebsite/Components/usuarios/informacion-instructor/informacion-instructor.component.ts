import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';


@Component({
  selector: 'app-informacin-instructor',
  standalone: true,
  imports: [CommonModule, MatTableModule, SidenavComponent],
  templateUrl: './informacion-instructor.component.html',
  styleUrls: ['./informacion-instructor.component.css']
})
export class InformacinInstructorComponent {

  constructor(){
    this.ngOnInit();
  }
  displayedColumns: string[] = ['nombre', 'tipo', 'horario'];
  courses = new MatTableDataSource([
    { nombre: 'Futbol 11 femenino', tipo: 'Semillero', horario: 'Undefine' },
    { nombre: 'Futbol 11 masculino', tipo: 'Semillero', horario: 'Undefine' },
    { nombre: 'Futbol sala masculino', tipo: 'Recreativo', horario: 'Undefine' },
    { nombre: 'Futbol sala femenino', tipo: 'Seleccionado', horario: 'Undefine' }
  ]);

  ngOnInit() {
    const courseData = [
      { nombre: 'Futbol 11 femenino', tipo: 'Semillero', horario: 'Undefine' },
      { nombre: 'Futbol 11 masculino', tipo: 'Semillero', horario: 'Undefine' },
      { nombre: 'Futbol sala masculino', tipo: 'Recreativo', horario: 'Undefine' },
      { nombre: 'Futbol sala femenino', tipo: 'Seleccionado', horario: 'Undefine' }
    ];
    this.courses.data = courseData;
  }




}
