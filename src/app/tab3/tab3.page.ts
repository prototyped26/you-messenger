import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, LoadingController, ModalController} from '@ionic/angular';
import {UtilisateurService} from '../services/utilisateur.service';
import {Router} from '@angular/router';
import {WhoIAmService} from '../services/who-i-am.service';
import {User} from '../models/User.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

    public user: User = null;
    public userSubscription: Subscription;

    constructor(private modalController: ModalController,
                private userService: UtilisateurService,
                private router: Router,
                private whoIam: WhoIAmService,
                public actionSheetController: ActionSheetController) {
      this.whoIam.getUserInfo().then((u: User) => {
        this.user = u;
      });
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Parcourir',
            buttons: [{
                text: 'Appareil photo',
                role: 'destructive',
                icon: 'camera',
                handler: () => {
                    console.log('Delete clicked');
                }
            }, {
                text: 'Galerie',
                icon: 'folder',
                handler: () => {
                    console.log('Favorite clicked');
                }
            }, {
                text: 'Fermer',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }

    onGoToModified() {
      this.router.navigate(['profil']);
    }
}
