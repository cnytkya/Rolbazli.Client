import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,MatSnackBarModule,MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showUserDropdown = false;
  matSnackbar = inject(MatSnackBar); //kullanıcı çıkış yaptığında bir mesaj göstermek için kullanılabilir.
  authService = inject(AuthService)
  router = inject(Router)

  constructor( ){}
  
  
  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  toggleSidebar(): void {
    // Sidebar toggle logic will be handled via service or state management
  }

}
