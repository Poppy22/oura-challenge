import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

export interface GraphTypes {
  value: string;
  viewValue: string;
  unit: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  types: GraphTypes[] = [
    { value: 'score', viewValue: 'Score', unit: '1-100' },
    { value: 'score_disturbances', viewValue: 'Score Disturbances', unit: '1-100' },
    { value: 'score_efficiency', viewValue: 'Score Efficiency', unit: '1-100' },
    { value: 'score_latency', viewValue: 'Score Latency', unit: '1-100' },
    { value: 'score_rem', viewValue: 'Score REM', unit: '1-100' },
    { value: 'score_deep', viewValue: 'Score Deep', unit: '1-100' },
    { value: 'score_alignment', viewValue: 'Score Alignment', unit: '1-100' },
    { value: 'duration', viewValue: 'Duration', unit: 'sec' },
    { value: 'awake', viewValue: 'Awake', unit: 'sec' },
    { value: 'light', viewValue: 'Light', unit: 'sec' },
    { value: 'rem', viewValue: 'REM', unit: 'sec' },
    { value: 'deep', viewValue: 'Deep', unit: 'sec' },
    { value: 'onset_latency', viewValue: 'Latency', unit: 'sec' },
    { value: 'restless', viewValue: 'Restlessness', unit: '%' },
    { value: 'efficiency', viewValue: 'Efficiency', unit: '%' },
    { value: 'hr_average', viewValue: 'Heart rate average', unit: 'bpm' },
    { value: 'breath_average', viewValue: 'Breath average', unit: 'bpm' }
  ];

  completeData = [];
  startDateForm = new FormControl(null);
  endDateForm = new FormControl(new Date());
  primaryGraph = 'score';
  secondaryGraph = 'duration';

  chartVisible = false;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      yAxes: [{
        id: 'axis-1',
        position: 'left',
        gridLines: {
          color: 'rgba(209, 196, 233, 0.85)',
        },
        ticks: {
          beginAtZero: false,
          fontColor: '#673ab7',
          suggestedMax: 105
        }
      }, {
        id: 'axis-2',
        position: 'right',
        gridLines: {
          color: 'rgba(178, 235, 242, 0.85)',
        },
        ticks: {
          beginAtZero: false,
          fontColor: '#00BCD4',
          suggestedMax: 105
        }
      }]
    },
    animation: {
      easing: 'easeOutQuad',
      duration: 550
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#673ab7',
      backgroundColor: 'rgba(209, 196, 233, 0.25)',
    },
    {
      borderColor: '#00BCD4',
      backgroundColor: 'rgba(178, 235, 242, 0.25)',
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  update() {
    if (this.completeData.length === 0) {
      this.auth.getSleepData(this.stringifyDate(this.startDateForm.value), this.stringifyDate(this.endDateForm.value))
        .subscribe(
          res => {
            this.completeData = res.data;
            this.updateGraph();
          },
          err => console.error(err)
        );
    } else {
      this.updateGraph();
    }
  }

  stringifyDate(d: Date) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  getLabel(key: string) {
    const elem = this.types.filter(t => t.value === key)[0];
    return `${elem.viewValue} (${elem.unit})`;
  }

  updateGraph() {
    this.lineChartData = [
      { data: [], label: this.getLabel(this.primaryGraph), yAxisID: 'axis-1' },
      { data: [], label: this.getLabel(this.secondaryGraph), yAxisID: 'axis-2' }
    ];
    this.lineChartLabels = [];

    this.completeData.forEach(d => {
      this.lineChartLabels.push(d.summary_date);
      this.lineChartData[0].data.push(d[this.primaryGraph]);
      this.lineChartData[1].data.push(d[this.secondaryGraph]);
    });

    this.chartVisible = true;
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
}
