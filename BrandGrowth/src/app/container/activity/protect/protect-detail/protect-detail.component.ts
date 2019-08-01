import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Store } from '@ngrx/store';
import * as reducer from '../../../../ngrx/reducer';
import * as global from '../../../../ngrx/action/global';
import * as secondLevel from '../../../../ngrx/action/secondLevel';
import * as moment from 'moment';
import { FilterPercentPipe } from '../../../../pipes/filter-percent.pipe'
import { IndicatorsSourceService } from '../../../../services/source/indicators.source.service'
const _ = require('lodash');

@Component({
  selector: 'protect-detail',
  templateUrl: './protect-detail.component.html',
  styleUrls: ['./protect-detail.component.less'],
  providers: [
    IndicatorsSourceService,
    FilterPercentPipe
  ]
})
export class ProtectDetailComponent implements OnInit {
  // tab切换数据格式
  private lineTableContent: any = [];
  private lineTableHeader_improssion: any = [
    {
      key: 'day',
      title: '时间',
    },
    {
      key: 'impression_anti_ip',
      title: 'IP异常',
    },
    {
      key: 'impression_anti_device',
      title: '设备异常',
    },
    {
      key: 'impression_overclock',
      title: '曝光碰撞',
    },
    {
      key: 'impression_anti_invisible',
      title: '不可见曝光',
    }
  ];
  private lineTableHeader_click: any = [
    {
      key: 'day',
      title: '时间',
    },
    {
      key: 'click_anti_ip',
      title: 'IP异常',
    },
    {
      key: 'click_anti_device',
      title: '设备异常',
    },
    {
      key: 'click_overclock',
      title: '点击频繁',
    },
  ];
  // chartData;
  private _lineChart: any;
  private chartLineConfig: any = null;
  private chartVennImpressionConfig: any = null;
  private chartVennClickConfig: any = null;
  private chartLineClickConfig: any;
  private metricData: any = {
    impression_pv: 0,
    impression_anti: 0,
    click_pv: 0,
    click_anti: 0
  };
  
