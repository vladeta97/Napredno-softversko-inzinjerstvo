import { Component, OnInit } from '@angular/core';
import { CommandService } from 'src/services/CommandService';
import { MyNotification } from 'src/models/Notification';

@Component({
  selector: 'app-notification-log',
  templateUrl: './notification-log.component.html',
  styleUrls: ['./notification-log.component.css'],
})
export class NotificationLogComponent implements OnInit {
  filterType: number = 0;

  constructor(public commandService: CommandService) {}

  ngOnInit(): void {
    this.returnValid(this.commandService.totalNotifications);
  }

  returnValid(niz: MyNotification[]) {
    if (this.filterType == 0) return niz.reverse();
    else if (this.filterType == 1) {
      let pomNiz: MyNotification[] = [];
      niz.forEach((noti: MyNotification) => {
        if (noti.location.charAt(0) == 'O') pomNiz.push(noti);
      });
      return pomNiz;
    } else if (this.filterType == 2) {
      let pomNiz: MyNotification[] = [];
      niz.forEach((noti: MyNotification) => {
        if (noti.location.charAt(0) == 'F') pomNiz.push(noti);
      });
      return pomNiz;
    } else if (this.filterType == 3) {
      let pomNiz: MyNotification[] = [];
      niz.forEach((noti: MyNotification) => {
        if (noti.location.charAt(0) == '6') pomNiz.push(noti);
      });
      return pomNiz;
    }
  }

  setFilter(filterType: number) {
    this.filterType = filterType;
    this.returnValid(this.commandService.totalNotifications);
  }
}
