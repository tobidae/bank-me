import { RegisterComponent } from './views/register/register.component';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { AuthGuard } from './services/auth/auth-guard.service';
import { ModuleWithProviders } from '@angular/core';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
