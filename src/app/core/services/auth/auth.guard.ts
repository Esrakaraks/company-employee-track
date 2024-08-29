import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GoogleSignInService } from './google-sign-in.service';

@Injectable({ 
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private googleSignInService: GoogleSignInService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const user = await this.googleSignInService.getUser();
      if (user) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } catch (error) {
      console.error('AuthGuard error:', error);
      this.router.navigate(['']);
      return false;
    }
  }
}
