import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../ngrx/reducer';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { DecimalPipe, PercentPipe } from '@angular/common';

// import Services
import { EffectSourceService } from './../../services/source/effect.source.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-effect-container',
  templateUrl: './effect-container.component.html',
  styleUrls: ['./effect-container.component.less'],
  providers: [EffectSourceService, DecimalPipe, PercentPipe],
})
export class EffectContainerComponent implements OnInit {
  subscription: Subscription;
  globalData: any = {}; // 全局信息

  // app流量
  naturalFlow: any;       // 自然流量
  parsedNaturalFlow: any; // 整理后的自然流量     会传到effect-template里
  activeFlow: any;        // 活跃量
  parseActiveFlow: any;   // 整理后的活跃量       会传到effect-template里
  
  appFlowList: any;       // app流量列表
  parsedAppFlowList: any = []; // 整理后的appflowList
  parsedAppFlowData: any = []; // 整理后的数据    用于effect-template里指标和图标的显示
  appFlowListApp: any;    // 当前用户可以监控的app
  currAppFlow: any;       // 当前选择的app

  // 新建app
  appOrigin: string = 'Ad Tracking';
  appId: any = '';
  selectedApp: any = null;

  constructor(
    private effectSourceService: EffectSourceService,
    private store$: Store<State>,
    private nzModalService: NzModalService,
    private nzMessageService: NzMessageService,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe
  ) { }

  ngOnInit() {
    // 查询当前用户可以监控的app
    this.getAppFlowListApp();
    this.subscription = this.store$.select('global').debounceTime(1000)
    .distinctUntilChanged((p: any, q: any) => {
      if (p.activityKey === q.activityKey && p.startTime == q.startTime && p.endTime === q.endTime) {
        return true;
      }
      return false;
    })
    .subscribe((data: any) => {
      this.globalData = data;
      let { activityKey } = data;
      this.getAppFlowList(activityKey).subscribe((flowList: any) => {
        this.appFlowList = flowList;
        this.reduceAppFlowList(flowList);
        if (flowList.length > 1) {
          this.refreshAppFlowData(flowList[0].id);
        }
      });
    });
  }


  /**
   * 获取App流量列表
   * @param activityKey 当前选择活动的key
   */
  getAppFlowList(activityKey: any) {
    return Observable.create((observer: any) => {
      this.effectSourceService.getAppFlowList(activityKey).then((data: any) => {
        if (data.code == 200 && data.result) {
          observer.next(data.result);
        }
      });
    });
  }

  /**
   * 查询当前用户可以监控的app
   */
  getAppFlowListApp() {
    this.effectSourceService.getAppFlowListApp().then((data: any) => {
      if (data.code == 200 && data.result) {
        this.appFlowListApp = [{
          label: "AdTrackingIMP",
          value: {
            "appkey": "1ea00f914f4649d1bf3a4ab237a88b65",
            "appimg": null,
            "platform": 2,
            "productname": "AdTrackingIMP"
          }
        }, {
          label: "AppStoreSearchAdsTest",
          value: {
            "appkey": "EF489A83C50C449B883134E8DBFB7AF9",
            "appimg": null,
            "platform": 2,
            "productname": "AppStoreSearchAdsTest"
          }
        }];
      }
    });
  }

  /**
   * 查询app激活量和活跃量
   * @param params 
   */
  queryAppData(params: any) {
    let mockData = [
      {
          "sumCount": 1,
          "dayData": [
              {
                  "date": "2018-02-28",
                  "count": 1
              },
              {
                  "date": "2018-03-01",
                  "count": 0
              }
          ]
      },
      {
          "sumCount": 99,
          "dayData": [
              {
                  "date": "2018-04-01",
                  "count": 38
              },
              {
                  "date": "2018-03-31",
                  "count": 40
              },
              {
                  "date": "2018-03-30",
                  "count": 21
              }
          ]
      },
      {
          "sumCount": 0,
          "dayData": [
              {
                  "date": "2017-03-31",
                  "count": 0
              },
              {
                  "date": "2017-04-01",
                  "count": 0
              },
              {
                  "date": "2017-03-30",
                  "count": 0
              }
          ]
      }
    ];

    let { type } = params;
    return new Promise((resolve: any, reject: any) => {
      this.effectSourceService.queryAppData(params).then((data: any) => {
        resolve(this.sortAppFlowData(mockData))
      })
    });
  }

