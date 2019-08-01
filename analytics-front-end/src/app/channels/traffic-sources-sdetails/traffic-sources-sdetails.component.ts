import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { trafficSourcesSdetailsModel } from './traffic-sources-sdetails.model';
import { commonModel } from '../common/commom.model';
import { EChartOption } from 'echarts';
import { BaseComponent } from '../../common/base-component';
import { trafficSourcesSdetailsService } from './traffic-sources-sdetails.service';
import { format } from 'date-fns';
import { Globals } from '../../utils/globals';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'traffic-sources-sdetailsComponent',
  templateUrl: './traffic-sources-sdetails.component.html',
  styleUrls: ['./traffic-sources-sdetails.component.less']
})
export class trafficSourcesSdetailsComponent extends BaseComponent implements OnInit, OnChanges {
  searchTerms = new Subject<string>();
  trafficSourcesSdetailsModel: trafficSourcesSdetailsModel = new trafficSourcesSdetailsModel();
  commonModel: commonModel = new commonModel();
  chartOption: EChartOption;

  newDate: any; //当前日期
  sdetailsSelectedValue: any; //来源下拉框绑定值
  _longRangeSearch: boolean = true; //远程搜索加载数据  true:不加载  false:加载
  channelSearch: any = []; //来源select搜索数据
  listOfOptionSearch: any = []; //select远程数据加载
  channelSearchloading: boolean = true; //来源数据搜索加载
  listOfOptionList: any; //下拉框数据总数
  longRangeSearchLoading: boolean = true; //select是否显示loading
  source: boolean; //推广渠道
  medium: boolean; //推广媒介
  campaign: boolean; //活动名称
  term: boolean; //关键词
  content: boolean; //创意版本
  sourceInformation: any; //推广渠道当前值
  mediumInformation: any; //推广媒介当前值
  campaignInformation: any; //活动名称当前值
  termInformation: any; //关键词当前值
  contentInformation: any; //创意版本当前值
  filterShow: boolean; //更多筛选显示条件
  checkOption: any; //带过来的分析对象
  overviewlosding: boolean; //数据概览的loading效果
  tendency: any; //线图title=>来源趋势;Top10渠道趋势
  selectedIndex: number; //标签页第几个
  echartsLoading: boolean = false; //echarts加载过程+无数据
  load: boolean; //echarts加载+无数据
  dataSet: any = []; //图表数据
  loading: boolean = false; //图表数据加载loading
  pageIndex: number; //表格当前页数 1;
  pageSize: number; //图表默认每页展示数据条数
  overviewOptions: any = {}; //数据概览数据
  dataoverviews: any = this.trafficSourcesSdetailsModel.dataoverviews; //数据概览提示语
  tabsLists: any = this.trafficSourcesSdetailsModel.tabsLists;
  tableHeaders: any = this.trafficSourcesSdetailsModel.tableHeaders;
  totalData: any; //线图+表格数据
  selectkey: boolean; //来源中是否含有已有值
  type: number; //是否自然来源
  _source: any; //tab跳转页面
  firstselectValue: any; //上一个页面对应下拉框的返现值
  trafficPresetData: any; //流量页面到详情页的保存数据
  page: number; //来源数据页数
  constructor(
    private injector: Injector,
    private trafficSourcesSdetailsService: trafficSourcesSdetailsService,
    private Globals: Globals
  ) {
    super(injector);
    this.trafficPresetData = JSON.parse(localStorage.getItem('trafficSources'));
    //是否是自然来源
    this.type = this.trafficPresetData && this.trafficPresetData.type;
    //流量来源=来源
    // tslint:disable-next-line:max-line-length
    localStorage.setItem(
      'teafficIndex',
      JSON.parse(localStorage.getItem('trafficSources')) ? JSON.parse(localStorage.getItem('trafficSources')).source : 0
    );
    //分析对象
    this.checkOption = this.trafficPresetData ? this.trafficPresetData.checkOption : [];
    //来源H5,Web,App
    // tslint:disable-next-line:max-line-length
    this._source = this.trafficPresetData
      ? this.trafficPresetData.source == 'App'
        ? 'miniprogram'
        : this.trafficPresetData.source
      : 'H5';
    //筛选条件状态
    this.filterShow = this.trafficPresetData ? this.trafficPresetData.filter : false;
    //当前日期
    // tslint:disable-next-line:max-line-length
    this.newDate = this.trafficPresetData
      ? [new Date(this.trafficPresetData.date[0]), new Date(this.trafficPresetData.date[1])]
      : [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()];
    //当前传入来源数据
    this.firstselectValue = this.trafficPresetData ? this.trafficPresetData.data : false;
    this.sdetailsSelectedValue = this.firstselectValue ? this.firstselectValue.utmOriginal : null;
    //推广渠道
    this.source = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_source[0].type : false;
    this.sourceInformation = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_source[0].cont : '';
    // 推广媒介
    this.campaign = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_campaign[0].type : false;
    // tslint:disable-next-line:max-line-length
    this.campaignInformation = this.trafficPresetData
      ? this.trafficPresetData.analysisObject._td_utm_campaign[0].cont
      : '';
    // 活动名称
    this.medium = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_medium[0].type : false;
    this.mediumInformation = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_medium[0].cont : '';
    // 关键词
    this.term = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_term[0].type : false;
    this.termInformation = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_term[0].cont : '';
    // 创意版本
    this.content = this.trafficPresetData ? this.trafficPresetData.analysisObject._td_utm_content[0].type : false;
    // tslint:disable-next-line:max-line-length
    this.contentInformation = this.trafficPresetData
      ? this.trafficPresetData.analysisObject._td_utm_content[0].cont
      : '';
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
    this._change();
  }
  ngOnInit() {
    this.tendency = '来源趋势';
    this.selectedIndex = 0;
    this.chartOption = {};
    this.pageIndex = 1;
    this.pageSize = 10;
    this.page = 1;
    this.selectkey = false;
    this.sdetailsSelecteds();
    this.overviewOptions = {
      title: '数据概览',
      popover: this.trafficSourcesSdetailsModel.dataoverviews
    };
    this._change();
    this.searchTerms
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this._DetailsSearchChange(term);
      });
  }
  ngOnChanges() {}
  /**
   * 日期组件change事件
   * @param data
   */
  dataChange(data: any) {
    this.newDate = data;
    this._change();
  }
  /**
   * 页面数据请求
   */
  _change() {
    this.chartData();
    this.dataOverview();
  }
  /**
   * Top10渠道趋势线图请求
   */
  chartData() {
    let queryFilters: any = this._queryFilters();
    let groupBy: any = this._checkOption();
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      queryFilters: queryFilters,
      sdkSource: this._source,
      groupBy: groupBy,
      utmOriginal: this.sdetailsSelectedValue ? this.sdetailsSelectedValue : null
    };
    this.load = true;
    this.echartsLoading = true;
    this.loading = true;
    this.trafficSourcesSdetailsService.customeCharts(parmes).subscribe(
      (response: any) => {
        if (response && response.success && response.data) {
          this.echartsLoading = false;
          this.load = false;
          this.totalData = response.data;
          this.echartsrendering(this.totalData);
          this.Tablerendering(this.totalData);
        } else {
          this.loading = false;
          this.dataSet = [];
          this.echartsLoading = true;
          this.chartOption = {};
          this.load = false;
        }
      },
      () => {
        this.loading = false;
        this.dataSet = [];
        this.echartsLoading = true;
        this.chartOption = {};
        this.load = false;
      }
    );
  }
  /**
   * 数据概览
   */
  dataOverview() {
    this.overviewlosding = true;
    let queryFilters: any = this._queryFilters();
    let groupBy: any = this._checkOption();
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      utmOriginal: this.sdetailsSelectedValue ? this.sdetailsSelectedValue : null,
      queryFilters: queryFilters,
      sdkSource: this._source,
      groupBy: groupBy
    };
    this.trafficSourcesSdetailsService.surveyData(parmes).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.overview(response.data);
          this.overviewlosding = false;
        } else {
          this.overview({});
          this.overviewlosding = false;
        }
      },
      () => {
        this.overview({});
        this.overviewlosding = false;
      }
    );
  }
  /**
   * 分析对象条件
   */
  _checkOption() {
    let Option: any = [];
    if (this.checkOption && this.checkOption.length) {
      this.checkOption.forEach((element: any) => {
        if (element.checked) {
          Option.push(element.value);
        }
      });
    }
    return Option;
  }
  /*
   * 筛选条件拼接
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
   * 数据概览
   */
  overview(cont: any) {
    let _overviewOptions: Object;
    _overviewOptions = {
      title: '数据概览',
      popover: this.trafficSourcesSdetailsModel.dataoverviews
    };
    if (cont && JSON.stringify(cont) !== '{}') {
      _overviewOptions['data'] = [
        {
          label: '新访用户数',
          value: cont.newAdd
        },
        {
          label: '访问用户数',
          value: cont.active
        },
        {
          label: '人均访问次数',
          value: cont.launchAvg
        },
        {
          label: '人均停留时长',
          value: cont.durationAvg
        },
        {
          label: this._source && this._source == 'miniprogram' ? '次均停留时长' : '单次停留时长',
          value: cont.durationPer
        },
        {
          label: '累计访客数',
          value: cont.total
        }
      ];
    }
    this.overviewOptions = _overviewOptions;
  }
  /**
   * 渠道select文本框值变化时回调
   */
  _DetailsSearchChange(data) {
    this.channelSearchloading = true;
    this._longRangeSearch = false;
    let queryFilters: any = this._queryFilters();
    let groupBy: any = this._checkOption();
    let parme = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      queryFilters: queryFilters,
      sdkSource: this._source,
      groupBy: groupBy,
      search: data,
      page: 1,
      rows: 500
    };
    this.trafficSourcesSdetailsService.checkCrowdName(parme).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.listOfOptionList = response.list[1].total;
          if (this.listOfOptionList) {
            let length = response.list[0].length;
            let lists = [];
            for (let i = 0; i < length; i++) {
              lists.push({
                value: response.list[0][i].id,
                label: response.list[0][i].lable
              });
            }
            this.channelSearchloading = false;
            this.channelSearch = lists;
          } else {
            this.channelSearchloading = false;
            this.channelSearch = [];
          }
        } else {
          this.channelSearchloading = false;
          this.channelSearch = [];
        }
      },
      () => {
        this.channelSearchloading = false;
        this.channelSearch = [];
      }
    );
  }
  /**
   * 渠道select文本框值变化时回调
   * @param data
   */
  DetailsSearchChange(data: any) {
    this.channelSearch = [];
    data = this.trim(data);
    if (data) {
      this.searchTerms.next(data);
    } else {
      this._longRangeSearch = true;
    }
  }
  /**
   * 渠道下拉框下拉菜单变化
   * @param key
   */
  close(key: any) {
    if (!key) {
      this.channelSearch = [];
    }
  }
  /**
   * 渠道selsect到底部回调
   */
  scrollToBottom() {
    if (this.longRangeSearchLoading) {
      this.page = this.page + 1;
      this.sdetailsSelecteds(true);
    }
  }
  /**
   * selsectchange函数
   * @param data
   */
  DetailsSearchValueChange(data: any) {
    this.selectkey = true;
    if (this.listOfOptionSearch[0].type == 'add') {
      this.listOfOptionSearch.splice(0, 1);
    }
    // data = data && data !== '' ? data : null;
    this.sdetailsSelectedValue = data;
    this._change();
  }
  /**
   * 渠道下拉框赋值
   */
  sdetailsSelecteds(loading: boolean = false) {
    let queryFilters: any = this._queryFilters();
    let groupBy: any = this._checkOption();
    if (!loading) {
      this.listOfOptionSearch = [];
    }
    this.listOfOptionList = 0;
    let parme = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      queryFilters: queryFilters,
      sdkSource: this._source,
      groupBy: groupBy,
      page: this.page,
      rows: 20
    };
    this.trafficSourcesSdetailsService.checkCrowdName(parme).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.listOfOptionList = response.list[1].total;
          if (this.listOfOptionList) {
            let length = response.list[0].length;
            let lists = [];
            for (let i = 0; i < length; i++) {
              if (this.firstselectValue && response.list[0][i].id == this.firstselectValue.utmOriginal) {
                this.selectkey = true;
              }
              lists.push({
                value: response.list[0][i].id ? response.list[0][i].id : '',
                label: response.list[0][i].lable
              });
            }
            // if (this.firstselectValue && !this.firstselectValue.utmOriginal) {
            //   this.listOfOptionSearch[0].value = '';
            // }
            if (this.selectkey) {
              this.listOfOptionSearch = [...this.listOfOptionSearch, ...lists];
              if (this.listOfOptionSearch[0].type == 'add') {
                this.listOfOptionSearch.splice(0, 1);
              }
              // tslint:disable-next-line:max-line-length
              this.sdetailsSelectedValue = this.firstselectValue.utmOriginal ? this.firstselectValue.utmOriginal : '';
            } else {
              if (this.firstselectValue) {
                let addData = {
                  value: this.firstselectValue.utmOriginal ? this.firstselectValue.utmOriginal : '',
                  label: this.firstselectValue.utmDisplay,
                  type: 'add'
                };
                this.firstselectValue = Object.assign(this.firstselectValue, addData);
                lists.unshift(this.firstselectValue);
              }
              this.listOfOptionSearch = [...this.listOfOptionSearch, ...lists];
              this.sdetailsSelectedValue = this.listOfOptionSearch[0].value ? this.listOfOptionSearch[0].value : '';
            }
            if (this.page == 1 && Number(this.type) !== 1 && this.firstselectValue.utmOriginal) {
              this.listOfOptionSearch.unshift({
                value: '',
                label: '自然来源'
              });
              this.listOfOptionList = this.listOfOptionList + 1;
            }

            if (this.listOfOptionSearch && this.listOfOptionSearch.length >= this.listOfOptionList) {
              this.longRangeSearchLoading = false;
            } else {
              this.longRangeSearchLoading = true;
            }
          } else {
            this.longRangeSearchLoading = false;
            this.listOfOptionSearch = [];
            this.sdetailsSelectedValue = null;
          }
        }
      },
      () => {
        this.sdetailsSelectedValue = null;
        this.longRangeSearchLoading = false;
        this.listOfOptionSearch = [];
      }
    );
  }
  /**
   *渠道趋势tabschannge
   * @param data
   */
  tabsChange(data: any) {
    this.load = true;
    this.echartsLoading = true;
    this.echartsrendering(this.totalData);
  }
  /**
   * 线图渲染
   * @param cont
   */
  echartsrendering(cont: any) {
    if (cont) {
      switch (this.tabsLists[this.selectedIndex].value) {
        case '_td_firstUse':
          this.rendering(cont['newAdd']);

          break;
        case '_td_launch':
          this.rendering(cont['active']);

          break;
        case '_per_lauch':
          this.rendering(cont['launchAvg']);

          break;
        case '_per_duration':
          this.rendering(cont['durationAvg'], '_per_duration');

          break;
        case '_per_launch_duration':
          this.rendering(cont['durationPer'], '_per_launch_duration');
          break;
        default:
          break;
      }
    }
  }
  /**
   * table渲染
   */
  Tablerendering(cont: any) {
    if (cont['tableData'] && cont['tableData'].length) {
      cont['tableData'] = cont['tableData'].filter((item: any) => {
        item.date = format(new Date(item.date), 'YYYY-MM-DD');
        item.durationAvg = this.Globals.formatSeconds(item.durationAvg);
        item.durationPer = this.Globals.formatSeconds(item.durationPer);
        return item;
      });
      this.dataSet = cont['tableData'];
      this.loading = false;
    } else {
      this.dataSet = [];
      this.loading = false;
    }
  }

  /**
   * 渲染
   * @param cont
   */
  rendering(cont: any, type?: any) {
    let _that = this;
    let xAxis = cont.date;
    let series = cont.series;
    if (xAxis && xAxis.length && series && series.length) {
      for (let i = 0; i < xAxis.length; i++) {
        xAxis[i] = format(new Date(xAxis[i]), 'MM/DD');
      }
      cont.series.map((item: any) => {
        item['smooth'] = true;
      });
      this.chartOption = this.chartMergeReturnOption('lineBar', {
        series: cont.series,
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
                _that.tabsLists[_that.selectedIndex].value == '_per_duration' ||
                _that.tabsLists[_that.selectedIndex].value == '_per_launch_duration'
              ) {
                return _that.Globals.formatSeconds(value);
              } else {
                return value;
              }
            }
          }
        },
        grid: this.commonModel.grid,
        legend: this.commonModel.legend,
        tooltip:
          type == '_per_duration' || type == '_per_launch_duration'
            ? this.commonModel.tooltip(_that, true)
            : this.commonModel.tooltip(_that)
      });
      this.load = false;
      this.echartsLoading = false;
    } else {
      this.echartsLoading = true;
      this.chartOption = {};
      this.load = false;
    }
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
   * 渠道明细数据下载
   */
  downloadData() {
    let queryFilters: any = this._queryFilters();
    let groupBy: any = this._checkOption();
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      queryFilters: queryFilters,
      sdkSource: this._source,
      groupBy: groupBy,
      utmOriginal: this.sdetailsSelectedValue ? this.sdetailsSelectedValue : null
    };
    this.trafficSourcesSdetailsService.download(parmes).subscribe(() => {});
  }
  goPage(hash: string) {
    this.commonService.goPage(hash);
  }
  ngOnDestroy() {
    localStorage.removeItem('trafficSources');
    if ((window.location.hash.slice(1) || '/') !== '/traffic-sources') {
      localStorage.setItem('teafficIndex', 'H5');
    }
  }
}
