import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {WhoIAmService} from './who-i-am.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private whoIam: WhoIAmService) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
        (resolve, reject) => {
            if (this.whoIam.getToken() !== null) {
              resolve(true);
            } else {
              this.router.navigate(['/welcome']);
              resolve(false);
            }
        }
    );
  }
}
