import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContactListPage} from '../screens/contact-list/contact-list.page';
import {ModalController} from '@ionic/angular';
import {User} from '../models/User.model';
import {Observable, Subscription} from 'rxjs';
import {UtilisateurService} from '../services/utilisateur.service';
import {NavigationExtras, Router} from '@angular/router';
import {WhoIAmService} from '../services/who-i-am.service';
import {LocalMessageModel} from '../models/LocalMessage.model';
import {MessageInfo} from '../models/MessageInfo.interface';
import {MessagesService} from '../services/messages.service';
import {ITypingData} from '../interfaces/ITypingData.interface';
import { Socket } from 'ng-socket-io';
import * as momentJS from 'moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnDestroy, OnInit {
    public users: Array<User> = [];
    public usersSubscription: Subscription;
    public userConverse: User = null;
    public userConverseSubscription: Subscription;
    public discussions: Array<LocalMessageModel> = [];
    public discussionsSubscription: Subscription;
    public inCommeData: any = null;
    public inCommeDataSubscription: Subscription;
    public isTypingSubscription: Subscription;
  constructor(private modalController: ModalController,
              private userService: UtilisateurService,
              private router: Router,
              private whoIam: WhoIAmService,
              private messageService: MessagesService,
              private socket: Socket,
              private translate: TranslateService) {
      momentJS.locale('fr');
      this.usersSubscription = this.userService.usersSubject.subscribe((u: Array<User>) => {
          this.users = u;
      });
      this.userConverseSubscription = this.messageService.currentUserSubject.subscribe((u: User) => {
         this.userConverse = u;
      });
      this.discussionsSubscription = this.whoIam.localMessagesSubjet.subscribe((l: Array<LocalMessageModel>) => {
          this.discussions = l;
      });
      this.inCommeDataSubscription = this.messageService.inCommingMessageSubject.subscribe((data: any) => {
          console.log(data);
          if (this.userConverse === null) {
              this.setDataIncomeSystem(data).then(res => {
                  this.whoIam.getListMessagesUser().then((l: Array<LocalMessageModel>) => {
                      this.discussions = l;
                  });
              });
          }
      });
  }
    async onOpenSearch() {
        const modal = await this.modalController.create({
            component: ContactListPage,
            componentProps: {}
        });
        return await modal.present();
    }
    ngOnInit() {
        this.whoIam.getUserInfo().then((u: User) => {
            if (u.langue.code !== 'fr') {
                this.translate.use('en');
            } else {
                this.translate.use('fr');
            }
        });
        this.whoIam.getListMessagesUser().then((l: Array<LocalMessageModel>) => {
            if (l !== null) {
                this.discussions = l;
            }
        });
        // event de première connexion
        this.getAllMessagesOnConnect().subscribe((d: any) => {
            // console.log(d);
            const stacks: Array<boolean> = [];
            const listData: Array<any> = JSON.parse(d);
            // console.log(listData);
            setTimeout(() => {
                this.onSaveListData(JSON.parse(d), 0, listData.length, 0);
            }, 240);
        });
        // est entrain de vous écrire
        this.isTypingSubscription = this.messageService.isTypingSubject.subscribe((t: ITypingData) => {
            // console.log(t);
            if (this.discussions !== null) {
                if (this.discussions.length > 0) {
                    const index = this.discussions.findIndex(l => l.user.id + '' === '' + t.you);
                    // console.log(index);
                    if (index >= 0) {
                        // console.log(this.discussions[index].isTyping);
                        if (this.discussions[index].isTyping === false) {
                            this.discussions[index].isTyping = true;
                            setTimeout(() => { this.discussions[index].isTyping = false; }, 2400);
                        }

                        if (typeof  this.discussions[index].isTyping === 'undefined') {
                            this.discussions[index].isTyping = true;
                            setTimeout(() => { this.discussions[index].isTyping = false; }, 2400);
                        }
                    }
                }
            }
        });
      // this.router.navigate(['/conversation']);
      this.userService.otherUsers().then(res => {});
    }
    ngOnDestroy() {
      this.usersSubscription.unsubscribe();
      this.inCommeDataSubscription.unsubscribe();
      this.isTypingSubscription.unsubscribe();
    }
    onGoto(u: User) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                'user': JSON.stringify(u)
            }
        };
        // this.modalCtrl.dismiss();
        this.router.navigate(['/conversation'], navigationExtras);
    }
    countNotSee(l: Array<MessageInfo>): number {
      let val = 0;
      if (l !== null) {
          if (l.length > 0) {
              l.forEach(elt => {
                  if (elt.see === false) {
                      val++;
                  }
              });
          }
      }
        return val;
    }
    getAllMessagesOnConnect() {
        return new Observable(observer => {
            this.socket.on('chat messages all', (data) => {
                // console.log(data);
                observer.next(data);
            });
        });
    }

    setDataIncomeSystem(data: any) {
        // console.log('Pas de user en cours ... ');
        // let listesLocales: Array<LocalMessageModel> = [];
      return new Promise((resolve, reject) => {
          this.inCommeData = data;
          this.whoIam.getListMessagesUser().then((listesLocales: Array<LocalMessageModel>) => {
              // listesLocales = l;
              let trouveUser = false;
              if (listesLocales !== null) {
                  if (listesLocales.length > 0) {
                      const index = listesLocales.findIndex(l => l.user.id + '' === '' + data.sender.id);
                      // console.log(index);
                      if (index >= 0) {
                          const m: MessageInfo = {
                              id: null, content: '' + data.message, origin: 'you', user: data.sender.id, sender: null, see: false
                          };
                          // listesLocales[index].messages.push(m) ;
                          trouveUser = true;
                          this.whoIam.storeListMessagesUser(listesLocales[index].user, m, data.date).then(res => {
                              resolve(true);
                          });
                      }
                  }
              }
              // si l'utilisateur n'existe pas on ajoute de new
              setTimeout(() => {
                  if (!trouveUser) {
                      let u: User = new User();
                      u = data.sender;
                      const m: MessageInfo = {
                          id: null, content: '' + data.message, origin: 'you', user: data.sender.id, sender: null, see: false
                      };
                      // console.log(m);
                      this.whoIam.storeListMessagesUser(u, m, data.date).then(res => {
                          resolve(true);
                      });
                  }
              }, 200);
          });
      });
    }

    onSaveListData(list: Array<any>, start: number, end: number, indice: number) {
      if (indice < end) {
          this.setDataIncomeSystem(list[indice]).then((res: boolean) => {
              indice++;
              this.onSaveListData(list, start, end, indice);
          });
      } else {
          this.whoIam.getListMessagesUser().then((l: Array<LocalMessageModel>) => {
              this.discussions = l;
          });
      }
    }

    getDateFomat(date: Date) {
      return momentJS(date).calendar();
    }
}
