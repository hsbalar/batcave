import { Routes }         from '@angular/router';
import { AuthGuard }      from '../../services/auth/auth-guard.activate.service';
import { AuthCheckLoginGuard }      from '../../services/auth/auth-guard.deactivate.service';
import { AuthService }    from '../../services/auth/auth.service';
import { LoginComponent } from './login.component';

export const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent }
];
export const authProviders = [
  AuthGuard,
  AuthCheckLoginGuard,
  AuthService
];
