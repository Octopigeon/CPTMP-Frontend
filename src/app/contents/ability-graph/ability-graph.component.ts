import { Component, OnInit } from '@angular/core';
import {PersonalGrade} from '../../types/types';
import {ActivatedRoute} from '@angular/router';
import SeriesRadar = echarts.EChartOption.SeriesRadar;
import {EChartOption} from 'echarts';
import {combineLatest, Observable, of, Subscriber} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import Format = echarts.EChartOption.Tooltip.Format;

const EXAMPLE_GRADE: PersonalGrade = {
  code_point: 91,
  communication_point: 84,
  framework_point: 92,
  manage_point: 85,
  tech_point: 96,

  evaluation: '数组是一种类列表对象，它的原型中提供了遍历和修改元素的相关操作。JavaScript 数组的长度和元素类型都是非固定的。' +
    '因为数组的长度可随时改变，并且其数据在内存中也可以不连续，所以 JavaScript 数组不一定是密集型的，这取决于它的使用方式。' +
    '一般来说，数组的这些特性会给使用带来方便，但如果这些特性不适用于你的特定使用场景的话，可以考虑使用类型数组 TypedArray。' +
    '只能用整数作为数组元素的索引，而不能用字符串。后者称为关联数组。使用非整数并通过方括号或点号来访问或设置数组元素时，' +
    '所操作的并不是数组列表中的元素，而是数组对象的属性集合上的变量。数组对象的属性和数组元素列表是分开存储的，' +
    '并且数组的遍历和修改操作也不能作用于这些命名属性。',

  id: 1,
  team_id: 0,
  user_id: 0,
}

@Component({
  selector: 'app-ability-graph',
  templateUrl: './ability-graph.component.html',
  styleUrls: ['./ability-graph.component.styl']
})
export class AbilityGraphComponent implements OnInit {

  // TODO set these to real value
  name = '姓名';
  train = '实训';
  project = '项目';
  team = '团队';

  options: EChartOption;

  indicator: {[key: string]: string} = {
    code_point: '编码能力',
    communication_point: '交流能力',
    framework_point: '设计能力',
    manage_point: '管理能力',
    tech_point: '技术能力',
  }

  evaluation: string = '';

  point: number = 0;

  base$: Observable<number>;
  baseSubscriber: Subscriber<number>;
  maxBase: number = 100;

  constructor(private route: ActivatedRoute) { }

  updateBase(value: number) {
    value ? this.baseSubscriber.next(value) : undefined;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.base$ = new Observable<number>(subscriber => {
        subscriber.next(0);
        this.baseSubscriber = subscriber;
      })

      combineLatest([
        // TODO change to fetched real data
        of(EXAMPLE_GRADE)
          .pipe(
            tap(grade => this.evaluation = grade.evaluation),
            map((grade): number[] => Object.keys(this.indicator).map(key => grade[key]))
          ),
        this.base$
      ]).subscribe(([grade, base]) => {
        this.point = grade.reduce((total, current) => total + current, 0) / grade.length;
        this.maxBase = grade.reduce((min, current) => current < min ? current : min, 100);
        this.options = {
          tooltip: {
            formatter: (params) => {
              const values = (params as Format).value as number[];
              return '<b>能力评价</b><br />' +
                Object.values(this.indicator)
                .map((name, index): [string, number] => [name, values[index]])
                .map(([name, value]) => `${name}: ${value + base}分`)
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
            indicator: Object.values(this.indicator).map(name => {
              return {name, max: 100 - base}
            })
          },
          series: [{
            type: 'radar',
            data: [{
                value: grade.map(i => i - base),
                name: '能力评价'
            }]
          }]
        };
      })
    })
  }

}
