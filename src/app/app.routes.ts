import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PruebaComponent } from './prueba/prueba.component';
import { LivevideoComponent } from './dashboard/components/livevideo/livevideo/livevideo.component';// Asegúrate de importar
import { HomeComponent } from './dashboard/components/home/home/home.component'; // Asegúrate de importar el componente HomeComponent
import { authGuard } from './auth.guard';
import { DevicesComponent } from './dashboard/components/devices/devices.component';
import { loginGuard } from './login.guard';
import { UsersComponent } from './dashboard/components/users/users/users.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'landing-page', component: LandingPageComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'livevideo', component: LivevideoComponent },
      { path: 'devices', component: DevicesComponent },
      { path: 'users', component: UsersComponent }, 
    ]
  },

  { path: 'prueba', component: PruebaComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
