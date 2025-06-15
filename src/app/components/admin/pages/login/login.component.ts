import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { error } from 'console';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  _snackBar = inject(MatSnackBar);
  router = inject(Router);//kullanıcıyı yönlendirmek için Router kullanılır
  hide = true;
  form!:FormGroup;
  fb = inject(FormBuilder);

  userLogin(){
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this._snackBar.open(res.message, 'Kapat', {
          duration: 5000,
          horizontalPosition: 'center', // Snackbar'ın yatay konumu
        })
        if (res.isSuccess) {
          this.router.navigate(['/admin/dashboard']);
          console.log('Giriş başarılı:', res);
        }else{
          this.router.navigate(['/']);
        }
      },
      error:(error) => {
          this._snackBar.open(error.error.message, 'Kapat', {
            duration: 5000,
            horizontalPosition: 'right', // Snackbar'ın yatay konumu
          })
        }
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });
  }
  
}
