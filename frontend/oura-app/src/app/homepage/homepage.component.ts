import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ChartType, ChartOptions } from 'chart.js';
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
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['REM', 'Deep sleep', 'Light Sleep', 'Awake'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(209, 196, 233, 0.3)',
        'rgba(178, 235, 242, 0.3)',
        'rgba(0, 255, 0, 0.3)',
        'rgba(255, 0, 0, 0.3)'
      ],
    },
  ];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getHomepageData().subscribe(
      res => {
        console.log(res.data);
        this.data = res.data;
        this.pieChartData = [
          this.data.piechart.rem,
          this.data.piechart.deep,
          this.data.piechart.light,
          this.data.piechart.awake
        ];
      },
      err => console.error(err)
    );
  }

}
