import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ChartType, ChartOptions, ChartDataSets, ChartPoint } from 'chart.js';
import { Label } from 'ng2-charts';
import { TooltipPosition } from '@angular/material/tooltip';

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
    best_day: {
      weekday: '',
      score: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
      best_day_name: '',
      best_day_score: 0
    }
  };

  tooltipPosition: TooltipPosition = 'left';
  lastNightMessage = '';

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
      label: 'Deep sleep',
      pointRadius: 5,
      backgroundColor: 'rgba(3, 169, 244, 0.8)'
    }, {
      data: [],
      label: 'Light sleep',
      pointRadius: 5,
      backgroundColor: 'rgba(76, 175, 80, 0.8)'
    }, {
      data: [],
      label: 'REM',
      pointRadius: 5,
      backgroundColor: 'rgba(103, 58, 183, 0.8)'
    }, {
      data: [],
      label: 'Awake',
      pointRadius: 5,
      backgroundColor: 'rgba(244, 67, 54, 0.8)'
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

        if (this.data.score > 70) {
          this.lastNightMessage = 'You slept like a log';
        } else if (this.data.score > 45) {
          this.lastNightMessage = 'This can be improved - go to bed early';
        } else {
          this.lastNightMessage = 'Restless sleep';
        }
      },
      err => console.error(err)
    );
  }

}