  /**
   * 处理APP流量的数据，处理成指标和图表的数据
   * @param naturalFlow 自然流量
   * @param activeFlow 活动流量
   */
  reduceAppFlowData(naturalFlow: any, activeFlow: any) {
    let that = this;
    this.parsedAppFlowData = [];
    if (Object.prototype.toString.call(naturalFlow) !== '[object Array]' || Object.prototype.toString.call(activeFlow) !== '[object Array]') {
      return;
    } else {
      if (!naturalFlow[0] || !naturalFlow[1] || !naturalFlow[2]) {
        return;
      }
      if (!activeFlow[0] || !activeFlow[1] || !activeFlow[2]) {
        return;
      }
    }
    // 激活量
    let total = (flow: any) => flow[0].sumCount + flow[1].sumCount + flow[2].sumCount;
    // 同比
    let growth = (flow: any) => (naturalFlow[1].sumCount - naturalFlow[0].sumCount) / naturalFlow[1].sumCount;
    // 对比年度均值
    let yearPercent = (flow: any) => (naturalFlow[1].sumCount - naturalFlow[2].sumCount) / naturalFlow[1].sumCount;
    // 图表配置
    let chartConfig = (flow: any, title: string) => {
      let xAxisData: any[] = [];
      let seriesData: any[] = [];
      flow[1].dayData.sort((a: any, b: any) => {
        if (new Date(a.date).getTime() > new Date(b.date).getTime()) {
          return 1;
        } else if (new Date(a.date).getTime() < new Date(b.date).getTime()) {
          return -1;
        } else if (new Date(a.date).getTime() == new Date(b.date).getTime()) {
          return 0
        }
      }).forEach((item: any) => {
        xAxisData.push(item.date);
        seriesData.push(item.count);
      });
      return { 
        grid: { right: '6%', containLabel: true },
        legend: { data: [title] }, 
        xAxis: { data: xAxisData }, 
        series: [ { name: title, data: seriesData, showSymbol: false } ]
      }
    };

    let trend = (flow: any, i: any, j: any) => flow[i].sumCount >= flow[j].sumCount ? 'up' : 'down';

    this.parsedAppFlowData.push({
      metrics: [
        { label: '自然激活量', value: that.decimalPipe.transform(total(naturalFlow)) },
        { label: '环比', value: that.percentPipe.transform(growth(naturalFlow)), trend: trend(naturalFlow, 1, 0) },
        { label: '对比年度均值', value: that.percentPipe.transform(yearPercent(naturalFlow)), trend: trend(naturalFlow, 1, 2) },
      ],
      chartConfig: [chartConfig(naturalFlow, '自然激活量')]
    });
    this.parsedAppFlowData.push({
      metrics: [
        { label: '活跃量', value: that.decimalPipe.transform(total(activeFlow)) },
        { label: '环比', value: that.percentPipe.transform(growth(activeFlow)), trend: trend(activeFlow, 1, 0) },
        { label: '对比年度均值', value: that.percentPipe.transform(yearPercent(activeFlow)), trend: trend(activeFlow, 1, 2) },
      ],
      chartConfig: [chartConfig(activeFlow, '活跃量')]
    });
  }


  /**
   * 新建app流量
   * @param params 
   */
  insertAppFlow(params: any) {
    this.effectSourceService.insertAppFlow(params).then((data: any) => {
      if (data.code == 200) {
        this.refreshAppFlowData();
      }
    });
  }

  /**
   * 刷新app流量数据
   * @param id 
   */
  refreshAppFlowData(id?: any) {
    if (id) {
      this.currAppFlow = this.appFlowList.find((item: any) => id === item.id);;
    }
    let { activityKey, startTime, endTime } = this.globalData;
    startTime = moment(startTime).format("YYYY-MM-DD");
    endTime = moment(endTime).format("YYYY-MM-DD");
    this.getAppFlowList(activityKey).subscribe(async (flowList: any) => {
      this.appFlowList = flowList;
      this.reduceAppFlowList(flowList);
      if (flowList.length > 1) {
        // 查询app活跃量
        this.activeFlow = await this.queryAppData({ appKey: this.currAppFlow.appKey, startTime, endTime, type: 10 });
        // 查询app自然流量
        this.naturalFlow = await this.queryAppData({ appKey: this.currAppFlow.appKey, startTime, endTime, type: 20 });

        // 处理APP流量的数据，处理成指标和图表的数据
        this.reduceAppFlowData(this.naturalFlow, this.activeFlow);
      }
    });
  }

  /**
   * 打开新建app的对话框
   * @param type app web
   */
  openCreateModel(type: string, contentTpl: any) {
    let that = this;
    if (type === 'app') {
      this.nzModalService.open({
        title: '添加APP',
        content: contentTpl,
        onOk() {
          if (!that.selectedApp && that.appOrigin === 'Ad Tracking') {
            that.nzMessageService.info('请选择APP！');
          }
          that.insertAppFlow({
            appKey: that.selectedApp.appkey,
            appImg: that.selectedApp.appimg ? that.selectedApp.appimg : '',
            appName: that.selectedApp.productname,
            activityKey: that.globalData.activityKey
          });
        }
      });
    }
  }

  /**
   * 处理APP流量列表
   * @param flowList 
   */
  reduceAppFlowList(flowList: any) {
    this.parsedAppFlowList = [];
    flowList.forEach((item: any) => {
      this.parsedAppFlowList.push({
        title: item.appName,
        cover: item.appImg,
        tag: item.id,
      });
    });
  }

  /**
   * 删除指定id的APP
   * @param id 
   */
  deleteAssignApp(id: any) {
    this.effectSourceService.deleteAppFlowById(id).then((data: any) => {
      if (data.code == 200) {
        this.refreshAppFlowData();
      }
    });
  }

  /**
   * 整理APP流量数据，第一个为上个月的，第二个为现在的，第三个为上一年的
   * @param flow 
   */
  sortAppFlowData(flow: any) {
    let lastMonth = flow[0], curr = flow[1], lastYear = flow[2]; // 上个月的，这个月的，去年的
    if (flow) {
      flow.forEach((item: any, index: any) => {
        if (item && Object.prototype.toString.call(item.dayData) === '[object Array]') {
          item.dayData.sort((a: any, b: any) => {
            if (new Date(a.date).getTime() > new Date(b.date).getTime()) {
              return 1;
            } else if (new Date(a.date).getTime() < new Date(b.date).getTime()) {
              return -1;
            } else if (new Date(a.date).getTime() == new Date(b.date).getTime()) {
              return 0
            }
          }).forEach((day: any) => {
            if (moment(day.date).year() === new Date().getFullYear()) {
              if (new Date(lastMonth.dayData[0].date).getTime() > new Date(day.date).getTime()) {
                curr = item;
              } else {
                lastMonth = item;
              }
            } else {
              lastYear = item;
            }
          });
        }
      });
    }
    return [lastMonth, curr, lastYear];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
