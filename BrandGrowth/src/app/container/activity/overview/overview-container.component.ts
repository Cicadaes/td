import { 
  Component, 
  OnInit,
  OnDestroy,
} from '@angular/core';
// import service
import { AdcampSourceService } from '../../../services/source/adcamp.source.service';
import { IndicatorsSourceService } from '../../../services/source/indicators.source.service';
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
// moment
import * as moment from 'moment';
// utils
import Csv from '../../../utils/export-csv';
import { numberPercent } from '../../../utils/number-percent';

@Component({
  selector: 'overview-container',
  templateUrl: './overview-container.component.html',
  styleUrls: ['./overview-container.component.less'],
  providers: [AdcampSourceService, IndicatorsSourceService],
})
export class OverviewContainerComponent implements OnInit, OnDestroy {

  // global 状态管理数据
  private _store: any;
  private _activityKey: string = '';
  private _activityName: string = '';
  // 当前活动的投放起始时间
  private _startTime: string = '';
  private _endTime: string = '';
  // 投放期
  private advertisementFlight: string = '';
  private advertisementFlightNumber: number = 0;
  // 监测链接数据
  private monitoringLink: number = 0;
  // 投档媒体数
  private mediaList: any[] = [];

  constructor(
    private store$: Store<reducer.State>,
    private adcampSourceService: AdcampSourceService,
    private indicatorsSourceService: IndicatorsSourceService,
  ) {
    this._store = this.store$.select('global').debounceTime(1000).subscribe(result => {
      if (this._activityKey !== result.activityKey) {
        this._activityKey = result.activityKey;
        this._activityName = result.activityName;
        if (!!this._activityKey) {
          this.getData();
        }
      }
    });
  }

  // 获取数据
  getData() {
    this.getActivityInfo();
  }

  // 获取当前营销活动信息
  getActivityInfo() {
    this.adcampSourceService.getActivityByKey(this._activityKey).then((res) => {
      if (res.code === 200) {
        const data = res.result.activity;
        const start = moment(data.startTime).format('YYYY-MM-DD');
        const end = moment(data.endTime).format('YYYY-MM-DD');
        const number = (Date.parse(end) - Date.parse(start)) / 60 / 60 / 24 / 1000;
        this._startTime = start;
        this._endTime = end;
        this.advertisementFlight = `${start} ~ ${end}`;
        this.advertisementFlightNumber = number;
        this.getQueryMetricData();
        this.getActivityDataCount();
        this.getActivityDataDay();
        this.getHighFrequencyTime();
      }
    });
  }

  /**
   * 请求当前活动数据
   * dimension [维度参数]
   * metric [查询的指标参数]
   **/
  getActivityData(dimension: string, metric: any[] = [], orderBy?: boolean) {
    const metrics = metric.length > 0 ? metric : [
      'impression_pv',
      'impression_uv',
      'impression_ip',
      'click_pv',
      'click_uv',
      'click_ip',
    ];
    const params = {
      metrics,
      dimension,
      conditions: {
        activityKey: this._activityKey,
        start: this._startTime,
        end: this._endTime,
      },
      detail: true,
      orderBy: orderBy ? dimension : null,
    };
    return this.indicatorsSourceService.queryMetricData(params);
  }

