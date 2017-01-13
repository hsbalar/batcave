import { ModuleWithProviders }  from '@angular/core';
import { Routes,
         RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './common/pageNotFound/pageNotFound.component';
import { LoginComponent }    from './common/login/login.component';
import { RegisterComponent }    from './common/register/register.component';
import { HomeComponent } from './home/home.component';

import { loginRoutes,
         authProviders }      from './common/login/login.routing';
import { AuthGuard } from './services/auth/auth-guard.activate.service';
import { AuthCheckLoginGuard } from './services/auth/auth-guard.deactivate.service';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthCheckLoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthCheckLoginGuard] },
  { path: '**', component: PageNotFoundComponent },
  ...loginRoutes
];

export const appRoutingProviders: any[] = [
  authProviders
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
