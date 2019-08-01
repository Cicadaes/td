import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import * as reducer from './../../../../ngrx/reducer';
import * as globel from './../../../../ngrx/action/global';
import * as guard from './../../../../ngrx/action/guard';
import * as secondLevel from './../../../../ngrx/action/secondLevel';

// import Service
import { IndicatorsSourceService } from '../../../../services/source/indicators.source.service';
import { MonitorSourceService } from '../../../../services/source/monitor.source.service';

// import Pipes
import { FilterNumberPipe } from '../../../../pipes/filter-number.pipe';

@Component({
  selector: 'frequency-container',
  templateUrl: './frequency-container.component.html',
  styleUrls: ['./frequency-container.component.less'],
  providers: [IndicatorsSourceService, MonitorSourceService, FilterNumberPipe]
})
export class FrequencyContainerComponent implements OnInit {

  // global 数据
  private _startTime: any; // 开始时间
  private _endTime: any; // 结束时间
  private _activityKey: any; // 活动key
  private _activityName: any; // 活动名
  private _isTotal: boolean = true;
  subscription: any = null;

  // 曝光频次相关数据
  private _monitordata: any; // 监测链接
  private _monitorId: any; // 监测Id
  private _adType: any; // 广告格式
  private _channelId: any; // 渠道Id
  private _frequencyData: any = { // 曝光总览
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  };
  private _distributedFrequencyData: any = null;
  private _distributedFrequencyTableData: any = null; // 曝光频次分布表格数据
  private _distributedChannelData: any = null;
  private _channelTableData: any = null; // 渠道曝光频次分布表格数据
  private _channelData: any = null;
  private _totalEquipmentNum = 0; // 总设备数（曝光一次的设备数)
  private _totalImpressionPv = 0; // 监测链接曝光总和
  private _totalImpressionOverclock = 0; // 监测链接超频曝光总和
  private _allMonitorImpressionOverclock = 0; // 总超频曝光

  // 基础查询信息
  private _dimension: any; // 查询维度
  private _metrics: any; // 指标集合
  private _conditions: any = { // 条件
    "activityKey": this._activityKey,
    "monitorLinkId": this._monitorId,
    "adType": this._adType,
    "start": moment(this._startTime).format('YYYY-MM-DD'),
    "end": moment(this._endTime).format('YYYY-MM-DD')
  };
  private _baseQueryData: any = {
    "metrics": this._metrics,
    "dimension": this._dimension,
    "conditions": this._conditions,
    "detail": true
  }

