import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

// import service
import { BtlSourceService } from '../../../services/source/btl.source.service';
import { IndicatorsSourceService } from '../../../services/source/indicators.source.service';
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
// moment
import * as moment from 'moment';
// utils
import Csv from '../../../utils/export-csv';
import { numberPercent } from '../../../utils/number-percent';

// import Pipes
import { FilterNumberPipe } from '../../../pipes/filter-number.pipe';

const _ = require('lodash');

@Component({
  selector: 'detection-container',
  templateUrl: './detection-container.component.html',
  styleUrls: ['./detection-container.component.less'],
  providers: [BtlSourceService, IndicatorsSourceService, FilterNumberPipe],
})
export class DetectionContainerComponent implements OnInit, OnDestroy {
  
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
    private btlSourceService: BtlSourceService,
    private indicatorsSourceService: IndicatorsSourceService,
    private filterNumberPipe: FilterNumberPipe,
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
    this.getBtlList();
  }

  /**
   * 获取数据
   * @param metrics [所要查询的指标列表]
   * @param dimension [所要查询的维度]
   * @param option [查询的参数（conditions）]
   * @param orderBy [排序的指标字段]
   * @param desc [升降序排列标示 false为升序 true为降序 默认false]
   */
  getQueryData(metrics: any, dimension: string = 'activity', option?: any, orderBy?: string, desc: boolean = false) {
    const conditions = _.merge({}, {
      activityKey: this._activityKey,
      btlIds: this.selected, // 线下区域id
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

  // 初始化获取线下区域列表 默认选择全部线下区域
  private probeList: any[] = [];
  private selected: any = '';
  getBtlList() {
    this.btlSourceService.getBtlList().then((res: any) => {
      if (res.code === 200) {
        const data = res.result;
        let list: any = [];
        if (data.length > 0) {
          list = data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          list.unshift({
            id: list.map((x: any) => x.id).join(),
            name: '全部目标区域',
          });
        }
        
        this.probeList = list;
        this.selected = list.length > 0 ? list[0].id : null;
        this.getSelectedData(this.selected);
      }
    })
  }

  /**
   * 切换线下区域图表时日周事件
   * @param info [当前所选线下区域信息]
   */
  private buttonType = ''; // 当前时间类型
  onChangeType(str: string) {
    this.buttonType = str;
    this.getQueryData(['arrival', 'new_custom'], this.buttonType, false, this.buttonType).then((res) => {
      if (res.code === 200 && res.result.length > 0) {
        const data = res.result;
        // 设置折线图数据
        this.setChartData(data, str);
        // 设置表格数据
        this.setTableData(data, str);
      }
    });
  }

  private lineChart: any = null; // 图表数据
  setChartData(data: any, str: string) {
    let timeData: any[] = [];
    if (str === 'hour') {
      timeData = data.sort((a: any, b: any) => (
        Number(a[str].replace(/:/, '')) - Number(b[str].replace(/:/, ''))
      )).map((x: any) => x[str]);
    } else if (str === 'week') {
      timeData = data.map((x: any) => this._weekDic[x[str]]);
    } else {
      timeData = data.map((x: any) => x[str]);
    }
    const arrival = this.setQueryData(timeData, data, 'arrival', str);
    const custom = this.setQueryData(timeData, data, 'new_custom', str);
    const series = [
      {
        name: '到访人数',
        data: arrival,
        showSymbol: false,
      },
      {
        name: '新访客',
        showSymbol: false,
        data: custom,
      },
    ];
    this.lineChart = {
      legend: {
        data: ['到访人数', '新访客'],
      },
      xAxis: {
        data: timeData,
      },
      series,
    };
  }

  private tableColumn: any = null; // 表格表头数据
  private tableData: any = null; // 表格内容数据
  setTableData(data: any, str: string) {
    const column = [
      {
        key: str,
        title: '时间',
      },
      {
        key: 'arrival',
        title: '到访人数',
      },
      {
        key: 'new_custom',
        title: '新访客',
      },
    ];
    const content = data;
    this.tableColumn = column;
    this.tableData = content;
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
   * 切换线下区域事件
   * @param info [当前所选线下区域信息]
   */
  onSelectedChange(info: any) {
    this.getSelectedData(info);
  }

  /**
   * 获取线下区域的相关数据
   * @param id [当前选择的线下区域id]
   */
  getSelectedData(id: any) {
    this.getArrivalData();
  }

  // 获取访客总量数据
  private arrivalCount: number = 0; // 活动到访人数
  private arrivalRate: any = 0; // 活动到访率
  private newCustom: number = 0; // 新访客
  private oldCustom: number = 0; // 老访客
  getArrivalData() {
    this.getQueryData(['arrival', 'impression_uv', 'new_custom']).then((res) => {
      if (res.code === 200 && res.result.length > 0) {
        const value = res.result[0];
        this.arrivalCount = value.arrival;
        this.newCustom = value.new_custom;
        this.oldCustom = value.arrival - value.new_custom;
        this.arrivalRate = numberPercent((value.arrival / value.impression_uv) * 100, true);
      }
      this.onChangeType('hour');
      this.getPositionData();
    });
  }

  // 获取访客线下分布数据
  private positionData: any = null;
  getPositionData() {
    this.getQueryData(['arrival'], 'position').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, 'arrival', 'name', 5);
        const chart = {
          series: {
            name: '访客线下分布',
            type: 'pie',
            data: chartList,
          },
        }
        this.positionData = chart;
      } 
      this.getVisitData();
      this.getDeviceData();
      this.getAreaData();
    });
  }

  // 获取访问数据
  private adtypeChart: any = null; // 广告格式图表数据
  private monitorChart: any = null; // 监测链接图表数据
  private mediaChart: any = null; // 渠道类型图表数据
  private mediaList: any = null; // 渠道分布数据
  getVisitData() {
    this.getQueryData(['arrival'], 'adtype').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, 'arrival', 'adtype');
        const chart = {
          series: {
            name: '广告格式',
            type: 'pie',
            data: chartList,
          },
        }
        this.adtypeChart = chart;
      }
    });
    // 获取监测链接数据
    this.getQueryData(['arrival'], 'monitor').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, 'arrival', 'monitorName');
        const chart = {
          series: {
            name: '监测链接',
            type: 'pie',
            data: chartList,
          },
        };
        this.monitorChart = chart;
      }
    });
    // 获取渠道类型数据
    this.getQueryData(['arrival'], 'media_type').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, 'arrival', 'media_type');
        const chart = {
          series: {
            name: '渠道类型',
            type: 'pie',
            data: chartList,
          },
        };
        this.mediaChart = chart;
      }
    }); 
    // 获取渠道数据
    this.getQueryData(['arrival'], 'media').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const count = data.reduce((x: number, y: any) => (x + y.arrival), 0);
        const chartList = data.map((item: any) => {
          const value = this.filterNumberPipe.transform(item.arrival / count * 100);
          return {
            name: item.channelName,
            value: value === 'N/A' ? 0 : value,
          };
        });
        this.mediaList = chartList;
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
    this.getQueryData(['arrival_device_analyze'], 'device_analyze').then((res) => {
      if (res.code === 200 && res.result.length > 0) {
        const data = res.result;
        const list = data.map((item: any) => {
          return item.arrival_device_analyze;
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
    this.getQueryData(['arrival_device_analyze'], 'os').then((res) => {
      if (res.code === 200 && res.result.length > 0) {
        const data = res.result;
        const count = data.reduce((x: number, y: any) => (x + y.arrival_device_analyze), 0);
        const android = data.filter((x: any) => x.os === '0')[0];
        const ios = data.filter((x: any) => x.os === '1')[0];
        this.iosMetrice = !!ios ?
         numberPercent((ios.arrival_device_analyze / count) * 100, true) : '0.00%';
        this.androidMetrice = !!android ?
         numberPercent((android.arrival_device_analyze / count) * 100, true) : '0.00%';
      } else {
        this.iosMetrice = '0.00%';
        this.androidMetrice = '0.00%';
      }
    });

    // 获取IOS系统下手机的品牌
    this.getQueryData(
      ['arrival_device_analyze'],
      'brand',
      {
        osVersion: '1',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.iosBrandMetrice = this.getTop1Info(data, 'arrival_device_analyze');
        } else {
          this.iosBrandMetrice = {
            brand: '',
            value: '0.00%',
          };
        }
    });

    // 获取Android系统下手机的品牌
    this.getQueryData(
      ['arrival_device_analyze'],
      'brand',
      {
        osVersion: '0',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.androidBrandMetrice = this.getTop1Info(data, 'arrival_device_analyze');
        } else {
          this.androidBrandMetrice = {
            brand: '',
            value: '0.00%',
          };
        }
    });

    // 获取IOS系统下平板的机型
    this.getQueryData(
      ['arrival_device_analyze'],
      'dt',
      {
        osVersion: '1',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.iosDtMetrice = this.getTop1Info(data, 'arrival_device_analyze');
        } else {
          this.iosDtMetrice = {
            dt: '',
            value: '0.00%',
          };
        }
    });

    // 获取Android系统下平板的机型
    this.getQueryData(
      ['arrival_device_analyze'],
      'dt',
      {
        osVersion: '0',
        deviceType: '1',
      }).then((res) => {
        if (res.code === 200 && res.result.length > 0) {
          const data = res.result;
          this.androidDtMetrice = this.getTop1Info(data, 'arrival_device_analyze');
        } else {
          this.androidDtMetrice = {
            dt: '',
            value: '0.00%',
          };
        }
    });
  }

  // 获取区域分布数据
  private provinceChart: any = null; // 省份图表数据
  private levelCityChart: any = null; // 线及城市图表数据
  private cityChart: any = null; // 城市图表数据
  getAreaData() {
    // 获取省份数据
    this.getQueryData(['arrival'], 'province').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = data.map((item: any) => {
          return {
            name: item.province,
            value: item.arrival,
          };
        });
        this.provinceChart = chartList;
      }
    });
    // 获取线级城市数据
    this.getQueryData(['arrival'], 'city_level').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const chartList = this.setPieChartData(data, 'arrival', 'city_level');
        const chart = {
          series: {
            name: '线级城市',
            type: 'pie',
            data: chartList,
          },
        };
        this.levelCityChart = chart;
      }
    });
    // 获取城市数据
    this.getQueryData(['arrival'], 'city').then((res) => {
      if (res.code === 200) {
        const data = res.result;
        const count = data.reduce((x: number, y: any) => ( x + Number(y.arrival) ), 0);
        const chartList = data.map((item: any) => {
          return {
            name: item.city,
            value: this.filterNumberPipe.transform((item.arrival / count) * 100),
          };
        });
        this.cityChart = chartList;
      }
    });
  }

  /**
   * 设置饼图数据
   * @param data [接口返回的原始数据]
   * @param key [指标key]
   * @param name [请求的维度]
   * @param top [获取的 top数]
   */
  setPieChartData(data: any, key: string, name: string, top: number = 3) {
    let list: any[] = [];
    if (data.length === 0) return list;
    // 获取数据的名称及数值并排序
    const sort = data.map((item: any) => {
      return {
        name: item[name],
        value: item[key],
      };
    }).sort((a: any, b: any) => (b.value - a.value));
    // 获取当前数据总值
    const count = sort.map((item: any) => item.value).reduce((a: number, b: number) => (a + b), 0);
    // 获取 top 数据
    const topList = sort.filter((x: any, i: number) => (i < top))
      .map((item: any) => {
        const val = numberPercent((item.value / count) * 100);
        return {
          name: item.name,
          value: val === 'N/A' ? 0 : val,
        }
      });
    // 获取其他数据 并 push到 toplist中
    const otherList = sort.filter((x: any, i: number) => (i >= top));
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

  // 下载表格数据
  downloadData(str: string) {
    const self = this;
    if (str === 'analyze') {
      const fileName = `${self._activityName}_活动总览_线下到访分析_${self._startTime}~${self._endTime}.csv`;
      let data = self.tableColumn.map((x: any) => x.title).join();
      let keys = self.tableColumn.map((x: any) => x.key);
      self.tableData.forEach((item: any) => {
        const content = keys.map((x: any) => item[x]);
        data += `\r\n${content.join()}`;
      });
      Csv.download(fileName, data);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }
}
