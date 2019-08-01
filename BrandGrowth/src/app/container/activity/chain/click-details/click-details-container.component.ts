import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import csv from './../../../../utils/export-csv'
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
  selector: 'click-details',
  templateUrl: './click-details-container.component.html',
  styleUrls: ['./click-details-container.component.less'],
  providers: [IndicatorsSourceService, MonitorSourceService, FilterNumberPipe]
})
export class ClickDetailsContainerComponent implements OnInit {
  chartPieConfig = {
    series: {
      type: 'pie',
      data: [
        {
          name: 'a',
          value: 1
        },
        {
          name: 'b',
          value: 2
        },
        {
          name: 'c',
          value: 3
        },
        {
          name: 'd',
          value: 4
        }
      ]
    }
  };

  private buttonType = 'day';
  onChangeType(str: string) {
    this.buttonType = str;
  }

  // global 数据
  private _startTime: any; // 开始时间
  private _endTime: any; // 结束时间
  private _activityKey: any; // 活动key
  private _activityName: any; // 活动名
  private _isTotal: boolean = true;
  private _csvParams: any = null;
  subscription: any = null;

  // 监测链接相关数据
  private _monitordata: any; // 监测链接
  private _monitorId: any; // 监测Id
  private _adType: any; // 广告格式
  private _channelId: any; // 渠道Id
  private _clickData: any = { // 点击总览
    click_pv: 0,
    click_uv: 0,
    click_ip: 0,
    device_click_pv: 0,
    click_anti: 0,
    impression_pv: 0
  };
  private _clickTrend: any = null; // 点击趋势
  private _distributedAdType: any = null; // 广告格式分布
  private _distributedMonitor: any = null; // 监测链接分布
  private _distributedChannel: any = null; // 渠道分布
  private _distributedMediaType: any = null; // 渠道类型分布
  private _equipmentAnalysis: any = null; // 设备分析
  private _osAnalysis: any = {
    os: [{label: '', value: 0, os: null}, {label: '', value: 0, os: null}],
    dt: [{label: '', value: 0, dt: null}, {label: '', value: 0, dt: null}],
    brand: [{label: '', value: 0, brand: null}, {label: '', value: 0, brand: null}],
  }; // 操作系统相关信息
  private _provinceAnalysis: any = null; // 省份
  private _cityAnalysis: any = null; // 城市
  private _totalClick = 0;
  private _cityLevelAnalysis: any = null; // 线级城市分析

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

