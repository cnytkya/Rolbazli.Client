import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet,NavbarComponent],
  // templateUrl: './client-layout.component.html',
  template: `
  <app-navbar/>
  <main class="container mx-auto px-4 py-8">
    <router-outlet></router-outlet>
  </main>`,
  // styleUrls: ['./client-layout.component.scss'],
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent {

}
