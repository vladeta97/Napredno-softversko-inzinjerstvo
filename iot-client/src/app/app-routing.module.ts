import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OakComponent } from './components/oak/oak.component';
import { FosterComponent } from './components/foster/foster.component';
import { SixthreeComponent } from './components/sixthree/sixthree.component';
import { CommandComponent } from './components/command/command.component';
import { HomeComponent } from './components/home/home.component';
import { NotificationLogComponent } from './components/notification-log/notification-log.component';

const routes: Routes = [
  { path: 'oak', component: OakComponent },
  { path: 'foster', component: FosterComponent },
  { path: 'sixthree', component: SixthreeComponent },
  { path: 'command', component: CommandComponent },
  { path: 'notificationlog', component: NotificationLogComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
