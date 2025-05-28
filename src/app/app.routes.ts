import { Routes } from '@angular/router';

export const routes: Routes = [
    //Client(public) Layout
    {
        path: '',
        loadComponent: () => import('./components/clients/layout/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
        children:[
            {
                path: '',loadComponent: () => import('./components/clients/pages/home/home.component').then(m => m.HomeComponent)
            },
            {
                path:'home',redirectTo: ''
            }
        ]
    },
    //Auth(public) Routes - Login and Register
    {
        path: 'auth',
        loadComponent: () => import('./components/auth/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            {
                path: 'login', loadComponent: () => import('./components/admin/pages/login/login.component').then(m => m.LoginComponent), title: 'Giriş Yap'
            }, 
            {
                path: 'register', loadComponent: () => import('./components/admin/pages/register/register.component').then(m => m.RegisterComponent), title: 'Kayıt Ol'
            },
            {
                path: '', redirectTo: 'login', pathMatch: 'full'
            }
        ]
    },
    //Admin(private) Routes: Kullanıcı eğer giriş yapmışsa ve admin ise bu sayfaları görebilsin. Burda AuthGuard kullanılabilir.
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        //Burda AuthGuard kullanılacak ve aşağıdaki children'lar sadece admin yetkisi olan kullanıcılar tarafından görülebilecek.
        children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {
                path:'dashboard',
                loadComponent: () => import('./components/admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
            }// Diğer admin sayfaları buraya eklenecek.
        ]    
    }
    // {
    //     // Eğer tanımlanmamış bir rota varsa, 404 sayfasına yönlendir.
    // }
];
