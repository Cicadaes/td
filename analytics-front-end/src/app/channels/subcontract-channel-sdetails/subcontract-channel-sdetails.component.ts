import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { subcontractChannelSdetailsModel } from './subcontract-channel-sdetails.model';
import { commonModel } from './../common/commom.model';
import { EChartOption } from 'echarts';
import { BaseComponent } from '../../common/base-component';
import { subcontractChannelsSdetailsService } from './subcontract-channel-sdetails.service';
import { format } from 'date-fns';
import { Globals } from './../../../../src/app/utils/globals';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: 'subcontract-channel-sdetails',
  templateUrl: './subcontract-channel-sdetails.component.html',
  styleUrls: ['./subcontract-channel-sdetails.component.less']
})
export class SubcontractChannelSdetailsComponent extends BaseComponent implements OnInit, OnChanges {
  searchTerms = new Subject<string>(); //渠道搜索
  _etentionRendering = new Subject<string>(); //留存用户change
  subcontractChannelSdetailsModel: subcontractChannelSdetailsModel = new subcontractChannelSdetailsModel();
  commonModel: commonModel = new commonModel();
  chartOption: EChartOption;
  channelAnalysis: any; //分包渠道跳转过来的数据
  sdetailsSelectedValue: any; //人群下拉框绑定值
  _longRangeSearch: boolean = true; //远程搜索加载数据  true:不加载  false:加载
  channelSearch: any = []; //渠道select搜索数据
  channelSearchloading: boolean = true; //远程搜索无数据
  listOfOptionSearch: any = []; //select远程数据加载
  listOfOptionList: any; //下拉框数据总数
  longRangeSearchLoading: boolean = true; //select是否显示loading
  tendency: any; //线图title=>渠道趋势;Top10渠道趋势
  selectedIndex: number; //标签页第几个
  echartsLoading: boolean; //echarts加载过程+无数据
  load: boolean; //echarts加载过程+无数据
  channelValue: any = '_td_firstUse'; //留存tab条件
  dataSet: any = []; //图表数据
  loading: boolean = false; //图表数据加载loading
  pageIndex: number; //表格当前页数 1;
  pageSize: number; //图表默认每页展示数据条数
  overviewOptions: any = {};
  selectValue: any; //当前人群筛选器的值
  firstselectValue: Object; //上一个页面对应下拉框的返现值
  dataoverviews: any = this.subcontractChannelSdetailsModel.dataoverviews; //数据概览提示语
  overviewlosding: boolean;
  newDate: any; //当前日期
  tabsLists: any = this.subcontractChannelSdetailsModel.tabsLists;
  tableHeaders: any = this.subcontractChannelSdetailsModel.tableHeaders;
  echartsIntance: any; //echarts加载过程loading
  totalData: any; //线图+表格数据
  selectkey: boolean; //渠道中是否含有已有值
  retentiontootip: any = this.subcontractChannelSdetailsModel.retention; //留存率tootip
  _retentionTable: any = []; //留存率数据
  retentionloading: boolean; //图表数据加载loading
  page: number; //渠道默认页数
  constructor(
    private Injector: Injector,
    private subcontractChannelsSdetailsService: subcontractChannelsSdetailsService,
    private Globals: Globals
  ) {
    super(Injector);
    this.channelAnalysis = JSON.parse(localStorage.getItem('subcontractChannels'));
    // tslint:disable-next-line:max-line-length
    if (
      this.channelAnalysis &&
      this.channelAnalysis.date &&
      this.channelAnalysis.date[0] &&
      this.channelAnalysis.date[1]
    ) {
      this.newDate = [new Date(this.channelAnalysis.date[0]), new Date(this.channelAnalysis.date[1])];
    } else {
      this.newDate = [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()];
    }
    if (this.channelAnalysis && this.channelAnalysis.selset) {
      if (this.channelAnalysis.selset) {
        this.selectValue = this.channelAnalysis.selset;
      } else {
        this.selectValue = [''];
      }
    }
    // tslint:disable-next-line:max-line-length
    this.sdetailsSelectedValue =
      this.channelAnalysis && this.channelAnalysis.data && this.channelAnalysis.data.channelId
        ? this.channelAnalysis.data.channelId
        : '';
  }
  ngOnInit() {
    this.tendency = '渠道趋势';
    this.selectedIndex = 0;
    this.chartOption = {};
    this.pageIndex = 1;
    this.pageSize = 10;
    this.page = 1;
    this.selectkey = false;
    this.sdetailsSelecteds();
    this.overviewOptions = {
      title: '数据概览',
      popover: this.subcontractChannelSdetailsModel.dataoverviews
    };
    this.searchTerms
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this._DetailsSearchChange(term);
      });
    this._etentionRendering
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap(() => {
          return this.etentionRendering();
        })
      )
      .subscribe(
        (response: any) => {
          if (response && response.success) {
            let data = response.data;
            this._retentionTable = data;
            this.retentionloading = false;
          } else {
            this.retentionloading = false;
            this._retentionTable = [];
          }
        },
        () => {
          this.retentionloading = false;
          this._retentionTable = [];
        }
      );
    this.change();
  }
  ngOnChanges() {}
  /**
   * 日期组件change事件
   * @param data
   */
  dataChange(data: any) {
    this.newDate = data;
    this.change(this.newDate);
  }
  /**
   * 人群筛选器change
   * @param data
   */
  selectchangge(data: any) {
    this.selectValue = data;
    this.change(data);
  }
  /**
   * 数据概览
   */
  overview(cont: any) {
    let _overviewOptions: Object;
    _overviewOptions = {
      title: '数据概览',
      popover: this.subcontractChannelSdetailsModel.dataoverviews
    };
    if (cont && JSON.stringify(cont) !== '{}') {
      _overviewOptions['data'] = [
        {
          label: '新增用户数',
          value: cont.newAdd
        },
        {
          label: '活跃用户数',
          value: cont.active
        },
        {
          label: '人均启动次数',
          value: cont.launchAvg
        },
        {
          label: '人均使用时长',
          value: cont.durationAvg
        },
        {
          label: '单次使用时长',
          value: cont.durationPer
        },
        {
          label: '累计用户数',
          value: cont.total
        }
      ];
    }
    this.overviewOptions = _overviewOptions;
  }
  /**
   * 数据概览
   */
  dataOverview() {
    this.overviewlosding = true;
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      channelId: this.sdetailsSelectedValue,
      queryFilters: this._queryFilters()
    };
    this.subcontractChannelsSdetailsService.surveyData(parmes).subscribe((response: any) => {
      if (response && response.success) {
        this.overview(response.data);
        this.overviewlosding = false;
      } else {
        this.overview(false);
        this.overviewlosding = false;
      }
    });
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
      queryFilters = [
        {
          clauses: 'and',
          eventFilter: false,
          filter: '_td_crowd',
          operator: 'eq',
          values: this.selectValue
        }
      ];
    }
    return queryFilters;
  }
  /**
   * 渠道select文本框值变化时回调
   */
  _DetailsSearchChange(data) {
    this.channelSearchloading = true;
    this._longRangeSearch = false;
    let parme = {
      cubeId: 296,
      dicKey: '_td_channel',
      product_id: localStorage.getItem('productId'),
      dicItemValue: data,
      page: 1,
      pageSize: 500
    };
    this.subcontractChannelsSdetailsService.checkCrowdName(parme).subscribe((response: any) => {
      if (response && response.success) {
        let length = response.data.length;
        if (length) {
          let lists = [];
          for (let i = 0; i < length; i++) {
            lists.push({
              value: response.data[i].id,
              label: response.data[i].dicItemValue
            });
          }
          this.channelSearch = lists;
        } else {
          this.channelSearchloading = false;
          this.channelSearch = [];
        }
      } else {
        this.channelSearchloading = false;
        this.channelSearch = [];
      }
    });
  }
  /**
   * 渠道select文本框值变化时回调
   * @param data
   */
  DetailsSearchChange(data: any) {
    this.channelSearch = [];
    data = data.trim();
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
    this.sdetailsSelectedValue = data;
    this.change(this.sdetailsSelectedValue);
  }
  /**
   * 渠道下拉框赋值
   */
  async sdetailsSelecteds(loading: boolean = false) {
    if (!loading) {
      this.listOfOptionSearch = [];
      await this.channelstoQuery();
    }
    this.listOfOptionList = 0;
    let parme = {
      page: loading ? this.page : 1,
      pageSize: 20,
      product_id: localStorage.getItem('productId'),
      cubeId: 296,
      dicKey: '_td_channel',
      status: 1
    };
    this.subcontractChannelsSdetailsService.checkCrowdName(parme).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.listOfOptionList = response.total;
          if (this.listOfOptionList) {
            let length = response.data.length;
            let lists = [];
            for (let i = 0; i < length; i++) {
              if (response.data[i].id == this.sdetailsSelectedValue) {
                this.selectkey = true;
              }
              lists.push({
                value: response.data[i].id,
                label: response.data[i].dicItemValue
              });
            }
            if (this.selectkey) {
              this.listOfOptionSearch = [...this.listOfOptionSearch, ...lists];
              if (this.listOfOptionSearch[0].type == 'add') {
                this.listOfOptionSearch.splice(0, 1);
              }
              this.sdetailsSelectedValue = Number(this.sdetailsSelectedValue);
            } else {
              if (Object.keys(this.firstselectValue).length !== 0) {
                lists.unshift(this.firstselectValue);
              }
              this.listOfOptionSearch = [...this.listOfOptionSearch, ...lists];
              this.sdetailsSelectedValue = this.listOfOptionSearch[0].value;
            }
            if (this.listOfOptionSearch && this.listOfOptionSearch.length >= this.listOfOptionList) {
              this.longRangeSearchLoading = false;
            } else {
              this.longRangeSearchLoading = true;
            }
          } else {
            this.sdetailsSelectedValue = null;
            this.longRangeSearchLoading = false;
            this.listOfOptionSearch = [];
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
   * 渠道查询id
   */
  channelstoQuery() {
    return new Promise((resolve, reject) => {
      let param = {
        productId: localStorage.getItem('productId'),
        id: this.sdetailsSelectedValue ? this.sdetailsSelectedValue : '',
        itemKey: '_td_channel'
      };
      this.subcontractChannelsSdetailsService.dicItem(param).subscribe(
        data => {
          if (data && data.success) {
            let cont = { value: data.list.id, label: data.list.name, type: 'add' };
            this.firstselectValue = cont;
          } else {
            this.firstselectValue = {};
          }
          resolve();
        },
        () => {
          this.firstselectValue = {};
          reject();
        }
      );
    });
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
   * 数据渲染
   */
  change(data: any = '') {
    this.dataOverview();
    this.chartData();
    // this.etentionRendering();
    data = this.deepCopy(data);
    this._etentionRendering.next(data);
  }

  /**
   * Top10渠道趋势线图请求
   */
  chartData() {
    this.echartsLoading = true;
    this.load = true;
    this.loading = true;
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      channelId: this.sdetailsSelectedValue,
      queryFilters: this._queryFilters()
    };
    this.subcontractChannelsSdetailsService.customeCharts(parmes).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.echartsLoading = false;
          this.loading = false;
          this.totalData = response.data;
          this.echartsrendering(this.totalData);
          this.Tablerendering(this.totalData);
        } else {
          this.echartsLoading = true;
          this.load = false;
          this.chartOption = {};
          this.loading = false;
          this.dataSet = [];
        }
      },
      () => {
        this.echartsLoading = true;
        this.load = false;
        this.chartOption = {};
        this.loading = false;
        this.dataSet = [];
      }
    );
  }
  /**
   * 线图渲染1
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
   * 留存渲染
   */
  etentionRendering() {
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      channelId: this.sdetailsSelectedValue,
      queryFilters: this._queryFilters(),
      dicItemValue: this.channelValue
    };
    this.retentionloading = true;
    return this.subcontractChannelsSdetailsService.etentionRendering(parmes);
  }
  /**
   * 留存change
   * @param data
   */
  channelValueChange(data: any) {
    this._etentionRendering.next(data);
  }

  /**
   * 线图渲染2
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
      series.map((item: any) => {
        item['smooth'] = true;
      });
      this.chartOption = this.chartMergeReturnOption('lineBar', {
        series: series,
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
              // if (_that.tabsLists[_that.selectedIndex].value == '_per_lauch') {
              //   return _that.Globals.toDecimal(value)
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
      this.echartsLoading = false;
      this.load = false;
    } else {
      this.echartsLoading = true;
      this.load = false;
      this.chartOption = {};
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
  downloadDataDitch() {
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      channelId: this.sdetailsSelectedValue,
      queryFilters: this._queryFilters(),
      dicItemValue: this.channelValue
    };
    this.subcontractChannelsSdetailsService.customeChartsDitch(parmes).subscribe(() => {});
  }
  /**
   * 留存据下载
   */
  downloadData() {
    let parmes: any = {
      productId: localStorage.getItem('productId'),
      startDate: this.newDate[0].getTime(),
      endDate: this.newDate[1].getTime(),
      channelId: this.sdetailsSelectedValue,
      queryFilters: this._queryFilters(),
      dicItemValue: this.channelValue
    };
    this.subcontractChannelsSdetailsService.download(parmes).subscribe(() => {});
  }
  goPage(hash: string) {
    this.commonService.goPage(hash);
  }
  ngOnDestroy() {
    this.searchTerms.unsubscribe();
    this._etentionRendering.unsubscribe();
  }
}
