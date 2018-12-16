import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConversationPage } from './conversation.page';
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
      // EmojiPickerModule
  ],
  declarations: [ConversationPage]
})
export class ConversationPageModule {}
