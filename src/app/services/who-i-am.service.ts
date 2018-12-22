import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Router} from '@angular/router';
import {User} from '../models/User.model';
import {DataApi} from '../models/DataApi.model';
import {LocalMessageModel} from '../models/LocalMessage.model';
import {MessageInfo} from '../models/MessageInfo.interface';
import {Subject} from 'rxjs';
import * as momentJS from 'moment';

@Injectable({
  providedIn: 'root'
})
export class WhoIAmService {
  public static user: User = null;
  private tokenName = '_t_m';
  private info = '_t_u';
  private  localMessageName = '_t_l_m';
  public localMessages: Array<LocalMessageModel> = [];
  public localMessagesSubjet = new Subject<Array<LocalMessageModel>>();
  private iAm: string;
  public isUser: boolean;
  public userToken: string = null;
  public userInfo: User = new User();
  public apiInfo: DataApi = new DataApi();
  constructor(private storage: Storage,
              private router: Router) {
      momentJS.locale('fr');
  }
    static setUser(u: User) {
        WhoIAmService.user = u;
    }
    getToken() {
      return new Promise<string>((resolve, reject) => {
          this.storage.get('' + this.tokenName)
              .then((val) => {
                  // console.log(val);
                  if (val === null) {
                     resolve(null);
                  } else {
                      this.userToken = val;
                     resolve(val);
                  }
              });
      });
  }
  emitLocalMessages() {
      this.sortListOfMessages();
      setTimeout(() => {
          this.localMessagesSubjet.next(this.localMessages);
      }, 200);
  }
    storeToken(tokenSend: string = null) {
      const token: string = (tokenSend !== null ? tokenSend : this.userToken);
        this.storage.set('' + this.tokenName, token);
    }
  storeUserInfo(u: User): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
          this.storage.set('' + this.info,  JSON.stringify(u)).then(val => {
              resolve(true);
          }).then(err => {
              resolve(false);
          });
      });
  }
  getUserInfo(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.storage.get('' + this.info)
                .then((val) => {
                    console.log(val);
                    if (val === null) {
                        resolve(null);
                    } else {
                        this.userInfo = JSON.parse(val);
                        resolve(this.userInfo);
                    }
                });
        });
    }
    storeListMessagesUser(user: User, message: MessageInfo, date: string = null) {
      // console.log(user);
        return new Promise((resolve, reject) => {
            this.getListMessagesUser().then((l: Array<LocalMessageModel>) => {
                if (l === null) {
                    const liste: Array<LocalMessageModel> = [];
                    const m: LocalMessageModel = new LocalMessageModel();
                    m.user = user;
                    m.messages.push(message);
                    m.lastMessage = new Date(date);
                    liste.push(m);
                    this.storage.set('' + this.localMessageName, JSON.stringify(liste));
                    resolve(true);
                } else {
                    let trouve = false;
                    l.forEach((elt) => {
                        if (elt.user.id + '' === '' + user.id) {
                            trouve = true;
                            elt.messages.push(message);
                            elt.lastMessage = new Date(date);
                            setTimeout(() => {
                                this.storage.set('' + this.localMessageName, JSON.stringify(l));
                                resolve(true);
                            }, 50);
                        }
                    });
                    setTimeout(() => {
                        if (!trouve) {
                            const m: LocalMessageModel = new LocalMessageModel();
                            m.user = user;
                            m.messages.push(message);
                            m.lastMessage = new Date(date);
                            l.push(m);
                            this.storage.set('' + this.localMessageName, JSON.stringify(l));
                            resolve(true);
                        }
                    }, 100);
                }
                /*setTimeout(() => {
                    this.getListMessagesUser().then(res => {});
                }, 150);*/
            });
        });
    }
    getListMessagesUser(user: User = null) {
        return new Promise((resolve, reject) => {
            this.storage.get('' + this.localMessageName)
                .then((val) => {
                    // console.log(val);
                    if (val === null) {
                        this.localMessages = null;
                        resolve(null);
                    } else {
                        this.localMessages = JSON.parse(val);
                        if (user === null) {
                            this.emitLocalMessages();
                            resolve(this.localMessages);
                        } else {
                            const index = this.localMessages.findIndex(l => l.user.id === user.id);
                            if (index >= 0) {
                                resolve(this.localMessages[index]);
                            } else {
                                resolve(null);
                            }
                        }
                    }
                });
        });
    }
    upadteListOfMessage(user: User) {
        this.storage.get('' + this.localMessageName)
            .then((val) => {
                if (val !== null) {
                    this.localMessages = JSON.parse(val);
                    const index = this.localMessages.findIndex(l => l.user.id === user.id);
                    if (index >= 0) {
                        this.localMessages[index].messages.forEach(elt => {
                            elt.see = true;
                        });
                        setTimeout(() => {
                            this.storage.set('' + this.localMessageName, JSON.stringify(this.localMessages));
                            this.emitLocalMessages();
                        }, 60);
                    }
                }
            });
    }

    sortListOfMessages() {
      console.log(this.localMessages);
      for (let i = 0; i < this.localMessages.length - 1; i++) {
          let temp: LocalMessageModel;
          for (let j = i + 1; j < this.localMessages.length ; j++) {
              if (typeof this.localMessages[j].lastMessage === 'undefined') {
                  this.localMessages[j].lastMessage = new Date('2018-12-01');
              }
              if (typeof this.localMessages[i].lastMessage === 'undefined') {
                  this.localMessages[i].lastMessage = new Date('2018-12-01');
              }
              setTimeout(() => {
                  // console.log(this.localMessages[i].lastMessage + ' ' + this.localMessages[j].lastMessage);
                  if (
                      momentJS(this.localMessages[i].lastMessage).isAfter(this.localMessages[j].lastMessage) === false
                  ) {
                      temp = this.localMessages[j];
                      this.localMessages[j] = this.localMessages[i];
                      this.localMessages[i] = temp;
                  }
              }, 15);
          }
      }
    }
}
