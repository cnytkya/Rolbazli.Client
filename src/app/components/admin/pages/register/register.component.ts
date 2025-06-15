import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink,CommonModule,MatIconModule,ReactiveFormsModule,AsyncPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  hide: boolean = true;
  confirmPasswordHide: boolean = true;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  private roleService = inject(RoleService);

  registerForm!: FormGroup;
  roles$!: Observable<Role[]>;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        roles: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    this.loadRoles();
  }

  loadRoles() {
    this.roles$ = this.roleService.getRoles();
    this.roles$.subscribe({
      next: (roles) => console.log('Roles loaded:', roles),
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      roles: [this.registerForm.value.roles]
    };

    this.http.post(`${environment.apiUrl}account/register`, formData).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
      }
    });
  }
}
