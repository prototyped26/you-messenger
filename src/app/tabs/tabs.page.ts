import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {ContactListPage} from '../screens/contact-list/contact-list.page';
import {User} from '../models/User.model';
import {WhoIAmService} from '../services/who-i-am.service';
import {Socket} from 'ng-socket-io';
import {UtilisateurService} from '../services/utilisateur.service';
import {MessagesService} from '../services/messages.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  constructor(private router: Router,
              private modalController: ModalController,
              private whoIam: WhoIAmService,
              private userService: UtilisateurService,
              private socket: Socket,
              private messageService: MessagesService) {
    // this.router.navigate(['/sign-in']);
  }
  ngOnInit() {
  }
  async onOpenSearch() {
    const modal = await this.modalController.create({
        component: ContactListPage,
        componentProps: {}
    });
    return await modal.present();
  }
}
