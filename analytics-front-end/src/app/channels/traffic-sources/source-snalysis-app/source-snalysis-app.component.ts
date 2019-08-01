import { Component, OnInit, Injector } from '@angular/core';
import { sourceSnalysisappModel } from './source-snalysis-app.model';
import { trafficSourcesService } from '../traffic-sources.service';
import { BaseComponent } from '../../../common/base-component';
import { format } from 'date-fns';
import { EChartOption } from 'echarts';
import { Globals } from './../../../../../src/app/utils/globals';
import { commonModel } from '../../common/commom.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-source-snalysis-app',
  templateUrl: './source-snalysis-app.component.html',
  styleUrls: ['./../traffic-sources.component.less']
})
export class SourceSnalysisappComponent extends BaseComponent implements OnInit {
  searchTerms = new Subject<string>();
  _tabsChange = new Subject<number>();
  sourceSnalysisappModel: sourceSnalysisappModel = new sourceSnalysisappModel();
  commonModel: commonModel = new commonModel();

  newData: any; //当前日期
  selectedTypeValue: any; //来源类型绑定值
  checkOptionsanalytic: any = []; //分析对象数据
  source: boolean = false; //推广渠道
  medium: boolean = false; //推广媒介
  campaign: boolean = false; //活动名称
  term: boolean = false; //关键词
  content: boolean = false; //创意版本
  sourceInformation: any; //推广渠道当前值
  mediumInformation: any; //推广媒介当前值
  campaignInformation: any; //活动名称当前值
  termInformation: any; //关键词当前值
  contentInformation: any; //创意版本当前值
  filterShow: boolean; //更多筛选显示条件
  flowTrendName: any = 'Top10来源趋势'; //流量趋势名称
  popovers: any = this.sourceSnalysisappModel.popovers; //渠道趋势tootip里面的内容
  tabsLists: any = this.sourceSnalysisappModel.tabsLists; //Top10渠道趋势标签页数据
  selectedIndex: number; //Top10渠道趋势标签页第几个下标
  echartsLoading: boolean; //echarts加载+无数据
  load: boolean; //echarts加载+无数据
  chartOption: EChartOption; //流量来源分析Echarts数据
  details: any = this.sourceSnalysisappModel.details; //来源明细tootip数据
  dataSet: any = []; //图表数据
  loading = false; //图表数据加载loading
  pageIndex: number; //表格当前页数 1;
  pageSize: number; //图表默认每页展示数据条数10
  key: boolean = true; //是否处理加载分析对象
  _filterShow: boolean; //是否是自然来源
  downloadtable: any; //表格下载请求数据
  sort: any; //排序字段
  tableHeaders: any = this.sourceSnalysisappModel.tableHeaders; //图表headerconter
  constructor(
    private trafficSourcesService: trafficSourcesService,
    private injector: Injector,
    private Globals: Globals
  ) {
    super(injector);
  }
  ngOnInit() {
    this.key = true;
    this.filterShow = false;
    this.selectedTypeValue = '3';
    this.selectedIndex = 0;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.chartOption = {};
    this.sourceInformation = '';
    this.mediumInformation = '';
    this.campaignInformation = '';
    this.termInformation = '';
    this.contentInformation = '';
    this._filterShow = true;
    this.newData = [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()];
    this.searchTerms
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.changeData();
      });
    this._tabsChange
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap(() => {
          return this.chartData();
        })
      )
      .subscribe(
        (response: any) => {
          let that = this;
          if (response && response.success) {
            this.echartsLoading = false;
            this.load = true;
            let xAxis = response.data.date;
            if (xAxis && xAxis.length && response.data.series && response.data.series.length) {
              for (let i = 0; i < xAxis.length; i++) {
                xAxis[i] = format(new Date(xAxis[i]), 'MM/DD');
              }
              response.data.series.map((item: any) => {
                item['smooth'] = true;
              });
              this.chartOption = this.chartMergeReturnOption('lineBar', {
                series: response.data.series,
                xAxis: {
                  data: xAxis,
                  nameTextStyle: this.commonModel.xAxis.nameTextStyle
                },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    fontFamily: 'HelveticaNeue',
                    fontSize: 12,
                    color: '#80848F',
                    fontWeight: 'normal',
                    formatter: function(value: any) {
                      // if (that.tabsLists[that.selectedIndex].value == '_per_lauch') {
                      //   return that.Globals.toDecimal(value)
                      // } else
                      // tslint:disable-next-line:max-line-length
                      if (
                        that.tabsLists[that.selectedIndex].value == '_per_duration' ||
                        that.tabsLists[that.selectedIndex].value == '_per_launch_duration'
                      ) {
                        return that.Globals.formatSeconds(value);
                      } else {
                        return value;
                      }
                    }
                  }
                },
                grid: this.commonModel.grid,
                legend: this.commonModel.legend,
                tooltip:
                  this.tabsLists[this.selectedIndex].value == '_per_duration' ||
                  this.tabsLists[this.selectedIndex].value == '_per_launch_duration'
                    ? this.commonModel.tooltip(that, true)
                    : this.commonModel.tooltip(that)
              });
            } else {
              this.echartsLoading = true;
              this.chartOption = {};
              this.load = false;
            }
          } else {
            this.echartsLoading = true;
            this.chartOption = {};
            this.load = false;
          }
        },
        () => {
          this.echartsLoading = true;
          this.chartOption = {};
          this.load = false;
        }
      );
    this.changeData();
  }
  /**
   * 分析对象change
   * @param data
   */
  analyticTargetChange(data: any) {
    let nub: any = 0;
    data.forEach((cont: any) => {
      if (cont.checked) {
        nub++;
      }
    });
    if (nub == 1) {
      this.sourceSnalysisappModel.checkOptionsanalytic.forEach((cont: any, index: any) => {
        if (!cont.disabled && cont.type && cont.checked) {
          this.sourceSnalysisappModel.checkOptionsanalytic[index].disabled = true;
        }
      });
    } else {
      this.sourceSnalysisappModel.checkOptionsanalytic.forEach((cont: any, index: any) => {
        if (cont.disabled) {
          this.sourceSnalysisappModel.checkOptionsanalytic[index].disabled = false;
        }
        if (!cont.type) {
          this.sourceSnalysisappModel.checkOptionsanalytic[index].disabled = true;
        }
      });
    }
    this.checkOptionsanalytic = this.sourceSnalysisappModel.checkOptionsanalytic;
    this.key = false;
    let _checkOptionsanalytic: any = this.deepCopy(this.checkOptionsanalytic);
    this.searchTerms.next(_checkOptionsanalytic);
  }
  /**
   * 初始分析对象显示
   * @param data
   */
  analyticTarget(data: any) {
    for (let index = 0; index < data.length; index++) {
      if (!data[index].disabled) {
        this.sourceSnalysisappModel.checkOptionsanalytic[index].checked = true;
        this.sourceSnalysisappModel.checkOptionsanalytic[index].disabled = true;
        return;
      }
    }
  }
  /**
   * 日期组件change事件
   * @param data
   */
  dataChange(data: any) {
    this.key = false;
    this.newData = data;
    this.changeData();
  }
  /**
   * eCharts+table数据请求
   */
  async changeData() {
    if (this.key) {
      await this.profilers();
    }
    let _checkOptionsanalytic: any = this.deepCopy(this.checkOptionsanalytic);
    this._tabsChange.next(_checkOptionsanalytic);
    this._dataSet();
  }
  /**
   * 初始分析对象
   */
  profilers() {
    let parmes: any = {
      productid: localStorage.getItem('productId'),
      // status: 0,
      type: 1
    };
    return new Promise((resolve, reject) => {
      this.trafficSourcesService.checkCrowdName(parmes).subscribe((response: any) => {
        if (response && response.success && response.list && response.list.length) {
          for (let i = 0; i < response.list.length; i++) {
            this.sourceSnalysisappModel.checkOptionsanalytic.forEach((element: any, index: any) => {
              if (`_td_${response.list[i].name}` == element.value) {
                switch (response.list[i].status) {
                  case 0:
                    this.sourceSnalysisappModel.checkOptionsanalytic[index].disabled = false;
                    this.sourceSnalysisappModel.checkOptionsanalytic[index].type = true;
                    break;
                  case 1:
                    this.sourceSnalysisappModel.checkOptionsanalytic[index].disabled = true;
                    this.sourceSnalysisappModel.checkOptionsanalytic[index].type = false;
                    break;
                  default:
                    break;
                }
              }
            });
            switch (response.list[i].name) {
              case 'utm_source':
                this.source = response.list[i].status;
                break;

              case 'utm_campaign':
                this.campaign = response.list[i].status;

                break;

              case 'utm_medium':
                this.medium = response.list[i].status;

                break;

              case 'utm_term':
                this.term = response.list[i].status;

                break;

              case 'utm_content':
                this.content = response.list[i].status;

                break;

              default:
                break;
            }
          }
        }
        this.analyticTarget(this.sourceSnalysisappModel.checkOptionsanalytic);
        this.checkOptionsanalytic = this.sourceSnalysisappModel.checkOptionsanalytic;
        resolve();
      });
    });
  }
  /**
   * 来源类型select=>change
   * @param data
   */
  selectedTypeValuechange(data: any) {
    if (data && data == '2') {
      this._filterShow = false;
      this.filterShow = false;
      this.flowTrendName = '来源趋势';
    } else {
      this._filterShow = true;
      this.filterShow = false;
      this.flowTrendName = 'Top10来源趋势';
    }
    this.key = false;
    this.changeData();
  }
  /**
   * 推广渠道change
   * @param data
   */
  selectchanggesource(data: any) {
    this.sourceInformation = data;
  }
  /**
   * 推广媒介change
   * @param data
   */
  selectchanggemedium(data: any) {
    this.mediumInformation = data;
  }
  /**
   * 活动名称change
   * @param data
   */
  selectchanggecampaign(data: any) {
    this.campaignInformation = data;
  }
  /**
   * 关键词change
   * @param data
   */
  selectchanggeterm(data: any) {
    this.termInformation = data;
  }
  /**
   * 创意版本change
   * @param data
   */
  selectchanggecontent(data: any) {
    this.contentInformation = data;
  }
  /**
   * 条件筛选查询
   */
  demand() {
    this.key = false;
    this.changeData();
  }

  /**
   * 来源趋势tab=>change
   * @param index
   */
  tabsChange(index: any) {
    this.key = false;
    this.selectedIndex = index;
    this._tabsChange.next(this.selectedIndex);
  }
  /**
   * Top10渠道趋势线图请求
   */
  chartData() {
    let groupBy: any = [];
    this.checkOptionsanalytic.forEach((element: any) => {
      if (element.checked) {
        groupBy.push(element.value);
      }
    });
    let queryFilters: any = this._queryFilters();
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newData[0].getTime(),
      endDate: this.newData[1].getTime(),
      dicItemValue: this.tabsLists[this.selectedIndex].value,
      sourceType: Number(this.selectedTypeValue),
      sdkSource: 'miniprogram',
      topN: 10
    };
    if (Number(this.selectedTypeValue) !== 2) {
      parmes['groupBy'] = groupBy;
      parmes['queryFilters'] = queryFilters;
    }
    this.echartsLoading = true;
    this.load = true;
    return this.trafficSourcesService.customeCharts(parmes);
  }
  /**
   * 渠道明细数据下载
   */
  downloadData() {
    this.trafficSourcesService.download(this.downloadtable).subscribe(() => {});
  }
  /**
   *数据下载(a)
   */
  goPage(hash: string) {
    this.commonService.goPage(hash);
  }
  /**
   * 改变页码
   * 改变每页数量(true)
   * @param e
   */
  PageChange(e?: any) {
    if (e) {
      this.pageIndex = 1;
    }
  }
  /**
   * 表格排序
   * @param data
   */
  tableSort(data: any) {
    if (data && data.value) {
      this.sort = data;
      this._dataSet(true, data);
    } else {
      this.sort = {};
      this._dataSet();
    }
  }
  /**
   * 表格数据
   */
  _dataSet(type?: boolean, data?: any) {
    let groupBy: any = [];
    this.checkOptionsanalytic.forEach((cont: any) => {
      if (cont.checked) {
        groupBy.push(cont.value);
      }
    });
    let queryFilters: any = this._queryFilters();
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newData[0].getTime(),
      endDate: this.newData[1].getTime(),
      sourceType: Number(this.selectedTypeValue),
      sdkSource: 'miniprogram'
    };
    if (Number(this.selectedTypeValue) !== 2) {
      parmes['groupBy'] = groupBy;
      parmes['queryFilters'] = queryFilters;
    }
    if (type) {
      parmes['orderBy'] = data.key;
      parmes['order'] = data.value == 'descend' ? 'desc' : 'asc';
    } else if (this.sort && this.sort.value && this.sort.key) {
      parmes['orderBy'] = this.sort.key;
      parmes['order'] = this.sort.value == 'descend' ? 'desc' : 'asc';
    }
    this.downloadtable = parmes;
    this.loading = true;
    this.trafficSourcesService.customeTable(parmes).subscribe(
      (response: any) => {
        this.loading = true;
        if (response && response.success && response.data && response.data.length) {
          this.dataSet = response.data; //图表数据
          this.loading = false;
        } else {
          this.dataSet = [];
          this.loading = false;
        }
      },
      () => {
        this.dataSet = [];
        this.loading = false;
      }
    );
  }
  /**
   * 更多筛选条件
   */
  _queryFilters() {
    let queryFilters: any = [];
    // tslint:disable-next-line:max-line-length
    if (
      (this.sourceInformation && this.sourceInformation.length == 1 && this.sourceInformation !== '') ||
      this.sourceInformation.length > 1
    ) {
      queryFilters.push({
        clauses: 'and',
        eventFilter: true,
        filter: '_td_utm_source',
        operator: 'eq',
        values: this.sourceInformation
      });
    }
    // tslint:disable-next-line:max-line-length
    if (
      (this.mediumInformation && this.mediumInformation.length == 1 && this.mediumInformation !== '') ||
      this.mediumInformation.length > 1
    ) {
      queryFilters.push({
        clauses: 'and',
        eventFilter: true,
        filter: '_td_utm_medium',
        operator: 'eq',
        values: this.mediumInformation
      });
    }
    // tslint:disable-next-line:max-line-length
    if (
      (this.campaignInformation && this.campaignInformation.length == 1 && this.campaignInformation !== '') ||
      this.campaignInformation.length > 1
    ) {
      queryFilters.push({
        clauses: 'and',
        eventFilter: true,
        filter: '_td_utm_campaign',
        operator: 'eq',
        values: this.campaignInformation
      });
    }
    // tslint:disable-next-line:max-line-length
    if (
      (this.termInformation && this.termInformation.length == 1 && this.termInformation !== '') ||
      this.termInformation.length > 1
    ) {
      queryFilters.push({
        clauses: 'and',
        eventFilter: true,
        filter: '_td_utm_term',
        operator: 'eq',
        values: this.termInformation
      });
    }
    // tslint:disable-next-line:max-line-length
    if (
      (this.contentInformation && this.contentInformation.length == 1 && this.contentInformation !== '') ||
      this.contentInformation.length > 1
    ) {
      queryFilters.push({
        clauses: 'and',
        eventFilter: true,
        filter: '_td_utm_content',
        operator: 'eq',
        values: this.contentInformation
      });
    }
    return queryFilters;
  }
  /**
   * 表格页面到详情
   */
  tableClick(data: any) {
    let cont = {
      type: this.selectedTypeValue, //全部还是另外两个
      date: [this.newData[0].getTime(), this.newData[1].getTime()],
      source: 'App', //H5,Web,App
      filter: this.filterShow, //过滤条件
      checkOption: this.checkOptionsanalytic, //分析对象
      data: data, //当条数据
      analysisObject: {
        _td_utm_source: [
          {
            type: this.source,
            cont: this.sourceInformation
          }
        ],
        _td_utm_medium: [
          {
            type: this.medium,
            cont: this.mediumInformation
          }
        ],
        _td_utm_campaign: [
          {
            type: this.campaign,
            cont: this.campaignInformation
          }
        ],
        _td_utm_term: [
          {
            type: this.term,
            cont: this.termInformation
          }
        ],
        _td_utm_content: [
          {
            type: this.content,
            cont: this.contentInformation
          }
        ]
      }
    };
    localStorage.setItem('trafficSources', JSON.stringify(cont));
    this.goInto({
      name: '流量来分析详情',
      url: '/traffic-sources/list'
    });
  }
  ngOnDestroy() {
    this.searchTerms.unsubscribe();
    this._tabsChange.unsubscribe();
  }
}
