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
    { nombre: 'Sala masculino', tipo: 'Semillero', horario: '8:00 - 10:00' },
    { nombre: 'Futbol 11 masculino', tipo: 'Semillero', horario: '14:00 - 16:00' },
    { nombre: 'Futbol sala masculino', tipo: 'Recreativo', horario: '11:00 - 13:00' },
    { nombre: 'Futbol sala femenino', tipo: 'Seleccionado', horario: '18:00 - 20:00' }
  ]);

  ngOnInit() {
    const courseData = [
      { nombre: 'Sala masculino ', tipo: 'Semillero - Grupo A', horario: 'Lunes 09:00 - 11:00, Viernes 09:00 - 11:00 Cancha 1' },
      { nombre: 'Natación nivel 1 ', tipo: 'Seleccionado - Grupo A', horario: 'Lunes 14:00 - 16:00 Piscina' },
    ];
    this.courses.data = courseData;
  }




}
