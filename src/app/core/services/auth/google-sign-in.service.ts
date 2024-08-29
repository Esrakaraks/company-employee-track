import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleSignInService {

  private clientId = '930766641999-8q0hrvq1nal0scg7c6k0vi1a8sstgmdf.apps.googleusercontent.com';

  constructor() { }

  public initializeGoogleSignIn(): void {
     if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this)
    });
  } else {
    console.error('Error');
  }
  }

  public promptSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {      
      google.accounts.id.prompt();
    }
  }

  private handleCredentialResponse(response: any): void {
    console.log('Google Credential:', response.credential);
    localStorage.setItem('google_auth_token', response.credential);
  }
  public getUser(): any {
    const auth2 = (window as any).gapi.auth2.getAuthInstance();
    return auth2.currentUser.get().getBasicProfile();
  }
  public signOut(): void {
    const auth2 = (window as any).gapi.auth2.getAuthInstance();
    if (auth2) {
      auth2.signOut().then(() => {
        localStorage.removeItem('google_auth_token');
      }).catch((error: any) => {
        console.error('Error signing out:', error);
      });
    } else {
      console.error('Error');
    }
  }
}
