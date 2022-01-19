import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MyNotification } from 'src/models/Notification';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommandService {
  totalNotifications: MyNotification[] = [];
  urlGetAllCommands = 'http://localhost:3001/allcommands';
  urlPostNewCommand = 'http://localhost:3001/addnewcommand';

  constructor(private httpClient: HttpClient) {}

  getAllCommands(): Observable<String[]> {
    return this.httpClient.get<String[]>(this.urlGetAllCommands);
  }

  postNewCommand(command: String): Observable<String[]> {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
    return this.httpClient.post<String[]>(
      this.urlPostNewCommand,
      { command: command },
      { headers: headers }
    );
    /*.subscribe((data) => {
        console.log(data);
      });*/
  }
}
