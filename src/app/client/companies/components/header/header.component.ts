import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleSignInService } from 'src/app/core/services/auth/google-sign-in.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private googleSignInService: GoogleSignInService, private router: Router) {}
  signOut(): void {
    this.googleSignInService.signOut();
    this.router.navigate(['']);
  }
}
