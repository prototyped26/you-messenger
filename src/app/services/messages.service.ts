import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import {Observable, Subject} from 'rxjs';
import {User} from '../models/User.model';
import {ITypingData} from '../interfaces/ITypingData.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

      public currentUser: User = null;
      public currentUserSubject = new Subject<User>();
      private inCommingMessage: any = null;
      public inCommingMessageSubject = new Subject<any>();
      public isTyping: ITypingData = null;
      public isTypingSubject = new Subject<ITypingData>();
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

      public emitTyping(data: any) {
          this.isTyping = { me: data.me, you: data.you, action: data.action };
          setTimeout(() => {
              this.isTypingSubject.next(this.isTyping);
          }, 30);
      }
}
