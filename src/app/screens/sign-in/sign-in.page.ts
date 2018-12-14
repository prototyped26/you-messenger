import { Component, OnInit } from '@angular/core';
import {WhoIAmService} from '../../services/who-i-am.service';
import {Router} from '@angular/router';
import {LoadingController, ToastController} from '@ionic/angular';
import {User} from '../../models/User.model';
import {UtilisateurService} from '../../services/utilisateur.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public telephone: string = null;
  public nom: string = null;
  constructor(private whoIam: WhoIAmService,
              private router: Router,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private userService: UtilisateurService) { }

  ngOnInit() {
  }
  onConitnue() {
    // console.log(this.telephone);
      const chaine = '' + this.telephone;
    if (chaine.length > 8 ) {
        this.presentLoading();
        let user: User;
        this.whoIam.getUserInfo().then((u: User) => {
            if (u !== null) {
                user = u;
            }
            user.telephone = this.telephone;
            user.nom = this.nom;
            user.langue_id = +user.langue.id;
            this.userService.createNewUser(user).then(res => {
                this.loadingCtrl.dismiss();
                if (res) {
                    this.router.navigate(['/']);
                }
            });
        });
    } else {
      this.presentToast('Attention veuillez vérifier le numéro de téléphone !');
    }

  }
    async presentLoading() {
        const loading = await this.loadingCtrl.create({
            message: 'Chargement...',
            animated: true,
            duration: 10000
        });
        return await loading.present();
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000
        });
        return toast.present();
    }


}