  // 活动总量数据
  private impressionPvCount: number = 0; // 曝光
  private impressionUvCount: number = 0; // 独立曝光
  private impressionIpCount: number = 0; // 曝光IP
  private impressionAverage: any = 0; // 平均每台设备曝光
  private impressionDevice: any = 0; // 携带设备ID曝光
  private impressionAnti: any = 0; // 异常曝光
  private impressionMob: any = 0; // 移动端曝光  
  private clickPvCount: number = 0; // 点击
  private clickUvCount: number = 0; // 独立点击
  private clickIpCount: number = 0; // 点击IP
  private clickAverage: any = 0; // 平均每台设备点击
  private clickDevice: any = 0; // 携带设备ID点击
  private clickAnti: any = 0; // 异常点击
  private clickMob: any = 0; // 移动端点击  
  // 获取当前活动数据
  getActivityDataCount() {
    const metric = [
      'impression_pv',
      'impression_uv',
      'impression_ip',
      'device_impression_pv', // 携带设备ID曝光
      'impression_anti', // 异常曝光
      'mob_impression_pv', // 移动端曝光
      'click_pv',
      'click_uv',
      'click_ip',
      'device_click_pv', // 携带设备ID曝光
      'click_anti', // 异常点击
      'mob_click_pv', // 移动端点击
    ];
    this.getActivityData('activity', metric).then((res) => {
      if (res.code === 200) {
        const data = res.result[0];
        this.impressionPvCount = data.impression_pv;
        this.impressionUvCount = data.impression_uv;
        this.impressionIpCount = data.impression_ip;
        this.impressionAverage = numberPercent(data.impression_pv / data.impression_uv);
        this.impressionAnti = numberPercent((data.impression_anti / data.impression_pv) * 100, true);
        this.impressionDevice = numberPercent((data.device_impression_pv / data.impression_pv) * 100, true);
        this.impressionMob = numberPercent((data.mob_impression_pv / data.impression_pv) * 100, true);
        this.clickPvCount = data.click_pv;
        this.clickUvCount = data.click_uv;
        this.clickIpCount = data.click_ip;
        this.clickAverage = numberPercent(data.click_pv / data.click_uv);
        this.clickAnti = numberPercent((data.click_anti / data.click_pv) * 100, true);
        this.clickDevice = numberPercent((data.device_click_pv / data.click_pv) * 100, true);
        this.clickMob = numberPercent((data.mob_click_pv / data.click_pv) * 100, true);
      }
    });
  }

