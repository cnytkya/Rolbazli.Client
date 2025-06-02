import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";

import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../admin/layout/navbar/navbar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,SidebarComponent, NavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  isSidebarOpen = true;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
