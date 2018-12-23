import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../translate-loader';
import {HttpClient} from '../../../node_modules/@angular/common/http';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
      TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
          }
      }),
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
