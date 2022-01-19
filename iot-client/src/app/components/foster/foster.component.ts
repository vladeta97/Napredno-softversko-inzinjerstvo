import { Component, OnInit } from '@angular/core';
import { FosterService } from 'src/services/FosterService';
import { interval } from 'rxjs';

@Component({
  selector: 'app-foster',
  templateUrl: './foster.component.html',
  styleUrls: ['./foster.component.css'],
})
export class FosterComponent implements OnInit {
  constructor(private fosterService: FosterService) {}

  chartDatasets: Array<any> = [];
  chartLabels: Array<any> = [];
  chartType: string = 'line';
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(92, 184, 92, .3)',
      borderColor: 'rgba(92, 184, 92, 1)',
      borderWidth: 2,
    },
  ];
  public chartOptions: any = {
    responsive: true,
  };
  recentData: any = null;

  ngOnInit(): void {
    this.gameLoop();
    interval(3000).subscribe(() => {
      this.gameLoop();
    });
  }

  gameLoop() {
    this.recentData = this.fosterService.recentData;
    console.log(this.recentData);

    if (
      this.recentData[this.recentData.length - 1].airTemperature &&
      this.recentData[this.recentData.length - 1].airTemperature != '' &&
      this.recentData[this.recentData.length - 1].airTemperature.trim() != ''
    ) {
      let pomNiz = [];
      this.recentData.forEach((data) => {
        pomNiz.push(data.airTemperature);
      });
      this.chartDatasets = [{ data: pomNiz, label: 'Air Temperature' }];
    } else if (
      this.recentData[this.recentData.length - 1].wetBulbTemperature &&
      this.recentData[this.recentData.length - 1].wetBulbTemperature != '' &&
      this.recentData[this.recentData.length - 1].wetBulbTemperature.trim() !=
        ''
    ) {
      let pomNiz = [];
      this.recentData.forEach((data) => {
        pomNiz.push(data.wetBulbTemperature);
      });
      this.chartDatasets = [
        {
          data: pomNiz,
          label: 'Feels Like Temperature',
        },
      ];
    }
    this.chartLabels = [];
    for (let i = 0; i < this.recentData.length; i++)
      this.chartLabels.push(this.recentData[i].measurementTimestamp);
  }

  getFormat(data: any, code: any): string {
    if (!data || data == '' || data.trim() == '') {
      return '/';
    } else {
      switch (code) {
        case 'T':
          return data + ' °C.';
        case 'H':
          return data + ' %.';
        case 'W':
          return data + ' mp/h.';
        case 'R':
          return data + ' mm/m^2';
        case 'I':
          return data + ' mm/h';
        case 'P':
          return data + ' mbar';
        case 'S':
          return data + ' W/m^2';
        default:
          return data + ' undefined format.';
      }
    }
  }
}
