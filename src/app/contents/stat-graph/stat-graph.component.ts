import {Component, OnInit} from '@angular/core';
import {EChartOption} from 'echarts';
import {ActivatedRoute} from '@angular/router';
import {EXAMPLE_STAT} from './example-data';
import {ContributorStat, GHAuthorInfo, StatEntry} from '../../types/types';
import {hsl2hex} from '../../shared/color-tools';
import {combineLatest, Observable, of, Subscriber} from 'rxjs';
import {map} from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import SeriesSunburst = echarts.EChartOption.SeriesSunburst;

@Component({
  selector: 'app-stat-graph',
  templateUrl: './stat-graph.component.html',
  styleUrls: ['./stat-graph.component.styl']
})
export class StatGraphComponent implements OnInit {

  team = '队伍名';

  options: EChartOption;

  orderNames: [string, string][] = [['week', '周数'], ['member', '成员'], ['ad', '增删']]
  orderSubscriber: Subscriber<string[]>;
  order$: Observable<string[]>;
  colorTable = {
    week: (current: string) => hsl2hex(0, 0, 0.6 + 0.2 * Number(current) / this.week_count),
    ad: (current: string) => current === 'add' ? '#2cbe4e' : '#cb2431',
    member: (current: string) => {
      const index = Number(current);
      switch (this.member_count) {
        case 1:
          return '#03a9f4';
        case 2:
          return ['#ef5350', '#03a9f4'][index]
        case 3:
          return ['#ef5350', '#8BC34A', '#03a9f4'][index]
        case 4:
          return ['#ef5350', '#FFD600', '#8BC34A', '#03a9f4'][index]
        case 5:
          return ['#ef5350', '#FFD600', '#8BC34A', '#03a9f4', '#9575cd'][index]
        default:
          return ['#ef5350', '#ffa000', '#d4e157', '#4db6ac', '#03a9f4', '#03a9f4'][index % this.member_count]
      }
    }
  }

  formatName(value: string, type: string): string {
    switch (type) {
      case "week":
        return `第${Number(value) + 1}周`
      case "member":
        return this.member_list[Number(value)]
      case "ad":
        return value === 'add' ? '增加' : '删除'
    }
  }

  week_count: number;
  member_map: {[key: string]: GHAuthorInfo};
  member_list: string[];
  member_count: number;

  preprocessData(raw_data: ContributorStat[]) {
    const weekSet = new Set<string>();
    this.member_map = {};

    raw_data.forEach(stat => {
      this.member_map[stat.author.login] = stat.author;
      stat.weeks.forEach(weekly => weekSet.add(weekly.w));
    });

    const weekList = [...weekSet].sort();
    this.week_count = weekList.length;
    this.member_list = Object.keys(this.member_map);
    this.member_count = this.member_list.length;

    const preprocessed_data: StatEntry[] = [];

    raw_data.forEach(stat => {
      stat.weeks.forEach(weekly => {
        preprocessed_data.push({
          ad: 'add',
          data: weekly.a,
          member: this.member_list.indexOf(stat.author.login),
          week: weekList.indexOf(weekly.w),
          member_info: stat.author
        }, {
          ad: 'del',
          data: weekly.d,
          member: this.member_list.indexOf(stat.author.login),
          week: weekList.indexOf(weekly.w),
          member_info: stat.author
        })
      })
    })

    return preprocessed_data
  }

  groupBy<T>(arr: T[], by: ((v: T) => string) | string): {[key: string]: T[]} {
    return arr.reduce(function(rv: {[key: string]: T[]}, x: T) {
      const by_v = typeof by === 'function' ? by(x) : by;
      (rv[x[by_v]] = rv[x[by_v]] || []).push(x);
      return rv;
    }, {});
  }

  generateData(data: StatEntry[], order: string[]): SeriesSunburst.DataObject[] {
    return this._generateData(data, order, 0, 2);
  }

  /**
   * Recursive group current layer of data
   */
  _generateData(data: StatEntry[], order: string[], layer: number, limit: number): SeriesSunburst.DataObject[] {
    const field = order[layer];

    if (layer === limit) {
      return data.map(entry => {
        return {
          name: this.formatName(entry[field], field),
          value: entry.data,
          itemStyle: {
            color: this.colorTable[field](entry[field])
          },
        }
      })
    }

    return Object.entries(this.groupBy(data, field))
      .map(([field_value, data]) => {
        return {
          name: this.formatName(field_value, field),
          itemStyle: {
            color: this.colorTable[field](field_value)
          },
          children: this._generateData(data, order, layer + 1, limit)
        }
      })
  }

  sorterDropped(e: CdkDragDrop<[string, string][]>) {
    moveItemInArray(this.orderNames, e.previousIndex, e.currentIndex);
    this.orderSubscriber.next(this.orderNames.map(([field, _]) => field));
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      // set up order change notification
      this.order$ = new Observable<string[]>(subscriber => {
        subscriber.next(this.orderNames.map(([field, _]) => field));
        this.orderSubscriber = subscriber;
      })

      // data should be update upon each new data fetched or data order change
      combineLatest([
        // TODO fetch data from backend
        of(EXAMPLE_STAT).pipe(
          map(raw => this.preprocessData(raw)),
        ),
        this.order$
      ]).pipe(
        map(([data, order]):
        [SeriesSunburst.DataObject[], string[]] => [this.generateData(data, order), order]),
      ).subscribe(([data, order]) => {
        const orderMap = Object.entries(order).reduce((v: {[key: string]: number}, [index, entry]) => {
          v[entry] = Number(index) + 1;
          return v;
        }, {});
        this.options = {
          tooltip: {
            formatter: (params): string => {
              // this sunburst specified field is missing in type definition
              // @ts-ignore
              const path = params.treePathInfo as {name: string, value: number}[];
              const len = path.length - 1;
              const week = orderMap['week'] > len ? '整个项目' : path[orderMap['week']].name;
              const member = orderMap['member'] > len ? '整个团队' : `成员${path[orderMap['member']].name}`;
              const ad = orderMap['ad'] > len ? '提交' : path[orderMap['ad']].name;

              return `在${week}中${member}共${ad}了${path[path.length - 1].value}行代码`;
            }
          },
          series: [{
            type: 'sunburst',
            radius: [0, '90%'],
            label: {
              rotate: 'radial'
            },
            sort: null,
            data
          }]
        }
      });
    })
  }
}
