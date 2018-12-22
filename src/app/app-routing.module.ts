import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TokenGuard} from './guards/token.guard';

const routes: Routes = [
  { path: '', canActivate: [TokenGuard], loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'welcome', loadChildren: './screens/welcome/welcome.module#WelcomePageModule' },
  { path: 'sign-in', loadChildren: './screens/sign-in/sign-in.module#SignInPageModule' },
  { path: 'contact-list', loadChildren: './screens/contact-list/contact-list.module#ContactListPageModule' },
  { path: 'conversation', canActivate: [TokenGuard], loadChildren: './pages/conversation/conversation.module#ConversationPageModule' },
  { path: 'liste', loadChildren: './pages/liste/liste.module#ListePageModule' },  { path: 'profil', loadChildren: './screens/profil/profil.module#ProfilPageModule' }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
