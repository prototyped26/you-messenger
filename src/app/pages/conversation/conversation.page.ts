import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Socket } from 'ng-socket-io';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../models/User.model';
import {NavController} from '@ionic/angular';
import {MessageInfo} from '../../models/MessageInfo.interface';
import {WhoIAmService} from '../../services/who-i-am.service';
import {LocalMessageModel} from '../../models/LocalMessage.model';
import {MessagesService} from '../../services/messages.service';
import {UtilisateurService} from '../../services/utilisateur.service';
import {ITypingData} from '../../interfaces/ITypingData.interface';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit, OnDestroy {

  @ViewChild('zone') zone: ElementRef;
  public message = '';
  public messages: Array<MessageInfo> = [];
  public toUser: User = null;
  public toUserIsConnected = false;
  public inCommeData: any = null;
  public typing = false;
  public inComeDataSubscription: Subscription;
  public isTypingSubscription: Subscription;
  public toggled = true;
  public intervalToUserOnline: any;
  constructor(private renderer: Renderer2,
              private socket: Socket,
              private route: ActivatedRoute,
              private navCtl: NavController,
              private whoIam: WhoIAmService,
              private messageService: MessagesService,
              private utilisateurService: UtilisateurService) {
    /*this.messages.push({ id: 1, content: 'Comment tu vas ?', origin: 'you', user: null});
    this.messages.push({ id: 2, content: 'Ha je suis là ', origin: 'me', user: null});
    this.messages.push({ id: 3, content: 'et toi ?', origin: 'me', user: null});*/
  }

  ngOnInit() {
     this.intervalToUserOnline = setInterval(() => {
          if (this.toUserIsConnected === false) {
              this.getifToUserIsConnected();
          }
      }, 500);

      this.setIfToUserIsConnecter().subscribe((data: any) => {
          console.log(data);
          if (data.res === true) {
              this.toUserIsConnected = true;
          }
      });
      // get user contanct info
      this.route.queryParams.subscribe(params => {
          this.toUser = JSON.parse(params['user']);
          this.messageService.emitCurrentUser(this.toUser);
          this.whoIam.getListMessagesUser(this.toUser).then((l: LocalMessageModel) => {
             if (l !== null) {
                 this.messages = l.messages;
                 setTimeout(() => {
                     this.scrollToBottom();
                     this.whoIam.upadteListOfMessage(this.toUser);
                 }, 30);
             }
          });
      });
      //// récp des messages
      this.inComeDataSubscription = this.messageService.inCommingMessageSubject.subscribe((data: any) => {
         this.inCommeData = data;
         console.log(data);
          if (data.sender.id + '' === this.toUser.id + '') {
              this.typing = false;
              if (this.messages.length > 0) {
                  this.typing = false;
                  if (this.messages[this.messages.length - 1 ].content + '' !== '' + data.message ) {
                      const m: MessageInfo = {
                          id: null, content: '' + data.message, origin: 'you', user: data.sender.id, sender: null, see: true
                      };
                      this.messages.push(m);
                      this.whoIam.storeListMessagesUser(this.toUser, m);
                      this.scrollToBottom();
                  }
              } else {
                  this.typing = false;
                  const m: MessageInfo = {
                      id: null, content: '' + data.message, origin: 'you', user: data.sender.id, sender: null, see: false
                  };
                  this.messages.push(m);
                  this.whoIam.storeListMessagesUser(this.toUser, m);
                  this.scrollToBottom();
              }
          }
      });
      /// si un utilisateur saisie
      this.isTypingSubscription = this.messageService.isTypingSubject.subscribe((t: ITypingData) => {
          // console.log(t);
         if (t.you + '' === '' + this.toUser.id) {
             if (this.typing === false) {
                this.typing = true;
                 // this.scrollToBottom();
                 setTimeout(() => { this.typing = false; }, 2600);
             }
         }
      });
      // this.socket.connect();
      /*this.getMessages().subscribe((data: any) => {
          // si la page n'est pas ouverte
          console.log(data);
          if (this.toUser === null) {
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
          } else {
              // si la page est ouverte
              if (this.messages.length > 0) {
                  if (this.messages[this.messages.length - 1 ].content + '' !== '' + data.message ) {
                      const m: MessageInfo = {
                          id: null, content: '' + data.message, origin: 'you', user: data.sender.id, sender: null, see: true
                      };
                      this.messages.push(m);
                      this.whoIam.storeListMessagesUser(this.toUser, m);
                      this.scrollToBottom();
                  }
              } else {
                  const m: MessageInfo = {
                      id: null, content: '' + data.message, origin: 'you', user: data.sender.id, sender: null, see: false
                  };
                  this.messages.push(m);
                  this.whoIam.storeListMessagesUser(this.toUser, m);
                  this.scrollToBottom();
              }
          }
      });*/
  }

  ngOnDestroy() {
      clearInterval(this.intervalToUserOnline);
      // this.inCome.unsubscribe();
      this.toUser = null;
      this.messageService.emitCurrentUser(null);
      this.inComeDataSubscription.unsubscribe();
      this.isTypingSubscription.unsubscribe();
  }

  onGoBakc() {
      this.navCtl.goBack();
  }

  onSendMessage() {
    if (this.message.length === 0) {
      // error
    } else {
      const m: MessageInfo = {
          id: null, content: this.message, origin: 'me', user: this.toUser.id, sender: this.utilisateurService.user, see: true
      };
      this.message = '';
      this.socket.emit('chat message', m);

      this.whoIam.storeListMessagesUser(this.toUser, m);
      this.messages.push(m);
      this.scrollToBottom();
    }
  }

  getifToUserIsConnected() {
      if (this.toUser !== null) {
          const m = { user: this.toUser.id };
          this.socket.emit('user is connected', m);
      }
  }

  setIfToUserIsConnecter() {
      return new Observable(observer => {
          this.socket.on('user is connected', (data) => {
              observer.next(data);
          });
      });
  }

  onTyping() {
    const userTyping: ITypingData = { me: this.utilisateurService.user.id, you: this.toUser.id, action: 'typing'};
    this.socket.emit('user istyping', userTyping);
  }
    scrollToBottom(): void {
        this.typing = false;
      // window.scrollTo(0, document.querySelector('.zone').scrollHeight);
        setTimeout(() => {
            document.querySelector('.zone-content').scrollTop = document.querySelector('.zone-content').scrollHeight;
        }, 90);
        // document.querySelector('.zone-content')
            // .scrollTo(0,  document.querySelector('.zone-content').scrollTop + document.querySelector('.zone').scrollHeight);
        // document.querySelector('.zone-content').scrollTop = document.querySelector('.zone').scrollHeight;
        try {
            this.zone.nativeElement.scrollTop = this.zone.nativeElement.scrollHeight;
        } catch (err) { }
    }

}

