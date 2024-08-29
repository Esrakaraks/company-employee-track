import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleSignInService } from 'src/app/core/services/auth/google-sign-in.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private googleSignInService: GoogleSignInService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.googleSignInService.getUser();
    if (user) {
      this.router.navigate(['/company-employee-list']);
    } else {
      this.googleSignInService.initializeGoogleSignIn();
    }
  }

  signInWithGoogle(): void {
    this.googleSignInService.promptSignIn();
  }
}
