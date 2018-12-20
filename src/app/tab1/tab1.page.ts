import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContactListPage} from '../screens/contact-list/contact-list.page';
import {ModalController} from '@ionic/angular';
import {User} from '../models/User.model';
import {Subscription} from 'rxjs';
import {UtilisateurService} from '../services/utilisateur.service';
import {NavigationExtras, Router} from '@angular/router';
import {WhoIAmService} from '../services/who-i-am.service';
import {LocalMessageModel} from '../models/LocalMessage.model';
import {MessageInfo} from '../models/MessageInfo.interface';
import {MessagesService} from '../services/messages.service';
import {ITypingData} from '../interfaces/ITypingData.interface';
import { Socket } from 'ng-socket-io';

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
              private socket: Socket) {
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
          if (this.userConverse === null) {
              this.inCommeData = data;
              console.log('Pas de user en cours ... !');
              let listesLocales: Array<LocalMessageModel> = [];
              this.whoIam.getListMessagesUser().then((l: Array<LocalMessageModel>) => {
                  listesLocales = l;
              });
              setTimeout(() => {
                  console.log(listesLocales);
                  let trouveUser = false;
                  if (listesLocales !== null) {
                      if (listesLocales.length > 0) {
                          const index = listesLocales.findIndex(l => l.user.id + '' === '' + data.sender.id);
                          console.log(index);
                          if (index >= 0) {
                              const m: MessageInfo = {
                                  id: null, content: '' + data.message, origin: 'you', user: data.sender.id, sender: null, see: false
                              };
                              // listesLocales[index].messages.push(m);
                              trouveUser = true;
                              this.whoIam.storeListMessagesUser(listesLocales[index].user, m);
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
                          console.log(m);
                          this.whoIam.storeListMessagesUser(u, m);
                      }
                  }, 200);
              }, 200);
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
        this.whoIam.getListMessagesUser().then((l: Array<LocalMessageModel>) => {
            if (l !== null) {
                this.discussions = l;
                // console.log(l);
            }
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
}
