import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ChartsModule } from 'ng2-charts';
import { OakComponent } from './components/oak/oak.component';
import { FosterComponent } from './components/foster/foster.component';
import { SixthreeComponent } from './components/sixthree/sixthree.component';
import { CommandComponent } from './components/command/command.component';
import { NotificationLogComponent } from './components/notification-log/notification-log.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OakComponent,
    FosterComponent,
    SixthreeComponent,
    CommandComponent,
    NotificationLogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    SocketIoModule.forRoot(config),
    NoopAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
