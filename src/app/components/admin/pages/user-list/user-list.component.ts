import { Component, OnInit } from '@angular/core';
import { UserDetail } from '../../../../interfaces/user-detail';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit { // OnInit arayüzünü implement ederek bileşen yüklendiğinde çalışacak metodu tanımlar
  users: UserDetail[] = []; // Kullanıcı listesini tutacak boş bir dizi, UserDetail tipinde
  errorMessage: string | null = null; // Hata mesajlarını tutacak değişken, başlangıçta null

  constructor(private authService: AuthService) { } // AuthService'i dependency injection ile enjekte eder

  ngOnInit(): void { // Bileşen başlatıldığında otomatik olarak çağrılan yaşam döngüsü metodu
    this.loadUsers(); // Kullanıcıları yüklemek için metodu çağırır
  }

  loadUsers(): void { // Kullanıcı verilerini AuthService üzerinden çeken metot
    this.authService.getAllUsers().subscribe({ // getAllUsers metodunu çağırır ve Observable'a abone olur
      next: (data) => { // Veri başarıyla geldiğinde çalışacak callback
        this.users = data; // Gelen kullanıcı verilerini 'users' dizisine atar
        this.errorMessage = null; // Önceki hataları temizler
      },
      error: (err) => { // İstekte bir hata oluştuğunda çalışacak callback
        console.error('Kullanıcılar yüklenemedi:', err); // Konsola hata detaylarını loglar
        this.errorMessage = 'Kullanıcılar yüklenemedi. Lütfen daha sonra tekrar deneyin.'; // Kullanıcıya gösterilecek hata mesajını ayarlar
        // Hata kodlarına göre (örn. 401 Unauthorized) farklı işlemler yapılabilir
      }
    });
  }
}
