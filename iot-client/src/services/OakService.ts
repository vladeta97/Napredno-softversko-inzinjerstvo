import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OakService {
  urlGetRecent = 'http://localhost:3001/recentoak';
  public recentData: any = [];
  constructor(private httpClient: HttpClient) {
    interval(3000).subscribe(() => {
      this.getData();
    });
  }

  getData() {
    this.httpClient.get(this.urlGetRecent).subscribe((data: any) => {
      this.recentData = data;
    });
  }
}
