import { Component, Injector, OnInit } from '@angular/core';
import { subcontractChannelsService } from './subcontract-channels.service';
import { BaseComponent } from '../../common/base-component';
import { subcontractChannelsModel } from './subcontract-channels.model';
import { commonModel } from './../common/commom.model';
import { format } from 'date-fns';
import { EChartOption } from 'echarts';
import { Globals } from './../../../../src/app/utils/globals';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'subcontract-channel',
  templateUrl: './subcontract-channels.component.html',
  styleUrls: ['./subcontract-channelst.component.less']
})
export class subcontractChannelsComponent extends BaseComponent implements OnInit {
  searchTerms = new Subject<string>();
  subcontractChannelsModel: subcontractChannelsModel = new subcontractChannelsModel();
  commonModel: commonModel = new commonModel();
  chartOption: EChartOption;

  constructor(
    private subcontractChannelsService: subcontractChannelsService,
    private injector: Injector,
    private Globals: Globals
  ) {
    super(injector);
  }
  tabsLists: any = this.subcontractChannelsModel.tabsLists; //Top10渠道趋势标签页数据
  popovers: any = this.subcontractChannelsModel.popovers; //渠道趋势tootip里面的内容
  details: any = this.subcontractChannelsModel.details; //明细tootip里面的内容
  tableHeaders: any = this.subcontractChannelsModel.tableHeaders; //图表headerconter
  selectedIndex: number; //标签页第几个
  startDate: any; //开始日期
  endDate: any; //结束日期
  selectValue: any = []; //当前筛选条件
  loading = false; //图表数据加载loading
  pageIndex: number; //表格当前页数 1;
  pageSize: number; //图表默认每页展示数据条数10
  dataSet: any = []; //图表数据
  _searchText: any = ''; //渠道明细搜索数据
  echartsLoading: boolean; //echarts加载+无数据
  load: boolean; //echarts加载+无数据
  sort: any; //排序数据
  downTable: any; //下载请求数据
  ngOnInit() {
    this.selectValue = [''];
    this.selectedIndex = 0;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.chartOption = {};
    this.startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).getTime();
    this.endDate = new Date().getTime();
    this.searchTerms
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
                  // axisTick: this.commonModel.xAxis.axisTick,
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
    this.change();
  }
  /**
   * 日期组件change事件
   * @param data
   */
  dataChange(data: any) {
    this.startDate = data[0].getTime();
    this.endDate = data[1].getTime();
    this.change();
  }
  /**
   * select组件change
   * @param data
   */
  selectchangge(data: any) {
    this.selectValue = data;
    this.change();
  }
  /**
   * 线图+表格加载
   */
  change() {
    this.selectValue = this.deepCopy(this.selectValue);
    this.searchTerms.next(this.selectValue);
    this._dataSet();
  }
  /**
   *渠道趋势tabschannge
   * @param data
   */
  tabsChange(data: any) {
    let _selectedIndex: any = this.deepCopy(this.selectedIndex);
    this.searchTerms.next(_selectedIndex);
  }

  /**
   * Top10渠道趋势线图请求
   */
  chartData() {
    this.echartsLoading = true;
    this.load = true;
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.startDate,
      endDate: this.endDate,
      queryFilters: this._queryFilters(),
      dicItemValue: this.tabsLists[this.selectedIndex].value,
      topN: 10
    };

    return this.subcontractChannelsService.customeCharts(parmes);
  }
  /**
   * 表格数据
   */
  _dataSet(type?: boolean, data?: any) {
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.startDate,
      endDate: this.endDate,
      queryFilters: this._queryFilters()
    };
    if (type) {
      parmes['orderBy'] = data.key;
      parmes['order'] = data.value == 'descend' ? 'desc' : 'asc';
    } else if (this.sort && this.sort.value && this.sort.key) {
      parmes['orderBy'] = this.sort.key;
      parmes['order'] = this.sort.value == 'descend' ? 'desc' : 'asc';
    }
    this.downTable = parmes;
    this.loading = true;
    this.subcontractChannelsService.customeTable(parmes).subscribe(
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
  /*
   * 筛选条件拼接
   */
  _queryFilters() {
    let queryFilters: any = [];
    // tslint:disable-next-line:max-line-length
    if (
      (this.selectValue && this.selectValue.length == 1 && this.selectValue[0] !== '') ||
      (this.selectValue && this.selectValue.length > 1)
    ) {
      queryFilters.push({
        clauses: 'and',
        eventFilter: false,
        filter: '_td_crowd',
        operator: 'eq',
        values: this.selectValue
      });
    }
    return queryFilters;
  }
  /**
   * 渠道明细数据下载
   */
  downloadData() {
    this.subcontractChannelsService.download(this.downTable).subscribe(() => {});
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
   * 搜索enter搜索
   * @param obj
   */
  enterKeyword(obj: any) {
    // obj = encodeURIComponent(this.trim(obj.target.value));
  }
  /**
   *渠道明细数据搜索
   */
  searchData(obj: any) {
    // obj = encodeURIComponent(this.trim(obj.target.value));
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
   * 表格页面到详情
   */
  tableClick(data: any) {
    let cont = {
      date: [this.startDate, this.endDate],
      data: data
    };
    if (this.selectValue && this.selectValue.length == 1 && this.selectValue[0] !== '') {
      cont['selset'] = this.selectValue;
    }
    localStorage.setItem('subcontractChannels', JSON.stringify(cont));
    this.goInto({
      name: '渠道详情',
      url: '/subcontract-channels/list'
    });
  }
  ngOnDestroy() {
    this.searchTerms.unsubscribe();
  }
}
