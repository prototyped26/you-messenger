import {Component, OnDestroy, OnInit} from '@angular/core';
import {LanguesService} from '../../services/langues.service';
import {Langue} from '../../models/Langue.model';
import {Subscription} from 'rxjs';
import {LoadingController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WhoIAmService} from '../../services/who-i-am.service';
import {User} from '../../models/User.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit, OnDestroy {

  public langues: Array<Langue> = [];
  public langue: Langue = null;
  public languesSubscription: Subscription;
  public loading: any;
  constructor(private languesService: LanguesService,
              private loadingCtrl: LoadingController,
              private router: Router,
              private whoIam: WhoIAmService,
              private toastCtrl: ToastController) {
    this.languesService.languesSubject.subscribe((l: Array<Langue>) => {
      this.langues = l;
    });
    this.languesService.getLangues().then(res => {});
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.languesSubscription.unsubscribe();
  }

  onChangeLanguage(val) {
    const index = this.langues.findIndex(l => l.code + '' === val + '');
    // console.log(index);
    if (index >= 0) {
      this.langue = this.langues[index];
    }
  }

  onContinue() {
    let user: User = new User();
    if (this.langue !== null) {
        this.presentLoading();
        this.whoIam.getUserInfo().then((u: User) => {
            if (u !== null) {
                user = u;
            }
            user.langue = this.langue;
            this.whoIam.storeUserInfo(user).then(res => {
              this.loadingCtrl.dismiss();
              if (res) {
                this.router.navigate(['/sign-in']);
              }
            });
        });
    } else {
      // con
        this.presentToast('Attention, il faut choisir la langue !');
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
        message: 'Chargement...',
        animated: true,
        duration: 4000
    });
    return await this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
        message: message,
        duration: 2000
    });
    return toast.present();
  }

}
