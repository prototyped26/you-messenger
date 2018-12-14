import {Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController, Searchbar} from '@ionic/angular';
import {User} from '../../models/User.model';
import {Subscription} from 'rxjs';
import {UtilisateurService} from '../../services/utilisateur.service';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit, OnDestroy {
  @ViewChild(Searchbar) search: Searchbar;
    public users: Array<User> = [];
    public usersData: Array<User> = [];
    public usersSubscription: Subscription;
  constructor(private modalCtrl: ModalController,
              private renderer: Renderer2,
              private userService: UtilisateurService,
              private router: Router) {
      this.usersSubscription = this.userService.usersSubject.subscribe((u: Array<User>) => {
          this.usersData = u;
          this.users = this.usersData;
      });
      this.userService.emitUsers();
  }

  ngOnInit() {

  }
  ngOnDestroy() {
      this.usersSubscription.unsubscribe();
  }
  ionViewDidEnter() {
      setTimeout(() => {
          this.search.setFocus();
      });
  }
  onCloseModal() {
    this.modalCtrl.dismiss();
  }
  onSearch(term: string) {
      this.users = [];
      if (term.length === 0) {
          this.users = this.usersData;
      } else {
          this.usersData.forEach(u => {
              const str = u.nom + ' ' + u.prenom + ' ' + u.telephone;
              if (str.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                  this.users.push(u);
              }
          });
      }
  }
  onGoto(u: User) {
      const navigationExtras: NavigationExtras = {
          queryParams: {
              'user': JSON.stringify(u)
          }
      };
      this.modalCtrl.dismiss();
      this.router.navigate(['/conversation'], navigationExtras);
  }

}
