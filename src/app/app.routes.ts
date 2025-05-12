import { Routes } from '@angular/router';
import { HomeComponent } from './components/clients/home/home.component';
import { LoginComponent } from './components/admin/login/login.component';
import { RegisterComponent } from './components/admin/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    }
];
