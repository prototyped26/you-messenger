import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {WhoIAmService} from '../services/who-i-am.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleGuard implements CanActivate {
    constructor(private whoIam: WhoIAmService,
                private translate: TranslateService) {
        this.translate.use('en');
    }

                canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
