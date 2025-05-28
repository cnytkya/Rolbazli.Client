import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule,FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  _snackBar = inject(MatSnackBar);
  router = inject(Router)
  hide = true;
  form!:FormGroup;
  // fb = Inject(FormBuilder);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngSubmit(){
    this.authService.login(this.form.value).subscribe({
      next:(res) => {
        this._snackBar.open('Giriş Başarılı', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'center',
        })
        if(res.isSuccess){
          this.router.navigate(['/admin/dashboard']);
          console.log("Giriş Başarılı",res);
        }
      },
      error: (err) =>{
        this._snackBar.open('Giriş Başarısız', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'center',
        })
      }
    })
  }
}
