import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from "../../../pages/sidenav/sidenav.component";

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule,
    //BrowserAnimationsModule,
    SidenavComponent
  ],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent {
  showTable = true;

  reportData: { nombre: string; atenciones: number; horas: number }[] = [
    { nombre: 'Camilo Anacona', atenciones: 12, horas: 24 },
    { nombre: 'Fabian Lasso', atenciones: 10, horas: 20 },
    { nombre: 'Kelvin Chilito', atenciones: 20, horas: 40 },
    { nombre: 'Sandra Lopez', atenciones: 15, horas: 30 },
    { nombre: 'Angela Muñoz', atenciones: 17, horas: 34 },
    { nombre: 'Jose Bastidas', atenciones: 12, horas: 24 },
    { nombre: 'Juli Ordoñez', atenciones: 14, horas: 28 },
    // Otros datos...
  ];



  chartData = this.reportData.map((item) => ({
    name: item.nombre,
    value: item.atenciones,
  }));

  filteredReportData = [...this.reportData];
  filteredChartData = [...this.chartData];


  students = ['Camilo Anacona', 'Fabian Lasso', 'Kelvin Chilito'];
  sports = ['Natación', 'Fútbol', 'Voleibol'];
  faculties = ['Ingeniería', 'Ciencias Sociales', 'Deportes'];
  selectedStudent = '';
  selectedSport = '';
  selectedFaculty = '';
  selectedInstructor = '';

  toggleView(view: string) {
    this.showTable = view === 'table';
  }

  getTotal(key: 'atenciones' | 'horas'): number {
    return this.filteredReportData.reduce((sum, item) => sum + item[key], 0);
  }


  applyFilters() {
    this.filteredReportData = this.reportData.filter((item) => {
      const byStudent = this.selectedStudent
        ? item.nombre === this.selectedStudent
        : true;
      const byInstructor = this.selectedInstructor
        ? item.nombre.toLowerCase().includes(this.selectedInstructor.toLowerCase())
        : true;
      // Puedes agregar lógica para sports y faculties si son aplicables

      return byStudent && byInstructor;
    });

    this.filteredChartData = this.filteredReportData.map((item) => ({
      name: item.nombre,
      value: item.atenciones,
    }));
  }

  limpiarFiltros(){
this.filteredChartData;
  }

  downloadData() {
    // Lógica para descargar datos en CSV o Excel
    console.log('Descargando datos...');
  }
}
