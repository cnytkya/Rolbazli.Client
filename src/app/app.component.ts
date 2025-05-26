import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/clients/layout/navbar/navbar.component";
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Login ve register sayfalarında navbar'ı gizle
        this.showNavbar = !['/login', '/register'].includes(event.url);
      }
    });
  }
}
