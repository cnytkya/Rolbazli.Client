import { Routes } from '@angular/router'; // Angular Router'dan Routes tipini içe aktarır

export const routes: Routes = [ // Uygulamanın tüm rotalarını tanımlayan sabit bir Routes dizisi
    // Client (Public) Layout - Müşteriye açık, genel sayfaların düzeni
    {
        path: '', // Kök yol (uygulamanın ana adresi)
        // ClientLayoutComponent'i dinamik olarak yükler (lazy loading)
        loadComponent: () => import('./components/clients/layout/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
        children: [ // Bu düzenin içinde gösterilecek alt rotalar
            {
                path: '', // client-layout içinde boş yol, yani /
                // HomeComponent'i dinamik olarak yükler
                loadComponent: () => import('./components/clients/pages/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'home', // /home yolu
                redirectTo: '' // Boş yola yönlendirir, böylece / ve /home aynı sayfayı gösterir
            }
        ]
    },
    // Auth (Public) Routes - Giriş ve Kayıt sayfalarının düzeni (kimlik doğrulaması gerektirmez)
    {
        path: 'auth', // /auth yolu
        // AuthLayoutComponent'i dinamik olarak yükler
        loadComponent: () => import('./components/auth/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [ // Bu düzenin içinde gösterilecek alt rotalar
            {
                path: 'login', // /auth/login yolu
                // LoginComponent'i dinamik olarak yükler ve tarayıcı sekmesi başlığını 'Giriş Yap' olarak ayarlar
                loadComponent: () => import('./components/admin/pages/login/login.component').then(m => m.LoginComponent), title: 'Giriş Yap'
            },
            {
                path: 'register', // /auth/register yolu
                // RegisterComponent'i dinamik olarak yükler ve tarayıcı sekmesi başlığını 'Kayıt Ol' olarak ayarlar
                loadComponent: () => import('./components/admin/pages/register/register.component').then(m => m.RegisterComponent), title: 'Kayıt Ol'
            },
            {
                path: '', // /auth içinde boş yol
                redirectTo: 'login', // auth düzenine direkt erişilirse login sayfasına yönlendirir
                pathMatch: 'full' // Yolun tamamen eşleşmesini sağlar
            }
        ]
    },
    // Admin (Private) Routes: Yönetici paneli sayfaları.
    // Kullanıcı giriş yapmışsa ve admin yetkisi varsa bu sayfalara erişebilir.
    {
        path: 'admin', // /admin yolu
        // AdminLayoutComponent'i dinamik olarak yükler
        loadComponent: () => import('./components/admin/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        //canActivate: [AuthGuard], // AuthGuard'ı bu rotayı ve tüm alt rotalarını korumak için kullanır
        children: [ // Bu düzenin içinde gösterilecek alt rotalar
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}, // /admin yoluna erişilirse /admin/dashboard'a yönlendirir
            {
                path:'dashboard', // /admin/dashboard yolu
                // DashboardComponent'i dinamik olarak yükler
                loadComponent: () => import('./components/admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'users', 
                // UserListComponent'i dinamik olarak yükler ve tarayıcı sekmesi başlığını 'Kullanıcılar' olarak ayarlar
                loadComponent: () => import('./components/admin/pages/user-list/user-list.component').then(m => m.UserListComponent), title: 'Users'
            },
            {
                path: 'roles',
                loadComponent: () => import('./components/admin/pages/role-list/role-list.component').then(m => m.RoleListComponent), title: 'Rol Yönetimi'
            }
            // Diğer admin sayfaları buraya eklenecek.
        ]
    },
    // Tanımlanmamış rotalar için genel yönlendirme
    {
        path: '**', // Uygulamada tanımlanmayan tüm diğer yolları yakalar
        redirectTo: 'auth/login' // Varsayılan olarak giriş sayfasına yönlendirir
        // Alternatif olarak, özel bir 404 sayfasına da yönlendirebilirsiniz:
        // loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