  /**
   * 获取当前监测链接相关信息
   * @param key 活动key 从global中取到
   * @param linkId 监测链接id 从url取到
   * @returns Observable<any> 返回数据
   */
  getMonitorDataBy(key: any, linkId: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.monitorSourceService.getMonitorLinkById(key, linkId).then((data: any) => {
        if (data && data.code == 200) {
          observer.next(data.result);
        }
      })
    })
  }

  // 整理渠道超频曝光占比
  parseDistributedMediaData(data: any) {
    const count = data.map((item: any) => {
      return {
        name: item.channelName,
        value: item.impression_overclock,
      };
    });
    const sort = count.sort((x: any, y: any) => (y.value - x.value));
    const number = sort.reduce((x: number, y: any) => (x + y.value), 0); // 总超频曝光
    const list = sort.map((item: any) => {
      // 渠道的超频曝光 / 总曝光
      // const value = this.filterNumberPipe.transform(item.value / this._totalImpressionPv * 100);
      // 渠道的超频曝光 / 总超频曝光
      const value = this.filterNumberPipe.transform(item.value / number * 100);
      return {
        name: item.name,
        value: value === 'N/A' ? 0 : value,
      };
    });
    return list;
  }

  // 获取频次信息
  getFrequencyData(): Observable<any> {
    this._dimension = "monitor";
    this._metrics = ["impression_frequency", "impression_pv", "impression_overclock"];
    this._conditions = { // 条件
      "activityKey": this._activityKey,
      "adType": this._adType,
      "start": moment(this._startTime).format('YYYY-MM-DD'),
      "end": moment(this._endTime).format('YYYY-MM-DD')
    };

    if (!this._isTotal) {
      this._conditions.monitorLinkId = this._monitorId;
    } else {
      this._conditions.channelId = this._channelId;
    }

    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true
    }

    return this.queryMetricData(this._baseQueryData);
  }

  // 获取曝光信息
  getMonitorData(total: boolean): Observable<any> {
    this._dimension = "monitor";
    this._metrics = ["impression_pv", "impression_overclock"];
    if(total) {
      this._baseQueryData = {
        "metrics": this._metrics,
        "dimension": this._dimension,
        "conditions": {
          activityKey: this._activityKey,
          start: moment(this._startTime).format('YYYY-MM-DD'),
          end: moment(this._endTime).format('YYYY-MM-DD')
        },
        "detail": true
      }
    } else {
      this._baseQueryData = {
        "metrics": this._metrics,
        "dimension": this._dimension,
        "conditions": this._conditions,
        "detail": true
      }
    }

    return this.queryMetricData(this._baseQueryData);
  }

  parseMonitorData(data: any) {
    this._totalImpressionPv = data.reduce((original: any, entra: any) => original + entra.impression_pv, 0);
    this._totalImpressionOverclock = data.reduce((original: any, entra: any) => original + entra.impression_overclock, 0);
  }

  parseTotalMonitorData(data: any) {
    this._allMonitorImpressionOverclock = data.reduce((original: any, entra: any) => original + entra.impression_overclock, 0)
  }

  /**
   * 整理曝光频次分布信息
   * @param data [接口返回的数据]
   * @param name [接口数据名称的key]
   */
  parseDistributedFrequencyData(data: any, name?: string) {
    let legendData: any = [];
    let xAxisData: any = [];
    let seriesData: any = [];

    data.forEach((item: any, index: any) => {
      let aName = name ? item[name] : '曝光频次';
      let obj: any = {
        name: aName,
        data: []
      };
      if (item.impression_frequency && Object.keys(item.impression_frequency)) {
        xAxisData = [];
        legendData.push(aName);
        Object.keys(item.impression_frequency).forEach((key: any) => {
          if (xAxisData.indexOf(key) === -1) {
            xAxisData.push(key);
          }
          obj.data.push(item.impression_frequency[key])
        })
      }
      seriesData.push(obj);
    });

    // 总计情况下，曝光频次分布图展示的数据为所有监测链接的总和
    if (name && name === 'monitorName' && seriesData.length > 1) {
      let  a = [0, 0, 0, 0, 0, 0, 0];
      const list = seriesData.reduce((x: any, y: any) => {
        x[0] += (Number(y.data[0]) || 0);
        x[1] += (Number(y.data[1]) || 0);
        x[2] += (Number(y.data[2]) || 0);
        x[3] += (Number(y.data[3]) || 0);
        x[4] += (Number(y.data[4]) || 0);
        x[5] += (Number(y.data[5]) || 0);
        x[6] += (Number(y.data[6]) || 0);
        return x;
      }, a);
      legendData = ['曝光频次'];
      seriesData = {
        name: '曝光频次',
        data: list,
      };
    }
    return {
      legend: {
        data: legendData
      },
      xAxis: {
        data: xAxisData
      },
      series: seriesData
    };
  }

  // 整理曝光频次分布表格数据
  parseDistributedFrequencyTableData(data: any, name?: string) {
    let column = [
      {
        key: 'name',
        title: '频次',
      },
    ];
    let content: any[] = [];
    data.forEach((item: any, index: any) => {
      let aName = name ? item[name] : '曝光频次';
      column.push({
        key: `frequency_${index}`,
        title: aName,
      });
      Object.keys(item.impression_frequency).forEach((key: any, i: number) => {
        if (!content[i]) {
          const obj = {
            name: key,
            [`frequency_${index}`]: item.impression_frequency[key],
          };
          content.push(obj);
        } else {
          content[i][`frequency_${index}`] = item.impression_frequency[key];
        }
      })
    });
    if (name === 'monitorName' && column.length > 2) {
      column = [
        {
          key: 'name',
          title: '频次',
        },
        {
          key: 'impression_frequency',
          title: '曝光频次',
        },
      ];
      const list = content.map((item: any, index: number) => {
        let value = 0;
        Object.keys(item).forEach((x: any) => {
          if (x !== 'name') {
            value += item[x];
          }
        });
        return {
          name: item.name,
          impression_frequency: value,
        };
      });
      content = list;
    }
    return {
      column,
      content,
    }
  }

  // 整理曝光频次总览信息
  parseFrequencyData(data: any) {
    this._frequencyData = data.reduce((prev: any, curr: any) => {
      prev[1] += (Number(curr.impression_frequency[1]) || 0);
      prev[2] += (Number(curr.impression_frequency[2]) || 0);
      prev[3] += (Number(curr.impression_frequency[3]) || 0);
      prev[4] += (Number(curr.impression_frequency[4]) || 0);
      prev[5] += (Number(curr.impression_frequency[5]) || 0);
      prev[6] += (Number(curr.impression_frequency[6]) || 0);
      prev[7] += (Number(curr.impression_frequency[7]) || 0);
      return prev
    }, this._frequencyData);

    this._totalEquipmentNum = this._frequencyData[1];

    let obj = {
      1: (this._frequencyData[1] / this._frequencyData[1]).toFixed(2),
      2: (this._frequencyData[2] / this._frequencyData[1]).toFixed(2),
      3: (this._frequencyData[3] / this._frequencyData[1]).toFixed(2),
      4: (this._frequencyData[4] / this._frequencyData[1]).toFixed(2),
      5: (this._frequencyData[5] / this._frequencyData[1]).toFixed(2),
      6: (this._frequencyData[6] / this._frequencyData[1]).toFixed(2),
      7: (this._frequencyData[7] / this._frequencyData[1]).toFixed(2),
    }

    return obj
  }

  /**
   * 获取渠道相关信息
   * @param metrics [查询的指标]
   * @param dimension [查询的维度]
   */
  getChannelData(metrics: string, dimension: string): Observable<any> {
    this._dimension = dimension;
    this._metrics = [metrics];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true,
    };
    return this.queryMetricData(this._baseQueryData);
  }

  // 指标查询
  queryMetricData(params: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.indicatorsSourceService.queryMetricData(params).then((data: any) => {
        if (data && data.code === 200) {
          observer.next(data.result);
        }
      });
    })
  }

  // 如果没有传监测链接Id，就认为是总计
  getAllPageData() {
    if (this._isTotal) {
      this.parseAllPageData();
    } else {
      this.getMonitorDataBy(this._activityKey, this._monitorId).subscribe((data: any) => {
        this._monitordata = data;
        this._monitorId = data.id;
        this._adType = data.adType;
        this._channelId = data.channelId;

        this.parseAllPageData();
      })
    }
  }

  parseAllPageData() {
    this.getFrequencyData().subscribe((data: any) => {
      this._frequencyData = this.parseFrequencyData(data);
      this._distributedFrequencyData = this.parseDistributedFrequencyData(data, 'monitorName');
      this._distributedFrequencyTableData = this.parseDistributedFrequencyTableData(data, 'monitorName');
      this.parseMonitorData(data);

      this.getChannelData('impression_frequency', 'media').subscribe((data: any) => {
        this._channelData = this.parseDistributedFrequencyData(data, 'channelName');
        this._channelTableData = this.parseDistributedFrequencyTableData(data, 'channelName');
        // this._distributedChannelData = this.parseDistributedMediaData(data);
      })

      this.getChannelData('impression_overclock', 'media_overclockquery').subscribe((data: any) => {
        this._distributedChannelData = this.parseDistributedMediaData(data);
      })

      /* this.getMonitorData(false).subscribe((data: any) => {
        this.parseMonitorData(data);
      }) */

      this.getMonitorData(true).subscribe((data: any) => {
        this.parseTotalMonitorData(data);
      })
    })
  }

  constructor(
    private store$: Store<reducer.State>,
    private activatedRoute: ActivatedRoute,
    private indicatorsSourceService: IndicatorsSourceService,
    private monitorSourceService: MonitorSourceService,
    private filterNumberPipe: FilterNumberPipe,
  ) {
    this.showBreadcrumb(); // 显示面包屑
  }

  ngOnInit() {
    this.subscription = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe((global: any) => {
      this._startTime = global.startTime;
      this._endTime = global.endTime;
      this._activityKey = JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION'))['value'];
      this._activityName = JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION'))['label'];
      this._dimension = 'monitor';
      this._metrics = ["impression_pv"];
      this._conditions = { // 条件
        "activityKey": this._activityKey,
        "monitorLinkId": this._monitorId,
        "adType": this._adType,
        "start": moment(this._startTime).format('YYYY-MM-DD'),
        "end": moment(this._endTime).format('YYYY-MM-DD')
      };
      this._baseQueryData = {
        "metrics": this._metrics,
        "dimension": this._dimension,
        "conditions": this._conditions,
        "detail": true
      }

      this.activatedRoute.paramMap.subscribe((params: any) => {
        const name = params.get('name');
        const id = params.get('id');
        this._isTotal = !name && !id;
        this.getAllPageData();
      })
    })
  }

  // 当离开此页面时，将secondLevelId和secondLevelName设为null
  ngOnDestroy() {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null
    })

    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: null
    })

    this.store$.dispatch({
      type: guard.HIDE_BREAD,
    });

    this.subscription.unsubscribe();
  }

  // 展示面包屑
  showBreadcrumb() {
    Observable
    .zip(this.activatedRoute.paramMap, this.activatedRoute.queryParamMap, 
      (params: any, queryParams: any) => { 
        return { params: params, queryParams: queryParams } 
      })
    .subscribe((params: any) => {
      const name = params.params.get('name');
      const id = params.params.get('id');

      if (name && id) {
        this._monitorId = id;

        let navList: any = [{
          circle: null,
          info: null,
          title: '曝光',
          link: `/activity/chain/details/${name}/${id}`,
        }, {
          circle: null,
          info: null,
          title: '曝光频次',
          link: `/activity/chain/frequency/${name}/${id}`,
        }, {
          circle: null,
          info: null,
          title: '点击',
          link: `/activity/chain/click/${name}/${id}`,
        }];

        this.store$.dispatch({
          type: guard.SHOW_BREAD,
          breadNavList: navList,
        });
      } else {
        const channelId = params.queryParams.get('channelId');
        const adType = params.queryParams.get('adType');
        this._channelId = channelId;
        this._adType = adType;

        if(channelId === 'undefined') {
          this._channelId = null;
        }

        if(adType === 'undefined') {
          this._adType = null;
        }

        let navList: any = [{
          circle: null,
          info: null,
          title: '曝光',
          link: ["/activity/chain/details/total", { channelId: channelId ? channelId : '', adType: adType ? adType : '' }],
        }, {
          circle: null,
          info: null,
          title: '曝光频次',
          link: ["/activity/chain/frequency/total", { channelId: channelId ? channelId : '', adType: adType ? adType : '' }],
        }, {
          circle: null,
          info: null,
          title: '点击',
          link: ["/activity/chain/click/total", { channelId: channelId ? channelId : '', adType: adType ? adType : '' }],
        }];

        this.store$.dispatch({
          type: guard.SHOW_BREAD,
          breadNavList: navList,
        });

        this.store$.dispatch({
          type: secondLevel.SET_SECOND_LEVEL_NAME,
          secondLevelName: '总计'
        })
      }

    })
  }

}
