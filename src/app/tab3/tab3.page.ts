import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, LoadingController, ModalController} from '@ionic/angular';
import {UtilisateurService} from '../services/utilisateur.service';
import {Router} from '@angular/router';
import {WhoIAmService} from '../services/who-i-am.service';
import {User} from '../models/User.model';
import {Subscription} from 'rxjs';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import {FileManagerService} from '../services/file-manager.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

    public user: User = null;
    public userSubscription: Subscription;
    public load = false;

    constructor(private modalController: ModalController,
                private userService: UtilisateurService,
                private router: Router,
                private whoIam: WhoIAmService,
                public actionSheetController: ActionSheetController,
                private imagePicker: ImagePicker,
                private fileManagerService: FileManagerService,
                private camera: Camera) {
      this.whoIam.getUserInfo().then((u: User) => {
        this.user = u;
        // console.log(u);
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
                    console.log('PHOTO clicked');
                    this.onOpenCamera();
                }
            }, {
                text: 'Galerie',
                icon: 'folder',
                handler: () => {
                    console.log('Galeri clicked');
                    this.onOpenGalerie();
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

    onOpenGalerie() {
        const option: ImagePickerOptions = {
            outputType: 1,
            maximumImagesCount: 1,
        };
        this.imagePicker.getPictures(option).then((results) => {
            console.log(results);
            for (let i = 0; i < results.length; i++) {
                this.onLaunchProcessImage('' + results[i]);
                // console.log('Image URI: ' + results[i]);
            }
        }, (err) => { });
    }
    onOpenCamera() {
        const options: CameraOptions = {
            // quality: 100,
            quality: 45,
            targetWidth: 500,
            targetHeight: 500,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            const base64Image = '' + imageData;
            // console.log(base64Image);
            // const base64Image = '' + imageData;
            this.onLaunchProcessImage('' + base64Image);
        }, (err) => {
            // Handle error
        });
    }
    onGoToModified() {
      this.router.navigate(['profil']);
    }

    onLaunchProcessImage(chaine: string) {
        this.load = true;
        this.fileManagerService.uploadFileBase64(chaine, 'image', 'png').then((res: any) => {
            this.user.photo = res.success.path;
            this.whoIam.storeUserInfo(this.user).then(result => {
                // this.loadingCtrl.dismiss();
                if (result) {
                    this.userService.updateUser(this.user).then(results => {
                        this.load = false;
                    });
                }
            });
        });
    }
}