  // 获取高频时段
  private impressionHighFre: string = '00:00';
  private clickHighFre: string = '00:00';
  getHighFrequencyTime() {
    this.getActivityData('hour', ['impression_pv', 'click_pv']).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const click = data.map((x: any) => {
          return {
            hour: x.hour,
            click_pv: x.click_pv,
          };
        }).sort((a: any, b: any) => (b.click_pv - a.click_pv));
        const impression = data.map((x: any) => {
          return {
            hour: x.hour,
            impression_pv: x.impression_pv,
          };
        }).sort((a: any, b: any) => (b.impression_pv - a.impression_pv));

        this.impressionHighFre = impression[0].impression_pv === 0 ? 'N/A' : impression[0].hour;
        this.clickHighFre = click[0].click_pv === 0 ? 'N/A' : click[0].hour;
      }
    });
  }

  // 活动分天数据
  private impressionPvDay: any = null; // 曝光
  private impressionUvDay: any = null; // 独立曝光
  private impressionIpDay: any = null; // 曝光IP
  private clickPvDay: any = null; // 点击
  private clickUvDay: any = null; // 独立点击
  private clickIpDay: any = null; // 点击IP
  // 获取活动分天数据
  getActivityDataDay() {
    this.getActivityData('day', [], true).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const timeData = data.map((x: any) => x.day);
        const ipv = data.map((x: any) => x.impression_pv);
        const iuv = data.map((x: any) => x.impression_uv);
        const iip = data.map((x: any) => x.impression_ip);
        const cpv = data.map((x: any) => x.click_pv);
        const cuv = data.map((x: any) => x.click_uv);
        const cip = data.map((x: any) => x.click_ip);
        this.impressionPvDay = this.setChartData(timeData, ipv);
        this.impressionUvDay = this.setChartData(timeData, iuv);
        this.impressionIpDay = this.setChartData(timeData, iip);
        this.clickPvDay = this.setChartData(timeData, cpv);
        this.clickUvDay = this.setChartData(timeData, cuv);
        this.clickIpDay = this.setChartData(timeData, cip);
      }
    });
  }

  /**
   * 整合图表数据
   * @param xAxisData [x轴坐标的数据]
   * @param seriesData [series数据]
   */
  setChartData(xAxisData: any[] = [], seriesData: any[] = []) {
    return {
      // 渐变
      visualMap: {
        show: false,
        seriesIndex: 0,
        type: 'continuous',
        min: 0,
        max: 9,
        color: ['#2D8CF0', '#19BE6B'],
      },
      xAxis: {
        data: xAxisData,
      },
      yAxis: {
        splitLine: {
          show: false,
        },
      },
      series: {
        data: seriesData,
      },
    };
  }

  // 获取监测链接列表
  private mediaListFilter: any[] = [];
  getQueryMetricData() {
    this.getActivityData('monitor', ['click_pv']).then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const list = data.map((x: any) => x.channelName).filter((x: any) => !!x);
        const a = Array.from(new Set(list));
        this.monitoringLink = data.length;
        this.mediaList = a;
        this.mediaListFilter = a.filter((x: any, i: number) => (i < 10));
      }
    });
  }

  ngOnInit() {
    this.setChartData();
    if (!!this._activityKey) {
      this.getData();
    }
  }

  /**
   * 下载文件
   * @params string [下载的模块标示]
   */
  downloadData(string: string) {
    if (string === 'activity') {
      this.activityDownload();
    } else if (string === 'impression') {
      this.activityImpressionDownload();
    } else if (string === 'click') {
      this.activityClickDownload();
    }
  }

  // 下载营销活动简析的数据
  activityDownload() {
    const fileName = `${this._activityName}_活动总览_您的营销活动简析_${this.advertisementFlight}.csv`;
    let data = `投放期${this.advertisementFlight},监测链接数,投放的媒体数`;
    data += `\r\n${this.advertisementFlightNumber}天,${this.monitoringLink}个,${this.mediaList.length}个`;
    this.mediaList.forEach((item: any) => {
      data += `\r\n,,${item}`;
    });
    Csv.download(fileName, data);
  }

  // 下载曝光简析的数据
  activityImpressionDownload() {
    const fileName = `${this._activityName}_活动总览_您的营销活动曝光简析_${this.advertisementFlight}.csv`;
    let data = '时间,曝光,独立曝光,曝光IP,携带设备ID,来自手机端平台,异常曝光占比,平均每台设备曝光,曝光高频时段';
    data += `\r\n${this.advertisementFlight},${this.impressionPvCount},${this.impressionUvCount},${this.impressionIpCount},${this.impressionDevice},${this.impressionMob},${this.impressionAnti},${this.impressionAverage},${this.impressionHighFre}`;
    const ipv = this.impressionPvDay.series.data;
    const iuv = this.impressionUvDay.series.data;
    const iip = this.impressionIpDay.series.data;
    this.impressionPvDay.xAxis.data.forEach((item: any, index: number) => {
      data += `\r\n${item},${ipv[index]},${iuv[index]},${iip[index]}`;
    });
    Csv.download(fileName, data);
  }

  // 下载点击简析的数据
  activityClickDownload() {
    const fileName = `${this._activityName}_活动总览_您的营销活动点击简析_${this.advertisementFlight}.csv`;
    let data = '时间,点击,独立点击,点击IP,携带设备ID,来自手机端平台,异常点击占比,平均每台设备点击,点击高频时段';
    data += `\r\n${this.advertisementFlight},${this.clickPvCount},${this.clickUvCount},${this.clickIpCount},${this.clickDevice},${this.clickMob},${this.clickAnti},${this.clickAverage},${this.clickHighFre}`;
    const cpv = this.clickPvDay.series.data;
    const cuv = this.clickUvDay.series.data;
    const cip = this.clickIpDay.series.data;
    this.clickPvDay.xAxis.data.forEach((item: any, index: number) => {
      data += `\r\n${item},${cpv[index]},${cuv[index]},${cip[index]}`;
    });
    Csv.download(fileName, data);
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }
}
