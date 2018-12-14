import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {WhoIAmService} from './services/who-i-am.service';
import {UtilisateurService} from './services/utilisateur.service';
// import {User} from './models/User.model';
import { Socket } from 'ng-socket-io';

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
    private socket: Socket
  ) {
    this.initializeApp();
      this.statusBar.overlaysWebView(true);
  }

  initializeApp() {
    this.socket.connect();
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#0074D9');
        this.statusBar.styleLightContent();
      this.splashScreen.hide();
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
}
