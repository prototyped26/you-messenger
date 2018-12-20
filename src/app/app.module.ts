import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ContactListPage} from './screens/contact-list/contact-list.page';
import {IonicStorageModule} from '@ionic/storage';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import {CommonModule} from '@angular/common';
// import {EmojiPickerModule} from '../../node_modules/ionic-emoji-picker/dist/emoji-picker.module';
import { ListePipe } from './pages/liste.pipe';
import {Keyboard} from '@ionic-native/keyboard/ngx';
// import {LocalNotifications} from '@ionic-native/local-notifications';

const ioConf: SocketIoConfig = { url: 'http://192.168.43.97:3000', options: {}};
// const ioConf: SocketIoConfig = { url: 'https://youmessenger237.website', options: {}};
const firebase = {
    apiKey: 'AIzaSyD6fpPKUn2D8uGp2Gvpw8IYjhB4t91e2po',
    authDomain: 'you-messenger-8c9d9.firebaseapp.com',
    databaseURL: 'https://you-messenger-8c9d9.firebaseio.com',
    projectId: 'you-messenger-8c9d9',
    storageBucket: 'you-messenger-8c9d9.appspot.com',
    messagingSenderId: '1057649044428'
};
@NgModule({
  declarations: [AppComponent, ContactListPage, ListePipe],
  entryComponents: [ContactListPage],
  imports: [
      BrowserModule,
      IonicModule.forRoot({ scrollAssist: true, rippleEffect: true}),
      AppRoutingModule,
      IonicStorageModule.forRoot(),
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      SocketIoModule.forRoot(ioConf),
      CommonModule,
      // EmojiPickerModule.forRoot()
      //  LocalNotifications
  ],
  providers: [
    StatusBar,
    SplashScreen,
      Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
