import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
import * as secondLevel from '../../../ngrx/action/secondLevel';
import * as moment from 'moment';
// utils
import Csv from '../../../utils/export-csv';
import { pipe } from 'rxjs/util/pipe';
import { FilterPercentPipe } from '../../../pipes/filter-percent.pipe';
import { FilterNumberPipe } from '../../../pipes/filter-number.pipe';
// services
import { IndicatorsSourceService } from '../../../services/source/indicators.source.service'


@Component({
  selector: 'protect-container',
  templateUrl: './protect-container.component.html',
  styleUrls: ['./protect-container.component.less'],
  providers: [
    IndicatorsSourceService,
    FilterPercentPipe,
    FilterNumberPipe,
  ]
})
export class ProtectContainerComponent implements OnInit {
  // tab切换table数据
  // line
  private lineTableContent: any = [];
  private lineTableHeader_improssion: any = [
    {
      key: 'day',
      title: '时间',
    },
    {
      key: 'improssion',
      title: '异常曝光率',
    },
    {
      key: 'impression_anti',
      title: '异常曝光',
    },
    {
      key: 'impression_pv',
      title: '曝光'
    }
  ];
  private lineTableHeader_click: any = [
    {
      key: 'day',
      title: '时间',
    },
    {
      key: 'click',
      title: '异常点击率',
    },
    {
      key: 'click_anti',
      title: '异常点击',
    },
    {
      key: 'click_pv',
      title: '点击'
    }
  ];
  // bar
  private barTableContent: any = [];
  private barTableHeader_impression: any = [
    {
      key: 'channelName',
      title: '媒体',
    },
    {
      key: 'impression_anti',
      title: '异常曝光',
    },

    {
      key: 'impression_normal',
      title: '正常曝光'
    }
  ];
  private barTableHeader_click: any = [
    {
      key: 'channelName',
      title: '媒体',
    },
    {
      key: 'click_anti',
      title: '异常曝光',
    },
    {
      key: 'click_normal',
      title: '正常曝光'
    }
  ];
  // talbe
  private tableLeft: any = [];
  private total: any = {};
  private tableContent: any = [];
  // chart数据
  private chartBarConfig_impression: any
  private chartBarConfig_click: any
  private chartLineClickConfig: any;
  private chartLineImpressionConfig: any = null;
  private chartVennClickConfig: any = null;
  private chartVennImpressionConfig: any = null;

  // 全局时间
  private _store: any;
  private _startTime: any;
  private _endTime: any;
  private _activityName: any;
  private _Time: any;
  private _activityKey: any;
  //线图数据拼接
  private metricData: any = {
    impression_pv: 0,
    impression_anti: 0,
    click_pv: 0,
    click_anti: 0
  };

