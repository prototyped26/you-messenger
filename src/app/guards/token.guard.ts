import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {WhoIAmService} from '../services/who-i-am.service';
import {User} from '../models/User.model';
import {UtilisateurService} from '../services/utilisateur.service';
import { Socket } from 'ng-socket-io';
import {MessagesService} from '../services/messages.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {
  constructor(private whoIam: WhoIAmService,
              private router: Router,
              private userService: UtilisateurService,
              private socket: Socket,
              private messageService: MessagesService) {
      // écoutes des messages venant des autres clients
      this.getMessages().subscribe((data: any) => {
          this.messageService.emitInCommingMessage(data);
      });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return new Promise((resolve, reject) => {
          this.whoIam.getToken().then(val => {
              if (val !== null) {
                  this.userService.getCurrentUser().then((u: User) => {
                      if (u !== null) {
                          WhoIAmService.setUser(u);
                          this.socket.emit('user chat set', u);
                          // resolve(true);
                      } else {
                          // resolve(false);
                      }
                  });
                  resolve(true);
              } else {
                  this.router.navigate(['/welcome']);
                  resolve(false);
              }
          }).catch(err => {
              this.router.navigate(['/welcome']);
              resolve(false);
          });
      });
  }
    getMessages() {
        return new Observable(observer => {
            this.socket.on('chat message', (data) => {
                observer.next(data);
            });
        });
    }
}
