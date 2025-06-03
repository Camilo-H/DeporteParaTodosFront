import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SidenavComponent } from 'src/app/viewswebsite/pages/sidenav/sidenav.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VerNotificacionesComponent } from '../ver-notificaciones/ver-notificaciones.component';

@Component({
  selector: 'app-informacion-estudiante',
  standalone: true,
  imports: [CommonModule,MatTableModule, SidenavComponent, MatDialogModule],
  templateUrl: './informacion-estudiante.component.html',
  styleUrls: ['./informacion-estudiante.component.css']
})
export class InformacionEstudianteComponent {
constructor(
  private dialog: MatDialog,
){
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
      { nombre: 'Sala masculino ', tipo: 'Seleccionado - Grupo A', horario: 'Lunes 09:00 - 11:00, Viernes 09:00 - 11:00 Cancha 3' },
       { nombre: 'Futbol 11 masculino', tipo: 'Recreativo - Grupo A', horario: 'Martes 07:00 - 09:00 Cancha 1, Jueves 18:00 Cancha 3'},
      // { nombre: 'Futbol sala masculino', tipo: 'Recreativo', horario: 'por definir' },
      // { nombre: 'Futbol sala femenino', tipo: 'Seleccionado', horario: '8:00 - 10:00' }
    ];
    this.courses.data = courseData;
  }

  openNotificacionesModal():void{
    const dialogRef = this.dialog.open(VerNotificacionesComponent,{

    });
  }

}
