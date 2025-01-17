import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from "../sidenav/sidenav.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, SidenavComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

}
