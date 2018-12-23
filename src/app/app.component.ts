import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {WhoIAmService} from './services/who-i-am.service';
import {UtilisateurService} from './services/utilisateur.service';
// import {User} from './models/User.model';
import { Socket } from 'ng-socket-io';
// import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Observable} from 'rxjs';
import {MessagesService} from './services/messages.service';
import { ToastController } from '@ionic/angular';
import {FcmService} from './services/fcm.service';
import {TranslateService} from '@ngx-translate/core';
// import {MessageInfo} from './models/MessageInfo.interface';
// import {User} from './models/User.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private whoIam: WhoIAmService,
    private userService: UtilisateurService,
    private socket: Socket,
    private keyboard: Keyboard,
    private messageService: MessagesService,
    private fcm: FcmService,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.initializeApp();
      this.statusBar.overlaysWebView(true);

      this.translate.setDefaultLang('fr');

      this.keyboard.onKeyboardShow().subscribe((k: any) => {
        console.log(k.keyboardHeight);
        // document.getElementById('ion-app').style.marginBottom = (0 + k.keyboardHeight) + 'px';
      });

      this.keyboard.onKeyboardHide().subscribe(k => {
          // document.getElementById('ion-app').style.marginBottom = 0 + 'px';
      });

      this.getTypings().subscribe((data: any) => {
        this.messageService.emitTyping(data);
      });
  }

  initializeApp() {
    this.socket.connect();
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#0074D9');
        this.statusBar.styleLightContent();
        this.splashScreen.hide();
        this.notificationSetup();
    });
    /*this.whoIam.getToken().then((val: string) => {
      if (val !== null) {
        this.userService.getCurrentUser().then((u: User) => {
          if (u !== null) {
            WhoIAmService.setUser(u);
            this.socket.emit('user chat set', u);
          }
        });
      }
    });*/
  }

    getTypings() {
        return new Observable(observer => {
            this.socket.on('user istyping', (data) => {
                // console.log(data);
                observer.next(data);
            });
        });
    }

    private async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 3000
        });
        toast.present();
    }

    private notificationSetup() {
        this.fcm.getToken();
        this.fcm.onNotifications().subscribe(
            (msg) => {
                if (this.platform.is('ios')) {
                    this.presentToast(msg.aps.alert);
                } else {
                    this.presentToast(msg.body);
                }
            });
    }
}
