import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private socket: Socket) {}

  ngOnInit(): void {
    //this.testMetoda();
  }
  /*testMetoda() {
    console.log('AAAAAAAAAAAAAAAAAAAAA');
    this.socket.fromEvent<any>('alert.client').subscribe((data) => {
      console.log(data);
    });
  }*/
}
