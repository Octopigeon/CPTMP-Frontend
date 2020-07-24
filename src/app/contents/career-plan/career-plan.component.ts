import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {JOB_TECHS, TECH_LIST} from '../../constants/techs';
import {EChartOption} from 'echarts';
import Format = echarts.EChartOption.Tooltip.Format;
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-career-plan',
  templateUrl: './career-plan.component.html',
  styleUrls: ['./career-plan.component.styl'],
  animations: [
    trigger('graph', [
      transition(':enter', [
        style({ opacity: 0}),  // initial
        animate('0.6s linear',
          style({ opacity: 1}))  // final
      ])
    ])
  ]
})
export class CareerPlanComponent implements OnInit {

  techs = TECH_LIST;
  _jobs = JOB_TECHS;
  jobs: Map<string, Set<string>>;
  job_stats: Map<string, number>;
  options: EChartOption;

  generated: boolean = false;

  selection = new SelectionModel<string>(true, []);

  generateAdvice() {
    console.log(this.jobs);
    this.job_stats = new Map();
    Array.from(this.jobs.keys()).forEach(job => this.job_stats.set(job, 0));
    this.selection.selected.forEach(tech => {
      for (let [job, techs] of this.jobs.entries()) {
        if (techs.has(tech)) {
          this.job_stats.set(job, this.job_stats.get(job) + 1);
        }
      }
    });
    console.log(this.job_stats);
    console.log(this.selection);
    this.options = {
      tooltip: {
        formatter: (params) => {
          const values = (params as Format).value as number[];
          return '<b>职业适合度</b><br />' +
            Array.from(this.jobs.keys())
              .map((name, index): [string, number] => [name, values[index]])
              .map(([name, value]) => `${name}: ${value}`)
              .join('<br />');
        }
      },
      radar: {
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: Array.from(this.jobs).map(([job, techs]) => {
          return {name: job, max: techs.size}
        })
      },
      series: [{
        type: 'radar',
        data: [{
          value: Array.from(this.job_stats.values()),
          name: '职业适合度'
        }]
      }]
    };
    console.log(this.options)
    this.generated = true;
  }

  constructor() {
    this.jobs = new Map();
    Object
      .entries(this._jobs)
      .map(([job, techs]): [string, Set<string>] => [job, new Set<string>(techs)])
      .forEach(([job, techs]) => this.jobs.set(job, techs));
  }

  ngOnInit(): void {
  }

}
