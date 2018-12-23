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
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import {CommonModule} from '@angular/common';
// import {EmojiPickerModule} from '../../node_modules/ionic-emoji-picker/dist/emoji-picker.module';
import { ListePipe } from './pages/liste.pipe';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from './translate-loader';

// const ioConf: SocketIoConfig = { url: 'http://192.168.43.97:3000', options: {}};
const ioConf: SocketIoConfig = { url: 'https://youmessenger237.website', options: {}};
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
      AngularFirestoreModule,
      AngularFireModule.initializeApp(firebase),
      TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
          }
      }),
      // EmojiPickerModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
      Keyboard,
      ImagePicker,
      Camera,
      Firebase,
      LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
