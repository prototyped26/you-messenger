import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/User.model';
import {Subscription} from 'rxjs';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {UtilisateurService} from '../../services/utilisateur.service';
import {Router} from '@angular/router';
import {WhoIAmService} from '../../services/who-i-am.service';
import {Langue} from '../../models/Langue.model';
import {LanguesService} from '../../services/langues.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit, OnDestroy {

    public user: User = new User();
    public langues: Array<Langue> = [];
    public langue: Langue = null;
    public loading: any;
    public error = '';

    constructor(private modalController: ModalController,
                private userService: UtilisateurService,
                private languesService: LanguesService,
                private loadingCtrl: LoadingController,
                private router: Router,
                private whoIam: WhoIAmService,
                private toastCtrl: ToastController) {
        this.whoIam.getUserInfo().then((u: User) => {
            this.user = u;
            this.langue = u.langue;
        });
        this.languesService.languesSubject.subscribe((l: Array<Langue>) => {
            this.langues = l;
        });
        this.languesService.getLangues().then(res => {});
    }

  ngOnInit() {
  }
  onChangeLanguage(val) {
        const index = this.langues.findIndex(l => l.code + '' === val + '');
        // console.log(index);
        if (index >= 0) {
            this.langue = this.langues[index];
        }
    }

    onContinue() {
        if (this.langue !== null) {
          if (this.user.nom.length === 0) {
            this.error += 'Saisir le nom, ';
          }

            if (this.error.length === 0) {
                this.presentLoading();
                this.user.langue = this.langue;
                this.whoIam.storeUserInfo(this.user).then(res => {
                    // this.loadingCtrl.dismiss();
                    if (res) {
                        this.userService.updateUser(this.user).then(result => {
                          if (result) {
                              this.router.navigate(['/tabs']);
                              this.loadingCtrl.dismiss();
                          }
                        });
                    }
                });
            } else {
                this.presentToast('' + this.error);
                this.error = '';
            }
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
