import { Component } from '@angular/core';


import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HW8';
  
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Options = {
    series: [
      {
        type: 'line',
        pointInterval: 24 * 3600 * 1000,
        data: [1, 2, 3, 4, 5]
      }
    ]
  };

}
