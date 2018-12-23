import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactListPage } from './contact-list.page';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../translate-loader';
import {HttpClient} from '../../../../node_modules/@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: ContactListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
      TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
          }
      }),
  ],
  declarations: []
})
export class ContactListPageModule {}
