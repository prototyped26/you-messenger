import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import {Observable, Subject} from 'rxjs';
import {User} from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  public currentUser: User = null;
  public currentUserSubject = new Subject<User>();
  private inCommingMessage: any = null;
  public inCommingMessageSubject = new Subject<any>();
  constructor(private socket: Socket) {
  }
  public emitInCommingMessage(data: any) {
    this.inCommingMessage = data;
    setTimeout(() => {
        this.inCommingMessageSubject.next(this.inCommingMessage);
    }, 30);
  }
  public emitCurrentUser(u: User) {
     this.currentUser = u;
      setTimeout(() => {
          this.currentUserSubject.next(this.currentUser);
      }, 30);
  }
}
