import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
// import service
import { IndicatorsSourceService } from '../../../services/source/indicators.source.service';
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
// moment
import * as moment from 'moment';
// utils
import Csv from '../../../utils/export-csv';
import { numberPercent } from '../../../utils/number-percent';
import { Observable } from 'rxjs/Observable';

const _ = require('lodash');

@Component({
  selector: 'analyze-container',
  templateUrl: './analyze-container.component.html',
  styleUrls: ['./analyze-container.component.less'],
  providers: [IndicatorsSourceService],
})

export class AnalyzeContainerComponent implements OnInit, OnDestroy {

  // 状态管理信息
  private _activityKey: string = '';
  private _activityName: string = '';
  private _startTime: string = '';
  private _endTime: string = '';
  private _store: any;

  // 分周维度映射
  private _weekDic: any = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日',
  };

  constructor(
    private store$: Store<reducer.State>,
    private indicatorsSourceService: IndicatorsSourceService,
  ) {
    this._store = this.store$.select('global').debounceTime(1000).subscribe(result => {
      this._activityKey = result.activityKey;
      this._activityName = result.activityName;
      this._startTime = moment(new Date(result.startTime)).format('YYYY-MM-DD');
      this._endTime = moment(new Date(result.endTime)).format('YYYY-MM-DD');
      if (!!this._activityKey) {
        this.getData();
      }
    });
  }

  getData() {
    this.getTabsData();
    this.getTabsDayData(this.buttonType);
  }

  /**
   * 请求当前活动数据
   * @param dimension [维度参数]
   * @param metric [查询的指标参数]
   * @param option [查询的参数]
   * @param orderBy [排序的指标字段]
   * @param desc [升降序排列标示 false为升序 true为降序 默认false]
   **/
  getQueryMetricData(dimension: string, metric: any[] = [], option?: any, orderBy?: string, desc: boolean = false) {
    const metrics = metric.length > 0 ? metric : [
      'pageenter_pv',
      'pageenter_uv',
      'pageenter_click_pv',
      'pageenter_click_uv',
    ];
    const conditions = _.merge({}, {
      activityKey: this._activityKey,
      start: this._startTime,
      end: this._endTime,
    }, option);
    const params = {
      metrics,
      dimension,
      conditions,
      detail: true,
      orderBy,
      desc,
    };
    return this.indicatorsSourceService.queryMetricData(params);
  }

  // 获取Tab项 count数据
  private pageenterPv: number = 0; // 页面访问数（PV）
  private pageenterUv: number = 0; // 页面访问数（UV）
  private pageenterClickPv: number = 0; // 转化数（PV）
  private pageenterClickRate: any = 0; // 转化率（转化数（PV）/ 页面访问数（PV））
  getTabsData() {
    this.getQueryMetricData('activity').then((res) => {
      if (res.code === 200) {
        const data = res.result[0];
        this.pageenterPv = data.pageenter_pv;
        this.pageenterUv = data.pageenter_uv;
        this.pageenterClickPv = data.pageenter_click_pv;
        this.pageenterClickRate = numberPercent((data.pageenter_click_pv / data.pageenter_pv) * 100, true);
      }
    });
  }

  /**
   * 顶部指标tab切换事件
   * @param str [当前所点击的指标标示]
   * @param flag [是否为 Tab的切换，默认 true]
   */
  private metricChecked = ''; // 当前选择的 Tab标示
  private pageenterPvChart: any = null; // 页面访问数（PV）分天数据
  private pageenterUvChart: any = null; // 页面访问数（UV）分天数据
  private pageenterClickPvChart: any = null; // 转化数（PV）分天数据
  private pageenterClickRateChart: any = null; // 转化率（转化数（PV）/ 页面访问数（PV））分天数据
  private lineChart: any = null; // tab 所选项的图表
  onClickMetric(str: string = '', flag: boolean = true) {
    this.metricChecked = str === '' ? 'pageenterPvChart' : str;
    const list = [
      {
        metric: ['pageenter_pv'],
        string: 'savePageenterPvChart',
        key: 'pageenterPvChart',
        name: '页面访问数（PV）',
      },
      {
        metric: ['pageenter_uv'],
        string: 'savePageenterUvChart',
        key: 'pageenterUvChart',
        name: '页面访问数（UV）',
      },
      {
        metric: ['pageenter_click_pv'],
        string: 'savePageenterClickPvChart',
        key: 'pageenterClickPvChart',
        name: '转化数',
      },
      {
        metric: ['pageenter_pv', 'pageenter_click_pv'],
        string: 'savePageenterClickRateChart',
        key: 'pageenterClickRateChart',
        name: '转化率',
      },
    ];

    list.forEach((item: any) => {
      const time = this[item.string].xAxis;
      const data = this[item.string].series;

      this[item.key] = this.setChartData(time, data, item.key === this.metricChecked);
      if (item.key === this.metricChecked) {
        this.lineChart = this.setChartData(time, data, item.name);
        if (flag) {
          const key = item.key === 'pageenterClickRateChart'? 'pageenter_click_rate' : item.metric[0];
          this.getDetailsData(item.metric, key);
          this.getDeviceData();
        }
      }
    });
  }

  /**
   * 获取Tab项 图表数据
   * @param string [当前数据请求的维度]
   * @param flag [是否为 Tab切换，默认true]
   */
  private savePageenterPvChart: any = null; // 页面访问数（PV）分天数据
  private savePageenterUvChart: any = null; // 页面访问数（UV）分天数据
  private savePageenterClickPvChart: any = null; // 转化数（PV）分天数据
  private savePageenterClickRateChart: any = null; // 转化率（转化数（PV）/ 页面访问数（PV））分天数据
  getTabsDayData(string: string, flag: boolean = true) {
    this.getQueryMetricData(string, [], false, string).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const timeData = data.map((x: any) => {
          return string === 'week' ? this._weekDic[x[string]]: x[string];
        });
        const pv = this.setQueryData(timeData, data, 'pageenter_pv', string);
        const uv = this.setQueryData(timeData, data, 'pageenter_uv', string);
        const cpv = this.setQueryData(timeData, data, 'pageenter_click_pv', string);
        const rate = pv.map((x: any, index: number) => {
          const value = numberPercent((cpv[index] / x) * 100);
          return value === 'N/A' ? 0 : value;
        });
        this.savePageenterPvChart = {
          xAxis: timeData,
          series: pv,
        };
        this.savePageenterUvChart = {
          xAxis: timeData,
          series: uv,
        };
        this.savePageenterClickPvChart = {
          xAxis: timeData,
          series: cpv,
        };
        this.savePageenterClickRateChart = {
          xAxis: timeData,
          series: rate,
        };
        this.onClickMetric(this.metricChecked, flag);
      }
    });
  }

  /**
   * 对原始数据进行排序处理整合为图表 series所需的数据
   * @param time [图表X轴的数据]
   * @param data [请求得到的原始数据]
   * @param key  [当前的指标 key]
   * @param type [图表时间类型]
   */
  setQueryData(time: any, data: any, key: string, type: string) {
    const filterData: any[] = [];
    time.forEach((item: any) => {
      const value = data.filter((x: any) => {
        if (type === 'week') {
          return this._weekDic[x[type]] === item;
        } else {
          return x[type] === item;
        }
      })[0];
      filterData.push(value[key] || 0);
    });
    return filterData;
  }

  /**
   * 整合图表数据
   * @param xAxisData [x轴坐标的数据]
   * @param seriesData [series数据]
   * @param checked [是否为被选中状态]
   */
  setChartData(xAxisData: any[] = [], seriesData: any[] = [], checked: any = '') {
    const flag = typeof checked === 'boolean' ? checked : false;
    const name = typeof checked === 'string' ? checked : null;
    return {
      grid: {
        right: 40,
      },
      tooltip: {
        show: !(typeof checked === 'boolean'),
      },
      legend: {
        show: false,
      },
      xAxis: {
        data: xAxisData,
      },
      series: {
        name,
        type: 'line',
        showSymbol: false,
        lineStyle: {
          color: flag ? '#FFFFFF' : '#3399ff',
        },
        areaStyle: {
          color: flag ? '#FFFFFF' : '#3399ff',
        },
        data: seriesData,
      },
    }
  }

  /**
   * 获取对应指标的详细数据
   * @param metric [所要查询的指标]
   */
  private adtypeChart: any = null; // 广告格式图表数据
  private monitorChart: any = null; // 监测链接图表数据
  private mediaChart: any = null; // 渠道类型图表数据
  private mediaList: any = null; // 渠道分布数据
  private dtChart: any = null; // 设备图表数据
  private osChart: any = null; // 操作系统图表数据
  private provinceChart: any = null; // 省份图表数据
  private levelCityChart: any = null; // 线及城市图表数据
  private cityChart: any = null; // 城市图表数据
  getDetailsData(metric: any = [], key: string = '') {
    // 获取广告格式数据
    this.getQueryMetricData('adtype', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, key, 'adtype');
        const chart = {
          series: {
            type: 'pie',
            data: chartList,
          },
        };
        this.adtypeChart = chart;
      }
    });
    // 获取监测链接数据
    this.getQueryMetricData('monitor', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, key, 'monitorName');
        const chart = {
          series: {
            type: 'pie',
            data: chartList,
          },
        };
        this.monitorChart = chart;
      }
    });
    // 获取渠道类型数据
    this.getQueryMetricData('media_type', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, key, 'media_type');
        const chart = {
          series: {
            type: 'pie',
            data: chartList,
          },
        };
        this.mediaChart = chart;
      }
    }); 
    // 获取渠道数据
    this.getQueryMetricData('media', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const count = data.reduce((x: number, y: any) => (x + y[key]), 0);
        const chartList = data.map((item: any) => {
          const value = numberPercent(item[key] / count * 100);
          return {
            name: item.channelName,
            value: value === 'N/A' ? 0 : value,
          };
        });
        this.mediaList = chartList;
      }
    });
    // 获取省份数据
    this.getQueryMetricData('province', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = data.map((item: any) => {
          return {
            name: item.province,
            value: item[key],
          };
        });
        this.provinceChart = chartList;
      }
    });
    // 获取线级城市数据
    this.getQueryMetricData('city_level', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, key, 'city_level');
        const chart = {
          series: {
            type: 'pie',
            data: chartList,
          },
        };
        this.levelCityChart = chart;
      }
    });
    // 获取城市数据
    this.getQueryMetricData('city', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const count = data.reduce((x: number, y: any) => (x + Number(y[key])), 0);
        const chartList = data.map((item: any) => {
          return {
            name: item.city,
            value: numberPercent((item[key] / count) * 100),
          };
        });
        this.cityChart = chartList;
      }
    });
  }

  // 获取设备和系统分布
  private deviceChartData: any = null; // 设备信息数据获取
  private iosMetrice: any = '0.00%'; // 来自IOS系统的指标占比
  private androidMetrice: any = '0.00%'; // 来自Android系统的指标占比
  private iosBrandMetrice: any = { // 来自iPhone的品牌指标占比
    brand: '',
    value: '0.00%',
  };
  private androidBrandMetrice: any = { // 来自安卓手机的品牌指标占比
    brand: '',
    value: '0.00%',
  };
  private iosDtMetrice: any = { // 来自iPhone的品牌指标占比
    dt: '',
    value: '0.00%',
  };
  private androidDtMetrice: any = { // 来自安卓手机的品牌指标占比
    dt: '',
    value: '0.00%',
  };
  getDeviceData() {
    // 设备信息数据获取
    this.getQueryMetricData('device_analyze', ['pageenter_device_analyze']).then((res) => {
      if (res.code === 200 && res.result.length > 0) {
        const data = res.result;
        const list = data.map((item: any) => {
          return item.pageenter_device_analyze;
        });
        this.deviceChartData = {
          series: {
            name: 'Brand',
            data: list,
          }
        };
      } else {
        this.deviceChartData = {
          series: {
            name: 'Brand',
            data: [],
          }
        };
      }
    });

    // 系统数据获取
    this.getQueryMetricData('os', ['pageenter_device_analyze']).then((res) => {
      if (res.code === 200 && res.result.length > 0) {
        const data = res.result;
        const count = data.reduce((x: number, y: any) => (x + y.pageenter_device_analyze), 0);
        const android = data.filter((x: any) => x.os === '0')[0];
        const ios = data.filter((x: any) => x.os === '1')[0];
        this.iosMetrice = !!ios ?
         numberPercent((ios.pageenter_device_analyze / count) * 100, true) : '0.00%';
        this.androidMetrice = !!android ?
         numberPercent((android.pageenter_device_analyze / count) * 100, true) : '0.00%';
      } else {
        this.iosMetrice = '0.00%';
        this.androidMetrice = '0.00%';
      }
    });

    // 获取IOS系统下手机的品牌
    this.getQueryMetricData(
      'brand',
      ['pageenter_device_analyze'],
      {
        osVersion: '1',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.iosBrandMetrice = this.getTop1Info(data, 'pageenter_device_analyze');
        } else {
          this.iosBrandMetrice = {
            brand: '',
            value: '0.00%',
          };
        }
    });

    // 获取Android系统下手机的品牌
    this.getQueryMetricData(
      'brand',
      ['pageenter_device_analyze'],
      {
        osVersion: '0',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.androidBrandMetrice = this.getTop1Info(data, 'pageenter_device_analyze');
        } else {
          this.androidBrandMetrice = {
            brand: '',
            value: '0.00%',
          };
        }
    });

    // 获取IOS系统下平板的机型
    this.getQueryMetricData(
      'dt',
      ['pageenter_device_analyze'],
      {
        osVersion: '1',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.iosDtMetrice = this.getTop1Info(data, 'pageenter_device_analyze');
        } else {
          this.iosDtMetrice = {
            dt: '',
            value: '0.00%',
          };
        }
    });

    // 获取Android系统下平板的机型
    this.getQueryMetricData(
      'dt',
      ['pageenter_device_analyze'],
      {
        osVersion: '0',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.androidDtMetrice = this.getTop1Info(data, 'pageenter_device_analyze');
        } else {
          this.androidDtMetrice = {
            dt: '',
            value: '0.00%',
          };
        }
    });
  }

  /**
   * 设置饼图数据
   * @param data [接口返回的原始数据]
   * @param key [指标key]
   * @param name [请求的维度]
   */
  setPieChartData(data: any, key: string, name: string) {
    let list: any[] = [];
    if (data.length === 0) return list;
    // 转化率数据整合
    if (key === 'pageenter_click_rate') {
      // 获取数据的名称及数值并排序
      const sort = data.map((item: any) => {
          const val = numberPercent((item.pageenter_click_pv / item.pageenter_pv) * 100);
          return {
          name: item[name],
          value: val === 'N/A' ? 0 : val,
        };
      }).sort((a: any, b: any) => (b.value - a.value));
      // 获取 top3 
      const topList = sort.filter((x: any, i: number) => (i < 3))
        .map((item: any) => {
          return {
            name: item.name,
            value: item.value,
          }
        });
      // 获取其他数据 并 push到 toplist中
      const otherList = sort.filter((x: any, i: number) => (i >= 3));
      if (otherList.length > 0) {
        const otherValue = otherList.map((item: any) => item.value)
          .reduce((a: number, b: number) => (a + b));
        topList.push({
          name: '其他',
          value: otherValue,
        });
      }
      list = topList;
    } else {
      // 获取数据的名称及数值并排序
      const sort = data.map((item: any) => {
        return {
          name: item[name],
          value: item[key],
        };
      }).sort((a: any, b: any) => (b.value - a.value));
      // 获取当前数据总值
      const count = sort.map((item: any) => item.value).reduce((a: number, b: number) => (a + b), 0);
      // 获取 top3 
      const topList = sort.filter((x: any, i: number) => (i < 3))
        .map((item: any) => {
          const val = numberPercent((item.value / count) * 100);
          return {
            name: item.name,
            value: val === 'N/A' ? 0 : val,
          }
        });
      // 获取其他数据 并 push到 toplist中
      const otherList = sort.filter((x: any, i: number) => (i >= 3));
      if (otherList.length > 0) {
        const otherValue = otherList.map((item: any) => item.value)
          .reduce((a: number, b: number) => (a + b), 0);
        const other = numberPercent((otherValue / count) * 100);
        topList.push({
          name: '其他',
          value: other === 'N/A' ? 0 : other,
        });
      }
      
      list = topList;
    }
    return list;
  }

  /**
   * 获取top1数据，并返回时增加percent值
   * @param data [接口返回的原始数据]
   * @param key [当前请求的数据 key名]
   */
  getTop1Info(data: any, key: string) {
    const sort = data.sort((x: any, y: any) => (y[key] - x[key]));
    const item = sort[0];
    const count = sort.reduce((x: number, y: any) =>(x + y[key]), 0);
    const value = numberPercent(item[key] / count * 100, true);
    item.value = value;
    return item;
  }

  /**
   * 图表类型切换
   * @param str 切换的状态标示
   */
  private buttonType = 'hour';
  onChangeType(str: string) {
    this.buttonType = str;
    this.getTabsDayData(this.buttonType, false);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }

}
 