  // 初始化当前监测链接的数据
  initialClickData(): Observable<any> {
    this._dimension = "monitor";
    this._metrics = ["click_pv", "click_uv", "click_ip", "device_click_pv", "click_anti", "impression_pv"];
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

  // 整理监测链接的数据
  parseClickData(items: any) {
    this._clickData = { // 点击总览
      click_pv: 0,
      click_uv: 0,
      click_ip: 0,
      device_click_pv: 0,
      click_anti: 0,
      impression_pv: 0
    };
    let result = items.reduce((prev: any, curr: any) => {
      curr.click_pv += prev.click_pv;
      curr.click_uv += prev.click_uv;
      curr.click_ip += prev.click_ip;
      curr.device_click_pv += prev.device_click_pv;
      curr.click_anti += prev.click_anti;
      curr.impression_pv += prev.impression_pv;
      return curr;
    }, this._clickData);
    return result;
  }

  // 点击趋势
  getClickTrend(): Observable<any> {
    this._dimension = "monitor_day";
    this._metrics = ["click_pv"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true,
      orderBy: 'click_pv',
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 整理点击趋势数据
  parseClickTrend(data: any) {
    let xAxisData: any = [];
    let legendData: any = [];
    let seriesData: any = [];
    data.forEach((item: any, index: any) => {
      if (index >= 5) return;
      legendData.push(item.monitorName);
      let obj: any = {
        name: null,
        data: []
      };
      obj.name = item.monitorName;
      xAxisData = [];
      Object.keys(item.click_pv).forEach((time: any) => {
        xAxisData.push(time);
        obj.data.push(item.click_pv[time])
      });
      seriesData.push(obj);
    });
    return {
      legend: {
        data: legendData
      },
      xAxis: {
        boundaryGap: true,
        data: xAxisData
      },
      series: seriesData
    };
  }

  // 整理点击趋势表格数据
  private _tableColumn: any[] = [];
  private _tableData: any[] = [];
  parseClickTrendTable(data: any) {
    const column = [
      {
        key: 'day',
        title: '日期',
      },
    ];
    const content: any[] = [];
    data.forEach((item: any, index: any) => {
      if (index < 5) {
        column.push({
          key: `click_pv_${index}`,
          title: item.monitorName,
        });
        Object.keys(item.click_pv).sort().forEach((time: any, i: number) => {
          if (!content[i]) {
            let obj: any = {
              day: time,
              [`click_pv_${index}`]: item.click_pv[time],
            };
            content.push(obj);
          } else {
            content[i][`click_pv_${index}`] = item.click_pv[time];
          }
        });
      }
    });
    this._tableColumn = column;
    this._tableData = content;
  }

  concatFileName(pageName: string, moduleName: string) {
    // 活动名称
    let activityName = JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION")).label;
    // 时间区间
    let timeStamp = moment(JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_TIME"))[0]).format('YYYY-MM-DD') + '_' + moment(JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_TIME"))[1]).format('YYYY-MM-DD');

    return `${activityName}_${pageName}_${moduleName}_${timeStamp}.csv`
  }

  downloadClickTrendCsv() {
    let legendData = this._clickTrend.legend.data;
    let seriesData = this._clickTrend.series;
    let xAxisData = this._clickTrend.xAxis.data;
    let csvText = '日期';
    legendData.map((item: any) => csvText = csvText + ',' + item);
    xAxisData.map((item: any, index: any) => {
      csvText += `\r\n${item}`;
      seriesData.map((series: any) => {
        csvText += `,${series.data[index]}`
      })
    })

    this._csvParams = {
      filename: this.concatFileName('监测链接点击', '点击趋势列表'),
      data: csvText
    };

    csv.download(this._csvParams.filename, this._csvParams.data);
  }

  // 下载地图数据
  downloadClickMapCsv() {
    let list: any[] = [];
    this._provinceAnalysis.map((x: any, i: number) => {
      list[i] = [];
      list[i].push(x);
    })
    this._cityAnalysis.map((x: any, i: number) => {
      if (list[i] && list[i].length > 0) {
        list[i].push(x);
      } else {
        list[i] = [[]];
        list[i].push(x);
      }
    });
    this._cityLevelAnalysis.series.data.map((x: any, i: number) => {
      if (list[i] && list[i].length > 0) {
        list[i].push(x);
      } else {
        list[i] = [[], []];
        list[i].push(x);
      }
    });

    let csvText = '省份,点击,,城市,占比,,线级城市,占比';
    list.map((x: any) => {
      csvText += '\r\n';
      x.map((item: any) => {
        let name = '';
        let value = '';
        if (item.name !== undefined || item.province !== undefined) {
          name = item.name || item.province;
          value = item.value !== undefined ? `${item.value}%` : item.click_pv;
        }
        csvText += `${name},${value},,`;
      });
    });

    const csvInfo = {
      filename: this.concatFileName('监测链接点击', '点击区域列表'),
      data: csvText,
    };
    
    csv.download(csvInfo.filename, csvInfo.data);
  }

  // 获取分布
  getDistributedData(dismension: any): Observable<any> {
    this._dimension = dismension;
    this._metrics = ["click_pv"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 整理分布数据 适用于广告 监测链接 渠道类型
  parseDistributedData(data: any, dismension: any) {
    if (!data && data.length === 0) return null;
    let seriesData: any = [];
    let otherItem = {
      name: '其他',
      value: 0
    };
    const list = data.sort((a: any, b: any) => b.click_pv - a.click_pv);
    // top3
    list.forEach((item: any, index: number) => {
      let value = this.filterNumberPipe.transform(item.click_pv / this._totalClick * 100);
      value = value === 'N/A' ? 0 : value;
      if(index < 3) {
        seriesData.push({
          name: item[dismension],
          value: value * 1,
        })
      }
    });

    if(list.length >= 3) {
      /* const otherCount = list.filter((d: any, i: number) => (i > 2))
        .reduce((x: number, y: any) => (x + y.click_pv), 0); */
      const value = seriesData.reduce((x: number, y: any) => (x - y.value), 100);
      seriesData.push({
        name: '其他',
        value: this.filterNumberPipe.transform(value),
      })
    }
    return {
      series: {
        type: 'pie',
        data: seriesData
      }
    }
  }

  // 整理渠道分布
  parseDistributedMediaData(data: any) {
    let list: any = [];
    const sort = data.sort((a: any, b: any) => (b.click_pv - a.click_pv));
    sort.forEach((item: any) => {
      list.push({
        name: item.channelName,
        value: (item.click_pv / this._totalClick * 100).toFixed(2)
      })
    });
    return list;
  }

  // 获取设备分析
  getAnalysis(): Observable<any> {
    this._dimension = 'device_analyze';
    this._metrics = ["click_device_analyze"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 获取设备分析
  getEquipmentAnalysis(): Observable<any> {
    this._dimension = 'brand';
    this._metrics = ["click_device_analyze"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 获取操作系统相关信息
  getOsAnalysis(dimension: any, conditions: any): Observable<any> {
    this._dimension = dimension;
    this._metrics = ["click_device_analyze"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": Object.assign({}, this._conditions, conditions),
      "detail": true
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 整理设备分析数据
  parseEquipmentAnalysis(data: any) {
    let seriesData: any = [];
    // TODO 这里因为totalClick的值为0，所以value均为Infinity，需改回
    // (item.click_device_analyze / this._totalClick * 100).toFixed(2)
    data.forEach((item: any) => {
      seriesData.push({
        name: item.brand,
        value: item.click_device_analyze
      })
    });
    return {
      series: {
        data: seriesData
      }
    }
  }

  // 获取省份
  getProvinceAnalysis(): Observable<any> {
    this._dimension = 'province';
    this._metrics = ["click_pv"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 获取城市相关信息
  getCityAnalysis(): Observable<any> {
    this._dimension = 'city';
    this._metrics = ["click_pv"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 获取线级城市占比信息
  getCityLevelData(): Observable<any> {
    this._dimension = 'city_level';
    this._metrics = ["click_pv"];
    this._baseQueryData = {
      "metrics": this._metrics,
      "dimension": this._dimension,
      "conditions": this._conditions,
      "detail": true
    }
    return this.queryMetricData(this._baseQueryData);
  }

  // 整理城市相关信息
  parseCityAnalysis(data: any) {
    let cityData: any = [];
    data.forEach((item: any) => {
      cityData.push({
        name: item.city,
        value: (item.click_pv / this._totalClick * 100).toFixed(2)
      })
    });
    return cityData;
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

  constructor(
    private store$: Store<reducer.State>,
    private activatedRoute: ActivatedRoute,
    private indicatorsSourceService: IndicatorsSourceService,
    private monitorSourceService: MonitorSourceService,
    private filterNumberPipe: FilterNumberPipe,
  ) {
    this.showBreadcrumb(); // 显示面包屑
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
    // 初始化曝光数据
    this.initialClickData().subscribe((data: any) => {
      this._clickData = this.parseClickData(data);
      this._totalClick = this._clickData.click_pv;

      // 点击趋势
      this.getClickTrend().subscribe((data: any) => {
        this._clickTrend = this.parseClickTrend(data);
        this.parseClickTrendTable(data);
      })

      // 广告格式分布
      this.getDistributedData('adtype').subscribe((data: any) => {
        this._distributedAdType = this.parseDistributedData(data, 'adtype');
      })

      // 监测链接分布
      this.getDistributedData('monitor').subscribe((data: any) => {
        this._distributedMonitor = this.parseDistributedData(data, 'monitorName');
      })

      // 渠道分布
      this.getDistributedData('media').subscribe((data: any) => {
        this._distributedChannel = this.parseDistributedMediaData(data);
      })

      // 渠道类型分布
      this.getDistributedData('media_type').subscribe((data: any) => {
        this._distributedMediaType = this.parseDistributedData(data, 'media_type');
      })

      // 设备信息数据
      this.getAnalysis().subscribe((data: any) => {
        if (data.length > 0) {
          const list = data.map((item: any) => {
            return item.click_device_analyze;
          });
          this._equipmentAnalysis = {
            series: {
              name: 'Brand',
              data: list,
            },
          };
        } else {
          this._equipmentAnalysis = {
            series: {
              name: 'Brand',
              data: [],
            },
          };
        }
      })

      // 操作系统分析
      this.getOsAnalysis('os', {}).subscribe((data: any) => {
        let osList = { 0: 'Android', 1: 'IOS', 2: 'WP', 3: 'Others' };
        let totalOS = data.reduce((original: any, extra: any) => extra.click_device_analyze + original, 0);
        if(data[0]) {
          this._osAnalysis.os[0] = { label: osList[data[0].os], value: data[0].click_device_analyze / totalOS, os: data[0].os };
        }
        if(data[1]) {
          this._osAnalysis.os[1] = { label: osList[data[1].os], value: data[1].click_device_analyze / totalOS, os: data[1].os };
        }

        this._osAnalysis.os.forEach((osItem: any, index: number) => {
          this.getOsAnalysis('brand', { deviceType: osItem.os }).subscribe((brandData: any) => {
            let totalBrand = brandData.reduce((original: any, extra: any) => extra.click_device_analyze + original, 0);
            if(brandData[index]) {
              this._osAnalysis.brand[index] = { label: brandData[index].brand, value: brandData[index].click_device_analyze / totalBrand, brand: brandData[index].brand };

              this._osAnalysis.brand.forEach((brandItem: any) => {
                this.getOsAnalysis('dt', { deviceType: osItem.os, brand: brandItem.brand }).subscribe((dtData: any) => {
                  let totalDt = dtData.reduce((original: any, extra: any) => extra.click_device_analyze + original, 0);
                  if(dtData[index]) {
                    this._osAnalysis.dt[index] = { label: dtData[index].dt, value: dtData[index].click_device_analyze / totalDt, dt: dtData[index].dt };
                  }
                })
              });
            }
          })
        });
      })

      // 省份
      this.getProvinceAnalysis().subscribe((data: any) => {
        const list = data.map((item: any) => {
          return {
            name: item.province,
            value: item.click_pv,
          };
        })
        // this._provinceAnalysis = data;
        this._provinceAnalysis = list;
      })

      // 城市
      this.getCityAnalysis().subscribe((data: any) => {
        this._cityAnalysis = this.parseCityAnalysis(data);
      })

      // 线级城市信息
      this.getCityLevelData().subscribe((data: any) => {
        this._cityLevelAnalysis = this.parseDistributedData(data, 'city_level');
      })
    })
  }

  ngOnInit() {
    this.subscription = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe((global: any) => {
      this._startTime = global.startTime;
      this._endTime = global.endTime;
      this._activityKey = JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION'))['value'];
      this._activityName = JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION'))['label'];
      this._dimension = 'monitor';
      this._metrics = ["click_pv"];
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

        if (name && id) {
          this._isTotal = false;
        }
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