  // titlechart
  private line1: any = null;
  private line2: any = null;
  private line3: any = null;
  private line4: any = null;
  private line5: any = null;
  private line6: any = null;
  // 全局时间
  private _startTime: any;
  private _endTime: any;
  private _store: any;
  private _secondLevel: number;
  private _activityKey: any;
  constructor(
    private store$: Store<reducer.State>,
    private indicatorsSourceService: IndicatorsSourceService,
    private filterPercentPipe: FilterPercentPipe,
    private router: Router,

  ) {
    // 媒体id
    this.store$.select('secondLevel').debounceTime(1000).distinctUntilChanged().subscribe((result: any) => {
      this._secondLevel = Number(result.secondLevelId);
    })

    this._store = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe(result => {
      this._startTime = result.startTime;
      this._endTime = result.endTime;
      this._activityKey = result.activityKey ? result.activityKey : JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION')).value;
      let Countparmas: any, Chartparmas: any, parmasVenn: any, parmasline: any;

      Chartparmas = {
        metrics: ['impression_anti', 'click_pv', 'impression_pv', 'click_anti'],
        dimension: "day",
        orderBy:'day',
        desc:'false',
        conditions: {
          activityKey: this._activityKey,
          channelId: this._secondLevel,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        detail: true
      }
      Countparmas = {
        metrics: ['impression_anti', 'click_pv', 'impression_pv', 'click_anti'],
        dimension: "media",
        conditions: {
          activityKey: this._activityKey,
          channelId: this._secondLevel,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        detail: true
      }
      parmasVenn = {
        metrics: [
          'impression_anti_source', 
          'click_anti_source',
        ],
        dimension: "media",
        conditions: {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD'),
          channelId: this._secondLevel,
        },
        detail: true
      }
      parmasline = {
        metrics: [
          'click_anti_device',
          'impression_anti_device',
          'click_anti_ip',
          'impression_anti_ip',
          'click_overclock',
          'impression_overclock',
          'impression_anti_invisible',
        ],
        dimension: "day",
        orderBy:'day',
        desc:'false',
        conditions: {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD'),
          channelId: this._secondLevel,
        },
        detail: true
      }

      // titleCount
      this.indicatorsSourceService.queryMetricData(Countparmas).then((data: any) => {
        if (data.code == 200 && data.result.length > 0) {
          this.metricData = data.result[0];
        }
      })
      // titleChart
      this.indicatorsSourceService.queryMetricData(Chartparmas).then((data: any) => {
        if (data.code == 200 && data.result.length > 0) {
          const linexData: any[] = [];
          const linesData1: any[] = [];
          const linesData2: any[] = [];
          const linesData3: any[] = [];
          const linesData4: any[] = [];
          const linesData5: any[] = [];
          const linesData6: any[] = [];
          const list = data.result;
          // 数据返回按时间排序
          const sort = list.sort((x: any, y: any) => {
            const a = Number(x.day.split('-').join(''));
            const b = Number(y.day.split('-').join(''));
            return a - b;
          });
          sort.forEach((item: any) => {
            const value1 = filterPercentPipe.transform(item.impression_anti / item.impression_pv);
            const value4 = filterPercentPipe.transform(item.click_anti / item.impression_pv);
            linexData.push(item.day);
            linesData1.push(value1 === 'N/A' ? 0 : value1);
            linesData2.push(item.impression_anti);
            linesData3.push(item.impression_pv)
            linesData4.push(value4 === 'N/A' ? 0 : value4);
            linesData5.push(item.click_anti);
            linesData6.push(item.click_pv);
          })

          this.line1 = this.initChartData(linexData, linesData1);
          this.line2 = this.initChartData(linexData, linesData2);
          this.line3 = this.initChartData(linexData, linesData3);
          this.line4 = this.initChartData(linexData, linesData4);
          this.line5 = this.initChartData(linexData, linesData5);
          this.line6 = this.initChartData(linexData, linesData6);
        }
      })
      // vennChart
      let that = this;
      this.indicatorsSourceService.queryMetricData(parmasVenn).then((data: any) => {
        if (data.code === 200 && data.result.length > 0) {
          const click = data.result[0].click_anti_source;
          const impression = data.result[0].impression_anti_source;
          // 曝光维恩图数据名称映射
          let chartVennImpression: any = [];
          impression.forEach((item: any) => {
            let obj: any = { sets: [], size: item.size }
            item.sets.forEach((element: any) => {
              switch (element) {
                case 'IP':
                  obj.sets.push("IP异常")
                  break;
                case 'DEVICE':
                  obj.sets.push("设备异常")
                  break;
                case 'OVERCLOCK':
                  obj.sets.push("曝光碰撞")
                  break;
                case 'VISIBLE':
                  obj.sets.push("不可见曝光")
                  break;
              }
            })
            chartVennImpression.push(obj);
          })
          this.chartVennImpressionConfig = chartVennImpression;
          // 点击维恩图数据名称映射
          let chartVennClick: any = [];
          click.forEach((item: any) => {
            let obj: any = { sets: [], size: item.size }
            item.sets.forEach((element: any) => {
              switch (element) {
                case 'IP':
                  obj.sets.push("IP异常")
                  break;
                case 'DEVICE':
                  obj.sets.push("设备异常")
                  break;
                case 'OVERCLOCK':
                  obj.sets.push("点击频繁")
                  break;
              }
            })
            chartVennClick.push(obj);
          })
          this.chartVennClickConfig = chartVennClick;
        }
      })
      // lineChart
      this.indicatorsSourceService.queryMetricData(parmasline).then((data: any) => {
        if (data && data.result.length > 0) {
          const list = data.result;
          this.lineTableContent = list;
          // 数据返回按时间排序
          const sort = list.sort((x: any, y: any) => {
            const a = Number(x.day.split('-').join(''));
            const b = Number(y.day.split('-').join(''));
            return a - b;
          });
          let linexAxis:any =[],
              clickDeviceData:any = [],
              ImpressionDeviceData:any = [],
              clickIpData:any = [],
              impressionIpData:any = [],
              clickOverclockData:any = [],
              impressionOverclockData:any = [],
              impressionInvisiableData:any = [];
          sort.forEach((item: any) => {
            linexAxis.push(item.day);
            clickDeviceData.push(item.click_anti_device);
            ImpressionDeviceData.push(item.impression_anti_device);
            clickIpData.push(item.click_anti_ip);
            impressionIpData.push(item.impression_anti_ip);
            clickOverclockData.push(item.click_overclock);
            impressionOverclockData.push(item.impression_overclock);
            impressionInvisiableData.push(item.impression_anti_invisible);
          });
          // 线图series
          const impression = [
            {
              name: 'IP异常',
              data: impressionIpData,
            },
            {
              name: '设备异常',
              data: ImpressionDeviceData,
            },
            {
              name: '曝光碰撞',
              data: impressionOverclockData,
            },
            {
              name: '不可见曝光',
              data: impressionInvisiableData,
            },
          ];
          const click = [
            {
              name: 'IP异常',
              data: clickIpData,
            },
            {
              name: '设备异常',
              data: clickDeviceData,
            },
            {
              name: '点击频繁',
              data: clickOverclockData,
            },
          ];
          this.chartLineConfig = this.initLineChart('impression', linexAxis, impression);
          this.chartLineClickConfig = this.initLineChart('click', linexAxis, click);
        }
      })
    })
  }

  ngOnInit() {
  };

  ngOnDestroy() {
    this._store.unsubscribe();
  }

  initChartData(xData: any, sData: any) {
    return {
      tooltip: {
        show: false,
      },
      xAxis: {
        data: xData,
      },
      series: {
        data: sData,
      },
    };
  }
// 线图数据
  initLineChart(key: string, data: any, series:any) {
    const legend = key === 'click' ?
      ['IP异常', '设备异常', '点击频繁'] : ['IP异常', '设备异常', '曝光碰撞', '不可见曝光'];
    return {
      legend: {
        data: legend,
      },
      xAxis: {
        data,
      },
      /* tooltip: {
        formatter(value1: any) {
          let data = `${value1[0].name}`;
          value1.forEach((item: any) => {
            data += `<br />${item.marker}${item.seriesName}:${item.value}`;
          });
          return data;
        },
      }, */
      yAxis: [
        {
          type: 'value',
        },
        {
          type: 'value',
          position: 'right',
          min: 0,
          max: 100,
          splitLine: {
            show: false,
          },
        },
      ],
      series,
    }
  }
}
