import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
/**Material Modules */
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PerfilService } from 'src/app/services/perfil.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: 
  [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,

  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  selectedProfile?: string;
  constructor(private router: Router, private perfilservice: PerfilService) { 
    this.perfilservice.perfil$.subscribe((perfil) => {
      this.selectedProfile = perfil;
    });

  }

  onProfileChange(perfil: string) {
    this.perfilservice.setPerfil(perfil);
  }

  /*redirectionTo(param:any){
    this.router.navigate([param]);
  }*/

  redirectionTo(url: string): void {
    window.location.href = url;
  }
}
