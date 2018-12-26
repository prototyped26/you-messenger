import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {WhoIAmService} from '../services/who-i-am.service';
import {User} from '../models/User.model';
import {UtilisateurService} from '../services/utilisateur.service';
import { Socket } from 'ng-socket-io';
import {MessagesService} from '../services/messages.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {
  constructor(private whoIam: WhoIAmService,
              private router: Router,
              private userService: UtilisateurService,
              private socket: Socket,
              private messageService: MessagesService,
              private localNotifications: LocalNotifications,
              private httpClient: HttpClient) {
      // écoutes des messages venant des autres clients
      this.getMessages().subscribe((data: any) => {
          this.whoIam.getUserInfo().then((u: User) => {
              this.onTranslate(data.message, data.locale, u.langue.code).then((res: string) => {
                  data.message = res;
                  this.messageService.emitInCommingMessage(data);
              });
          });
          // this.messageService.emitInCommingMessage(data);
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
                this.showLocalNotif(data);
            });
        });
    }
    showLocalNotif(data: any) {
        // console.log(data);
        const sender: User = data.sender;
        console.log(sender);
        this.localNotifications.schedule({
            title: '' + sender.nom,
            text: '' + data.message,
            summary: '' + sender.telephone,
        });

    }
    onTranslate(text: string, langFrom: string, langTo: string) {
      return new Promise((resolve, reject) => {
          let url = 'https://translate.yandex.net/api/v1.5/tr/translate';
          url += '?key=' + 'trnsl.1.1.20181223T080940Z.262f1841c11435a1.3bd6b06640282feb7dba4afb3603d4e28818c8d8';
          url += '&text=' + text;
          url += '&lang=' + langFrom + '-' + langTo + '&format=plain';
          console.log(url);
          this.httpClient.get(url).subscribe((res: any) => {
              console.log(JSON.stringify(res));
          }, (err) => {
              console.log(err.error.text);
              const str = err.error.text;
              const r = str.match(/<text>(.*?)<\/text>/g).map((val) => {
                  return val.replace(/<\/?text>/g, '');
              });

              // console.log(r[0]);
              resolve(r[0]);

          });
      });
    }
}
