import { Injectable }             from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }    from '@angular/router';
import { AuthService }            from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>|boolean {
    return AuthService.check();
  }
}
