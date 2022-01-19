import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CommandService } from 'src/services/CommandService';
import { MyNotification } from 'src/models/Notification';
import { OakService } from 'src/services/OakService';
import { FosterService } from 'src/services/FosterService';
import { SixThreeService } from 'src/services/SixThreeService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'iot-client';
  nizNotifikacija: MyNotification[] = [];

  constructor(
    private socket: Socket,
    private commandService: CommandService,
    private oakService: OakService,
    private fosterService: FosterService,
    private _63rdService: SixThreeService
  ) {}

  ngOnInit(): void {
    this.konektujSeNaNotifikacije();
  }

  konektujSeNaNotifikacije() {
    this.socket
      .fromEvent<any>('alert.client')
      .subscribe((notification: MyNotification) => {
        console.log(notification);
        this.nizNotifikacija.push(notification);
        this.commandService.totalNotifications.push(notification);
      });
  }

  skloniNotifikaciju(index: number) {
    this.nizNotifikacija.splice(index, 1);
  }
  ocisti() {
    this.nizNotifikacija = [];
  }
}
