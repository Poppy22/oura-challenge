import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ChartType, ChartOptions, ChartDataSets, ChartPoint } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  data = {
    hypnogram_5min: '',
    piechart: {
      rem: 0,
      deep: 0,
      light: 0,
      awake: 100
    },
    score: 0,
    weekday: '',
    performance: 0,
    best_day: 0
  };


  // Pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };
  public pieChartLabels: Label[] = ['REM', 'Deep sleep', 'Light Sleep', 'Awake'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(103, 58, 183, 0.8)',
        'rgba(3, 169, 244, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(244, 67, 54, 0.8)'
      ],
    },
  ];


  // Scatter chart
  public scatterChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.5,
          suggestedMax: 4.5
        }
      }]
    }
  };

  public scatterChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Series A',
      pointRadius: 6,
      backgroundColor: 'rgba(244, 67, 54, 0.8)'
    }, {
      data: [],
      label: 'Series B',
      pointRadius: 8,
      backgroundColor: 'rgba(76, 175, 80, 0.8)'
    }, {
      data: [],
      label: 'Series C',
      pointRadius: 8,
      backgroundColor: 'rgba(3, 169, 244, 0.8)'
    }, {
      data: [],
      label: 'Series D',
      pointRadius: 10,
      backgroundColor: 'rgba(103, 58, 183, 0.8)'
    }
  ];
  public scatterChartType: ChartType = 'scatter';

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getHomepageData().subscribe(
      res => {
        this.data = res.data;
        this.pieChartData = [
          this.data.piechart.rem,
          this.data.piechart.deep,
          this.data.piechart.light,
          this.data.piechart.awake
        ];

        let step = 1;
        [...this.data.hypnogram_5min].forEach(h => {
          const hNum = parseInt(h, 10);
          (this.scatterChartData[hNum - 1].data as ChartPoint[]).push({ x: step, y: hNum });
          step++;
        });
      },
      err => console.error(err)
    );
  }

}
