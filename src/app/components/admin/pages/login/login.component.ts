import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule,FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
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
    this.authService.login(this.form.value).subscribe((response)=>{
      console.log("Giriş Başarılı",response);
    })
  }
}
