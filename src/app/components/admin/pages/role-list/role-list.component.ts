// src/app/components/admin/pages/role-list/role-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../../interfaces/role';
import { RoleService } from '../../../../services/role.service';
import { AuthService } from '../../../../services/auth.service';
import { UserDetail } from '../../../../interfaces/user-detail';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  users: UserDetail[] = []; // Kullanıcı listesini tutacak
  newRoleName: string = '';
  editingRole: Role | null = null;
  editedRoleName: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Rol atama için yeni değişkenler
  assignSelectedUserId: string | null = null; // Seçilen kullanıcı ID'si
  assignSelectedRoleId: string | null = null; // Seçilen rol ID'si

  constructor(
    private roleService: RoleService,
    private authService: AuthService
) { }

   ngOnInit(): void {
    this.loadRoles();
    this.loadUsers(); // Kullanıcıları da yükle
  }

  // Tüm rolleri API'den çeker (totalUsers bilgisi de gelir)
  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Roller yüklenemedi:', err);
        this.errorMessage = 'Roller yüklenirken bir hata oluştu.';
        this.successMessage = null;
      }
    });
  }

   // Tüm kullanıcıları API'den çeker
  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Kullanıcılar yüklenemedi:', err);
        // Kullanıcılara gösterilmeyecek, sadece konsola loglanacak.
      }
    });
  }
  

  // Yeni rol ekler
  roleEkle(): void {
    if (!this.newRoleName.trim()) {
      this.errorMessage = 'Rol adı boş olamaz.';
      return;
    }
    this.roleService.addRole({ name: this.newRoleName.trim() }).subscribe({
      next: (role) => {
        // Yeni eklenen rolü backend'den gelen totalUsers bilgisiyle birlikte listeye ekleriz
        this.roles.push(role);
        this.newRoleName = '';
        this.successMessage = `"${role.name}" rolü başarıyla eklendi.`;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Rol eklenirken hata oluştu:', err);
        this.errorMessage = 'Rol eklenirken bir hata oluştu.';
        this.successMessage = null;
      }
    });
  }

  // Rol düzenleme modunu açar
  startEdit(role: Role): void {
    // totalUsers dahil tüm rol bilgilerini kopyalarız, ancak düzenleme sadece 'name' üzerinde yapılır
    this.editingRole = { ...role };
    this.editedRoleName = role.name;
    this.errorMessage = null;
    this.successMessage = null;
  }

  // Rol düzenlemesini iptal eder
  cancelEdit(): void {
    this.editingRole = null;
    this.editedRoleName = '';
    this.errorMessage = null;
    this.successMessage = null;
  }

  // Rolü günceller
  updateRole(): void {
    if (!this.editingRole || !this.editedRoleName.trim()) {
      this.errorMessage = 'Geçerli bir rol adı girin.';
      return;
    }

    const updatedRole: Role = {
      id: this.editingRole.id,
      name: this.editedRoleName.trim(),
      totalUsers: this.editingRole.totalUsers // totalUsers bilgisini koruruz, backend bunu dikkate almayabilir
    };

    this.roleService.updateRole(updatedRole).subscribe({
      next: () => {
        const index = this.roles.findIndex(r => r.id === updatedRole.id);
        if (index !== -1) {
          // Listeyi güncellerken totalUsers bilgisini koruruz
          this.roles[index] = { ...updatedRole, totalUsers: this.roles[index].totalUsers };
        }
        this.successMessage = `"${updatedRole.name}" rolü başarıyla güncellendi.`;
        this.cancelEdit();
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Rol güncellenirken hata oluştu:', err);
        this.errorMessage = 'Rol güncellenirken bir hata oluştu.';
        this.successMessage = null;
      }
    });
  }

  // Rolü siler
  deleteRole(id: string, name: string): void {
    if (confirm(`"${name}" rolünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r.id !== id);
          this.successMessage = `"${name}" rolü başarıyla silindi.`;
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('Rol silinirken hata oluştu:', err);
          this.errorMessage = 'Rol silinirken bir hata oluştu.';
          this.successMessage = null;
        }
      });
    }
  }

  // YENİ: Kullanıcıya rol atama metodu
  assignRoleToUser(): void {
    this.clearMessages();
    if (!this.assignSelectedUserId || !this.assignSelectedRoleId) {
      this.errorMessage = 'Lütfen bir kullanıcı ve bir rol seçin.';
      return;
    }

    this.roleService.assignRoleToUser(this.assignSelectedUserId, this.assignSelectedRoleId).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Rol başarıyla atandı.';
        this.assignSelectedUserId = null; // Formu temizle
        this.assignSelectedRoleId = null; // Formu temizle
        this.loadUsers(); // Kullanıcı listesini yeniden yükle (rolleri güncellenmiş halleriyle görmek için)
        this.loadRoles(); // Roller listesini de güncellenmiş totalUsers ile görmek için
      },
      error: (err) => {
        console.error('Rol atama hatası:', err);
        this.errorMessage = err.error?.message || err.error?.title || 'Rol atama sırasında bir hata oluştu.';
      }
    });
  }

  // Mesajları temizleyen yardımcı metot
  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
