import { Injectable } from '@angular/core';
import {User} from '../models/User.model';
import {DataApi} from '../models/DataApi.model';
import {ApiMethodService} from './api-method.service';
import {WhoIAmService} from './who-i-am.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

    public user: User = new User();
    private users: Array<User> = [];
    public usersSubject = new Subject<Array<User>>();
    public userSubject = new Subject<User>();
    public apiInfo: DataApi = new DataApi();
  constructor(private apiMethod: ApiMethodService,
              private whoIam: WhoIAmService) { }
  emitUsers() {
      this.usersSubject.next(this.users);
  }
  emitUser() {
      this.userSubject.next(this.user);
  }
  createNewUser(u: User) {
        return new Promise((resolve) => {
            this.apiMethod.POST('' + this.apiInfo.endPoint + 'account/register', u, false)
                .then((res: any) => {
                    this.whoIam.storeUserInfo(u).then((result: boolean) => {
                        if (result) {
                            this.connectUser(u).then(res1 => {
                              if (res1) {
                                  resolve(true);
                              }
                            });
                        } else {
                            resolve(false);
                        }
                    });
                    // this.emitLangue();
                    // this.errorService.insertSuccess('Langue created with success !');
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
  connectUser(u: User) {
        return new Promise((resolve) => {
            this.apiMethod.POST('' + this.apiInfo.endPoint + 'account/login', u, false)
                .then((res: any) => {
                    this.whoIam.userToken = res.token;
                    this.whoIam.storeToken();
                    this.whoIam.storeUserInfo(u).then((result: boolean) => {
                        if (result) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                    // this.emitLangue();
                    // this.errorService.insertSuccess('Langue created with success !');
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
  otherUsers() {
        return new Promise((resolve) => {
            this.apiMethod.GET('' + this.apiInfo.endPoint + 'users/other', true)
                .then((res: any) => {
                    this.users = res;
                    this.emitUsers();
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
  getCurrentUser(): Promise<User> {
      return new Promise((resolve) => {
          this.apiMethod.GET('' + this.apiInfo.endPoint + 'users/me', true)
              .then((res: any) => {
                  this.user = res;
                  this.emitUser();
                  resolve(this.user);
              })
              .catch(err => {
                  console.log(err);
                  // this.errorService.insertError('' + err.error.message);
                  resolve(null);
              });
      });
  }
}
