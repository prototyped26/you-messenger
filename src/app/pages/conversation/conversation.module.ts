import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConversationPage } from './conversation.page';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../translate-loader';
import {HttpClient} from '../../../../node_modules/@angular/common/http';
// import {EmojiPickerModule} from '../../../../node_modules/ionic-emoji-picker/dist/emoji-picker.module';

const routes: Routes = [
  {
    path: '',
    component: ConversationPage
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
      // EmojiPickerModule
  ],
  declarations: [ConversationPage]
})
export class ConversationPageModule {}
