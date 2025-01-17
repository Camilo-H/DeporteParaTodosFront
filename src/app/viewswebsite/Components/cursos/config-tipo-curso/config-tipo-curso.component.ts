import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-config-tipo-curso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-tipo-curso.component.html',
  styleUrls: ['./config-tipo-curso.component.css']
})
export class ConfigTipoCursoComponent {
  menuVisible = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  edit() {
    alert('Editar seleccionado');
    this.menuVisible = false; // Oculta el menú después de seleccionar
  }

  delete() {
    alert('Eliminar seleccionado');
    this.menuVisible = false; // Oculta el menú después de seleccionar
  }

  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.config-button, .menu')) {
      this.menuVisible = false;
    }
  }
}