  private lineLegend: any = [];
  private lineImpressionSeriesData1: any = [];
  private lineImpressionSeriesData2: any = [];
  private lineImpressionSeriesData3: any = [];
  private lineClickSeriesData1: any = [];
  private lineClickSeriesData2: any = [];
  private lineClickSeriesData3: any = [];
  // 柱图
  private channlName: any = [];
  barClick: any = [];
  barClickAnti: any = [];
  barImpression: any = [];
  barImpressionAnti: any = [];
  // sortData
  private sortMap: any = {
    totalImpression_anti: null,
    totalImpression_anti_ip: null,
    totalImpression_anti_device: null,
    totalClick_anti: null,
    totalClick_anti_ip: null,
    totalClick_anti_device: null
  };
  private sortName: any = null;
  private sortValue: any = null;
  private copyData = [...this.tableLeft];
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private indicatorsSourceService: IndicatorsSourceService,
    private store$: Store<reducer.State>,
    private filterPercentPipe: FilterPercentPipe,
    private filterNumberPipe: FilterNumberPipe,
  ) {
    this.cdr = cdr;
    // 获取全局时间监测全局时间改变
    this._store = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe(result => {
      this._startTime = result.startTime;
      this._endTime = result.endTime;
      this._activityName = result.activityName;
      this._activityKey = result.activityKey ? result.activityKey : JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION')).value;
      this._Time = `${moment(this._startTime).format('YYYY-MM-DD')} ~ ${moment(this._endTime).format('YYYY-MM-DD')}`
      let parmas: any, parmasline: any, parmasVenn: any, parmasBar: any, parmasTab: any;
      // parmas拼接
      parmas = {
        metrics: ['impression_anti', 'click_pv', 'impression_pv', 'click_anti'],
        dimension: "activity",
        conditions: {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        detail: true
      }

      parmasline = {
        metrics: ['impression_anti', 'click_pv', 'impression_pv', 'click_anti'],
        dimension: "day",
        orderBy: 'day',
        desc: 'false',
        conditions: {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        detail: true
      }

      parmasVenn = {
        metrics: [
          'click_anti_source',
          'impression_anti_source',
        ],
        dimension: "media",
        conditions: {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        detail: true
      }

      parmasBar = {
        metrics: ['impression_anti', 'click_anti', 'click_pv', 'impression_pv'],
        dimension: "media",
        conditions: {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        detail: true
      }

      parmasTab = {
        metrics: [
          'impression_anti',
          'click_anti',
          'impression_pv',
          'click_pv',
          'impression_anti_ip',
          'click_anti_ip',
          'impression_anti_device',
          'click_anti_device'],
        dimension: "monitor",
        conditions: {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        detail: true
      }
      // titleData
      this.indicatorsSourceService.queryMetricData(parmas).then((data: any) => {
        if (data && data.result.length > 0) {
          this.metricData = data.result[0];
        }
      })
      // 线图
      this.indicatorsSourceService.queryMetricData(parmasline).then((data: any) => {
        if (data && data.result.length > 0) {
          this.lineLegend = [];
          this.lineImpressionSeriesData1 = [];
          this.lineImpressionSeriesData2 = [];
          this.lineImpressionSeriesData3 = [];
          this.lineClickSeriesData1 = [];
          this.lineClickSeriesData2 = [];
          this.lineClickSeriesData3 = [];

          const list = data.result.map((item: any) => {
            this.lineLegend.push(item.day);
            this.lineImpressionSeriesData1.push(filterNumberPipe.transform((item.impression_anti / item.impression_pv) * 100));
            // this.lineImpressionSeriesData1.push(filterPercentPipe.transform(item.impression_anti / item.impression_pv));
            this.lineImpressionSeriesData2.push(item.impression_pv);
            this.lineImpressionSeriesData3.push(item.impression_anti);
            this.lineClickSeriesData1.push(filterNumberPipe.transform((item.click_anti / item.click_pv) * 100));
            // this.lineClickSeriesData1.push(filterPercentPipe.transform(item.click_anti / item.click_pv));
            this.lineClickSeriesData2.push(item.click_pv);
            this.lineClickSeriesData3.push(item.click_anti);
            item.improssion = filterPercentPipe.transform(item.impression_anti / item.impression_pv);
            item.click = filterPercentPipe.transform(item.click_anti / item.click_pv);
            return item;
          });
          this.setChartConfig();
          this.lineTableContent = data.result;
        }
      })
      // 韦恩
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
      // 柱图 

      this.indicatorsSourceService.queryMetricData(parmasBar).then((data: any) => {
        if (data.code === 200 && data.result.length > 0) {

          let barClick: any = [],
            barClickAnti: any = [],
            barImpression: any = [],
            barImpressionAnti: any = [],
            channlName: any = [],
            barData: any = data.result;
          let list = barData.sort((a: any, b: any) => (b.click_pv - a.click_pv));
          list.forEach((item: any) => {
            if (barClickAnti.length >= 5) {
              return;
            } else {
              channlName.push(item.channelName);
              // 点击异常
              barClick.push(Math.abs(Number(item.click_pv) - Number(item.click_anti)));
              barClickAnti.push(item.click_anti);
              item.click_normal = Math.abs(Number(item.click_pv) - Number(item.click_anti));
            }
          });
          let impList = barData.sort((a: any, b: any) => (b.impression_pv - a.impression_pv));
          impList.forEach((item: any) => {
            // 曝光异常
            if (barImpressionAnti.length >= 5) {
              return;
            } else {
              barImpression.push(Math.abs(Number(item.impression_pv) - Number(item.impression_anti)))
              barImpressionAnti.push(item.impression_anti);
              item.impression_normal = Math.abs(Number(item.impression_pv) - Number(item.impression_anti));
            }
          });

          this.channlName = channlName;
          this.barTableContent = data.result;
          this.barClick = barClick;
          this.barClickAnti = barClickAnti;
          this.barImpression = barImpression;
          this.barImpressionAnti = barImpressionAnti;

          this.chartBarConfig_click = this.setChartBar(barClick, barClickAnti, 'click');
          this.chartBarConfig_impression = this.setChartBar(barImpression, barImpressionAnti, 'impression')
        }
      })
      // table
      this.indicatorsSourceService.queryMetricData(parmasTab).then((data: any) => {
        if (data.code === 200 && data.result.length > 0) {
          this.setChannelData(data.result)
        }
      })
    })

    this.setChartConfig();
  }

  //  跳详情页
  details(data: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: data.monitorName,
    })

    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: data.channelId
    })

    this.router.navigate(['/activity/protect/protect-detail', data.monitorName, data.channelId])
  }
  // 排序
  sort(sortName: any, value?: any) {
    let flag = value ? value : this.sortMap[sortName];
    if (!value && value !== null) {
      if (flag === null || flag === 'ascend') {
        flag = 'descend';
      } else if (flag === 'descend') {
        flag = 'ascend';
      }
    }
    this.sortName = sortName;
    this.sortValue = flag;
    Object.keys(this.sortMap).forEach((key: any) => {
      /* if (key !== sortName) {
        this.sortMap[key] = null;
      } else {
        this.sortMap[key] = flag;
      } */
      this.sortMap[key] = key !== sortName ? null : flag;
    });
    this.sortData()
  }
  sortData() {
    this.tableLeft = [...this.tableLeft.sort((a: any, b: any) => {
      if (a[this.sortName] > b[this.sortName]) {
        return (this.sortValue === 'ascend') ? 1 : -1;
      } else if (a[this.sortName] < b[this.sortName]) {
        return (this.sortValue === 'ascend') ? -1 : 1;
      } else {
        return 0;
      }
    })];
  }

  //  解决dev环境报错
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null
    })

    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: null
    })

    this._store.unsubscribe();
  }
  // 线图数据
  setChartConfig() {
    this.chartLineImpressionConfig = {
      /* grid: {
        left: 24,
      }, */
      legend: {
        data: ['异常曝光率', '曝光', '异常曝光'],
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
      xAxis: {
        data: this.lineLegend,
        boundaryGap: true,
      },
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
      series: [{
        name: '异常曝光率',
        type: 'bar',
        yAxisIndex: 1,
        data: this.lineImpressionSeriesData1
      }, {
        name: "曝光",
        type: 'line',
        data: this.lineImpressionSeriesData2
      }, {
        name: "异常曝光",
        type: 'line',
        data: this.lineImpressionSeriesData3
      }]
    };
    this.chartLineClickConfig = {
      legend: {
        data: ['异常点击率', '点击', '异常点击'],
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
      xAxis: {
        data: this.lineLegend,
        boundaryGap: true,
      },
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
      series: [{
        name: '异常点击率',
        type: 'bar',
        yAxisIndex: 1,
        data: this.lineClickSeriesData1
      }, {
        name: "点击",
        type: 'line',
        data: this.lineClickSeriesData2
      }, {
        name: "异常点击",
        type: 'line',
        data: this.lineClickSeriesData3
      }]
    };
  }
  // 柱图数据
  setChartBar(normal: any, anti: any, flag: any) {
    const legend = flag === 'click' ? ['正常点击', '异常点击'] : ['正常曝光', '异常曝光'];
    let data = {
      legend: {
        data: legend,
      },
      color: ['#2D8CF0', '#FCC45F'],
      xAxis: [{
        type: 'value',
        scale: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E9EAEC'
          }
        },
        lineStyle: {
          color: '#E9EAEC'
        },
      }, {
        type: 'value',
        scale: false,
        min: 0,
        max: 100,
        show: false,
      }],
      yAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            width: 100,
          }
        },
        splitLine: {
          show: false,
        },
        data: this.channlName,
      },
      series: [
        {
          type: 'bar',
          xAxisIndex: 1,
          itemStyle: {
            color: ' #F8F8F9',
            borderColor: '#E9EAEC'
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: [100, 100, 100, 100, 100],
          animation: false,
          barWidth: 20,
          tooltip: {
            show: false,
          },
        },
        {
          name: legend[0],
          type: 'bar',
          stack: '总量',
          barWidth: 20,
          data: normal
        },
        {
          name: legend[1],
          type: 'bar',
          stack: '总量',
          barWidth: 20,
          data: anti
        },
      ]
    };
    return data;

  }
  // 异常曝光下载
  downLoadLineImpression() {
    const fileName = `${this._activityName}_作弊防护_异常曝光走势_${this._Time}.csv`;
    let data = "时间,异常曝光率,曝光,异常曝光";
    for (let i = 0; i < this.lineLegend.length; i++) {
      data += `\r\n${this.lineLegend[i]},${this.lineImpressionSeriesData1[i]},${this.lineImpressionSeriesData2[i]},${this.lineImpressionSeriesData3[i]}`;
    }
    Csv.download(fileName, data);
  }
  // 异常点击下载
  downLoadLineClick() {
    const fileName = `${this._activityName}_作弊防护_异常点击走势_${this._Time}.csv`;
    let data = "时间,异常点击率,点击,异常点击";
    for (let i = 0; i < this.lineLegend.length; i++) {
      data += `\r\n${this.lineLegend[i]},${this.lineClickSeriesData1[i]},${this.lineClickSeriesData2[i]},${this.lineClickSeriesData3[i]}`;
    }
    Csv.download(fileName, data);
  }
  // 异常曝光/点击来源分析下载
  downLoadVenn(key: string) {
    const name = key === 'chartVennImpressionConfig' ? '曝光' : '点击';
    const fileName = `${this._activityName}_作弊防护_异常${name}来源分析_${this._Time}.csv`;
    let data = '';
    const list = this[key].sort((x: any, y: any) => (x.sets.length - y.sets.length));
    list.forEach((item: any) => {
      data += `${item.sets.join('∩')},${item.size}\r\n`;
    })
    Csv.download(fileName, data);
  }

  // 曝光top分析
  downLoadBarImpression() {
    const fileName = `${this._activityName}_作弊防护_异常曝光Top分析_${this._Time}.csv`;
    let data = "名称,正常曝光,异常曝光";
    for (let i = 0; i < this.channlName.length; i++) {
      data += `\r\n${this.channlName[i]},${this.barImpression[i]},${this.barImpressionAnti[i]}`;
    }
    Csv.download(fileName, data);
  }

  // 点击top分析
  downLoadBarClick() {
    const fileName = `${this._activityName}_作弊防护_异常点击Top分析_${this._Time}.csv`;
    let data = "名称,正常点击,异常点击";
    for (let i = 0; i < this.channlName.length; i++) {
      data += `\r\n${this.channlName[i]},${this.barClick[i]},${this.barClickAnti[i]}`;
    }
    Csv.download(fileName, data);
  }

  downLoadTable() {
    const fileName = `${this._activityName}_作弊防护_异常数据详情_${this._Time}.csv`;
    let data = "监测链接,媒体,异常曝光-防护总览,异常曝光-IP总览,异常曝光-设备防护,异常点击-防护总览,异常点击-IP总览,异常点击-设备防护";
    this.tableLeft.forEach((item: any) => {
      item.activityList.forEach((linkItem: any) => {
        data += `\r\n${linkItem.monitorName},${item.channelName},${linkItem.impression_anti},${linkItem.impression_anti_ip},${linkItem.impression_anti_device},${linkItem.click_anti},${linkItem.click_anti_ip},${linkItem.click_anti_device}`;
      });
    })
    data += `\r\n"","总计",${this.total.allTotalImpression_anti},${this.total.allTotalImpression_anti_ip},${this.total.allTotalImpression_anti_device},${this.total.allTotalClick_anti},${this.total.allTotalClick_anti_ip},${this.total.allTotalClick_anti_device}`;
    Csv.download(fileName, data);
  }

  /**
   *  整合分媒体数据
   */
  setChannelData(value: any) {
    const self = this;
    const data = value;
    const channelInfo = {};
    const idList: any = [];
    data.forEach((x: any) => {
      if (idList.indexOf(x.channelId) === -1) {
        idList.push(x.channelId);
        const key = `channel_${x.channelId}`;
        channelInfo[key] = {
          channelName: x.channelName,
          channelId: x.channelId,
          activityList: [x],
        };
      } else {
        const key = `channel_${x.channelId}`;
        channelInfo[key].activityList.push(x);
      }

    });

    const result = Object.keys(channelInfo).map(key => channelInfo[key]);
    self.tableLeft = result;
    this.setTotalData(result)
  }
  // 单个媒体总计
  setTotalData(val: any) {
    for (let key in val) {
      let totalClick_pv: number = 0,
        totalImpression_pv: number = 0,
        totalImpression_anti: number = 0,
        totalImpression_anti_device: number = 0,
        totalImpression_anti_ip: number = 0,
        totalClick_anti: number = 0,
        totalClick_anti_device: number = 0,
        totalClick_anti_ip: number = 0;
      val[key].activityList.forEach((data: any) => {
        totalClick_pv += data.click_pv;
        totalImpression_pv += data.impression_pv;
        totalImpression_anti += data.impression_anti;
        totalImpression_anti_device += data.impression_anti_device;
        totalImpression_anti_ip += data.impression_anti_ip;
        totalClick_anti += data.click_anti;
        totalClick_anti_device += data.click_anti_device;
        totalClick_anti_ip += data.click_anti_ip;
      })
      val[key].totalClick_pv = totalClick_pv;
      val[key].totalImpression_pv = totalImpression_pv;
      val[key].totalImpression_anti = totalImpression_anti;
      val[key].totalImpression_anti_device = totalImpression_anti_device;
      val[key].totalImpression_anti_ip = totalImpression_anti_ip;
      val[key].totalClick_anti = totalClick_anti;
      val[key].totalClick_anti_device = totalClick_anti_device;
      val[key].totalClick_anti_ip = totalClick_anti_ip;
    }

    this.setallTotal(val)
  }
  // 总计
  setallTotal(value: any) {
    let allTotalClick_anti: number = 0,
      allTotalClick_anti_ip: number = 0,
      allTotalClick_anti_device: number = 0,
      allTotalImpression_anti: number = 0,
      allTotalImpression_anti_ip: number = 0,
      allTotalImpression_anti_device: number = 0;

    value.forEach((item: any, i: any) => {
      this.total = {
        allTotalClick_anti: allTotalClick_anti += item.totalClick_anti,
        allTotalClick_anti_ip: allTotalClick_anti_ip += item.totalClick_anti_ip,
        allTotalClick_anti_device: allTotalClick_anti_device += item.totalClick_anti_device,
        allTotalImpression_anti: allTotalImpression_anti += item.totalImpression_anti,
        allTotalImpression_anti_ip: allTotalImpression_anti_ip += item.totalImpression_anti_ip,
        allTotalImpression_anti_device: allTotalImpression_anti_device += item.totalImpression_anti_device
      }
    })
  }

  NumAscSort(pro: any) {
    return (a: any, b: any) => {
      var val1 = a[pro], val2 = b[pro]
      return val1 - val2;
    }
  }




}
