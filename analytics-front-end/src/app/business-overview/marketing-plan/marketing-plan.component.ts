import { Component, Injector, Output, EventEmitter, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as ps from 'perfect-scrollbar';
import { MarketingPlanService } from './marketing-plan.service';
import { DateUtil } from '../../utils/date';
import { BaseComponent } from '../../common/base-component';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-marketing-plan',
  templateUrl: './marketing-plan.component.html',
  styleUrls: ['./marketing-plan.component.less'],
  providers: [MarketingPlanService, DateUtil]
})
export class MarketingPlanComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  tipInfo: string;

  @Output() changeLoading = new EventEmitter<boolean>();

  @Output() errorMessage = new EventEmitter<any>();

  campaignOverview: any = {};

  sclPushList: any = []; // 单触点投放列表
  campaignList: any = []; // 多触点活动列表
  count: number; // 当前日期下活动总数量
  width: number; // 甘特图每一个小div的宽度
  left: number; // 甘特图左边第一个div宽度
  contentWidth: number; // 甘特图整个外层div宽度
  isLoading: boolean; // 判断是否在获取数据中 防止多次请求
  resizeFlag: any; // 用于页面resize时 记录timeout

  // 默认获取甘特图请求参数
  queryParams: any = {
    orderBy: 'startTime',
    order: 'asc',
    type: 2, // 多触点
    startTimeBegin: `${new Date().getFullYear()}-01-01`,
    startTimeEnd: `${new Date().getFullYear()}-12-31`,
    page: 1,
    pageSize: 10
  };

  monthList: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  yearList: any[] = [
    {
      year: new Date().getFullYear(),
      count: 12,
      // width: `calc(((100% - 347px)/12) * 12)`
      width: `calc(((100% - 240px)/12) * 12)`
    }
  ];

  activityChart: any; // 活跃用户总量图表

  /**
   * 面积图图表
   */
  activityChartOption = {
    grid: {
      top: '0',
      left: '0',
      right: '0',
      bottom: '0'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      show: false,
      data: []
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        color: '#FF8454',
        symbol: 'none',
        data: [],
        type: 'line',
        areaStyle: {}
      }
    ]
  };

  content: any;

  constructor(
    private marketingPlanService: MarketingPlanService,
    private injector: Injector,
    private dateUtil: DateUtil
  ) {
    super(injector);
    this.initRouterList('营销计划');

    const that = this;
    that.tipInfo = '暂无数据';
    that.isLoading = false;
    marketingPlanService.getCurrYearOverview().subscribe(data => {
      if (data['code'] === 'OK' || data['code'] === 200) {
        that.campaignOverview = data['data'];
      }
    });
    document.addEventListener('ps-y-reach-end', function() {
      // 滚动条到底部的条件即为scrollTop + clientHeight == scrollHeight。  防止有时到底少一像素
      if (that.content.scrollTop + that.content.clientHeight >= that.content.scrollHeight - 1 && !that.isLoading) {
        if (!that.count || that.queryParams.page + 1 > Math.ceil(that.count / 10)) {
          return;
        }
        that.queryParams.page += 1;
        that.queryCampaigns(that.queryParams);
      }
    });
    // 页面size改变 需要重绘页面
    window.onresize = function() {
      that.width = null;
      that.left = null;
      that.contentWidth = null;
      that.calcTime(that.campaignList);
      ps.update(that.content);
    };
  }

  ngOnInit() {
    this.queryCampaigns(this.queryParams);
    this.queryActiveUsers(this.queryParams);
  }

  ngAfterViewInit() {
    const that = this;
    this.querySclPush(this.queryParams);
    that.content = document.getElementById('content');
    ps.initialize(that.content);
  }

  ngOnDestroy() {
    window.onresize = () => {};
    document.removeEventListener('ps-y-reach-end', () => {});
  }

  /**
   * 获取活跃用户总量
   * @param queryParam
   */
  queryActiveUsers(queryParam: any) {
    const that = this;
    that.marketingPlanService
      .queryActiveUsers({
        startTimeBegin: queryParam.startTimeBegin,
        startTimeEnd: queryParam.startTimeEnd
      })
      .subscribe((data: any) => {
        if (data['code'] !== 200) {
          that.notification.create('warning', '错误提示', data.tipInfo);
          return;
        }
        const list = data['data'];
        let xData = [];
        let yData = [];
        for (let key in list) {
          xData.push(key);
          yData.push(list[key]);
        }
        this.activityChartOption.xAxis.data = xData;
        this.activityChartOption.series[0].data = yData;
        that.activityChart = cloneDeep(that.activityChartOption);
      });
  }

  // 计算甘特图
  calcTime(data: any) {
    if (!this.left) {
      this.left = document.getElementsByClassName('content-name')[0]['offsetWidth'];
    }
    if (!this.width) {
      let bodyWidth = document.body.offsetWidth;
      this.width = Math.floor((bodyWidth - this.left - 32) / 12);
      // this.width = document.getElementsByClassName('content-table')[0]['offsetWidth'];
    }
    if (!this.contentWidth) {
      this.contentWidth = document.getElementById('content')['offsetWidth'];
    }
    const length = data.length;
    const time = new Date();
    for (let i = 0; i < length; i++) {
      let tempWidth = 0;
      const startTime = new Date(data[i].startTime);
      let endTime = new Date(data[i].endTime);
      const lastTime = new Date(this.queryParams.startTimeEnd); // 当前日期选择器最后一天
      const nowTime = new Date();
      // 如果结束时间超过了最大时间 则显示到最大时间
      if (endTime > lastTime) {
        endTime = lastTime;
      }
      const startLeft = this.calcLeftWidth(startTime, this.left, this.width, 1);
      let endLeft = this.calcLeftWidth(endTime, this.left, this.width, 2);
      let nowLeft = this.calcLeftWidth(new Date(), this.left, this.width, 1);
      const endRight = this.contentWidth - endLeft;
      if (endLeft === startLeft) {
        const tempFullDate = this.calcPercent(endTime);
        endLeft += +(this.width * (1 / tempFullDate)).toFixed(2);
      }
      if (endTime <= time || startTime >= time) {
        tempWidth = endLeft - startLeft;
        if (endTime <= time) {
          data[i]['endLeft'] = startLeft + 'px';
          data[i]['endWidth'] = tempWidth + 'px';
        } else {
          data[i]['futureLeft'] = startLeft + 'px';
          data[i]['futureWidth'] = tempWidth + 'px';
        }
      } else {
        if (nowLeft === startLeft) {
          const tempFullDate = this.calcPercent(nowTime);
          nowLeft = nowLeft + +(this.width * (1 / tempFullDate)).toFixed(2);
        }
        data[i]['endLeft'] = startLeft + 'px';
        data[i]['endWidth'] = nowLeft - startLeft + 'px';
        data[i]['futureLeft'] = nowLeft + 'px';
        data[i]['futureWidth'] = endLeft - nowLeft + 'px';
      }
      if (endRight > 245) {
        data[i]['tipLeft'] = `${endLeft + 14}px`;
        data[i]['left'] = true;
      } else {
        // data[i]['tipLeft'] = startLeft - 242 + 'px';
        // data[i]['tipLeft'] = startLeft - 180 + 'px';
        data[i]['tipLeft'] = startLeft - 190 + 'px';
        data[i]['left'] = false;
      }
      data[i]['tipShow'] = false;
    }
  }

  // 获取当前月份有多天
  calcPercent(time: any) {
    const tempTime = new Date(time);
    const curMonth = tempTime.getMonth();
    const curDate = tempTime.getDate();
    if (curDate === 31) {
      return curDate;
    } else {
      tempTime.setMonth(curMonth + 1);
      tempTime.setDate(0);
      return tempTime.getDate();
    }
  }

  /**
   * 获取日期到距离左边的距离  type 1 计算开始时间  2计算结束时间
   * @param time
   * @param left
   * @param tableWidth
   * @param type
   */
  calcLeftWidth(time: any, left: number, tableWidth: number, type: number): number {
    const tempTime = new Date(time);
    const date = tempTime.getDate();
    const month = tempTime.getMonth() + 1; // 获取月份 因为这里的是从0开始所以需要+1
    const count = this.monthList.indexOf(month); // 获取当前月份 前面还有多少个月份
    const fullDate = this.calcPercent(time); // 获取当前月份天数
    let data, monthLeft; // 当前月初到盒子左侧的距离
    if (type === 1) {
      monthLeft = document.getElementsByClassName('month-item-width')[count]['offsetLeft'];
      if (date === 1) {
        data = monthLeft;
      } else {
        // data = left + tableWidth * count + (+(tableWidth * ((date - 1) / fullDate)).toFixed(2)); // 该处计算有px的误差
        data = monthLeft + +(tableWidth * ((date - 1) / fullDate)).toFixed(2);
      }
    } else if (type === 2) {
      // 当时间为一个月最后一天时 直接获取下个div到table最左边距 如果是最后一个月的话 直接获取整个table的宽度
      if (date === fullDate) {
        if (count === 11) {
          data = document.getElementsByClassName('table-title')[0]['offsetWidth'];
        } else {
          data = document.getElementsByClassName('month-item-width')[count + 1]['offsetLeft'];
        }
      } else {
        data = left + tableWidth * count + +(tableWidth * (date / fullDate)).toFixed(2);
      }
    }
    return data;
  }

  // 时间轴向前推一个月
  beforeMonth() {
    const tempMonth = this.monthList.pop();
    const tempYear = this.yearList[0].year;
    if (tempMonth === 12) {
      this.yearList[0].count--;
      // this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`;
      this.yearList[0].width = `calc(((100% - 240px)/12) * ${this.yearList[0].count})`;
      const json = {
        year: tempYear - 1,
        count: 1,
        // width: `calc(((100% - 347px)/12) * 1)`
        width: `calc(((100% - 240px)/12) * 1)`
      };
      this.yearList.unshift(json);
    } else if (tempMonth === 1) {
      this.yearList.pop();
      this.yearList[0].count = 12;
      // this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`;
      this.yearList[0].width = `calc(((100% - 240px)/12) * ${this.yearList[0].count})`;
    } else {
      this.yearList[0].count++;
      // this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`;
      this.yearList[0].width = `calc(((100% - 240px)/12) * ${this.yearList[0].count})`;
      this.yearList[1].count--;
      // this.yearList[1].width = `calc(((100% - 347px)/12) * ${this.yearList[1].count})`;
      this.yearList[1].width = `calc(((100% - 240px)/12) * ${this.yearList[1].count})`;
    }
    this.monthList.unshift(tempMonth);
    this.queryParams.startTimeBegin = `${this.yearList[0].year}-${this.monthList[0]}-1`;
    // new Date((moment()
    // .set({ 'year': this.yearList[0].year, 'month': this.monthList[0] - 1 }).startOf('month')).toString()).getTime();
    this.queryParams.startTimeEnd =
      `${this.yearList[this.yearList.length - 1].year}` +
      `-${this.monthList[11]}` +
      `-${this.dateUtil.getLastDay(this.yearList[this.yearList.length - 1].year, this.monthList[11])}`;
    // new Date((moment().set({ 'year': this.yearList[this.yearList.length - 1].year, 'month': this.monthList[11] - 1 })
    // .endOf('month')).toString()).getTime();
    this.campaignList = [];
    this.queryParams.page = 1;
    this.querySclPush(this.queryParams);
    this.queryCampaigns(this.queryParams);
    this.queryActiveUsers(this.queryParams);
  }

  // 时间轴向后推一个月
  afterMonth() {
    const tempMonth = this.monthList.shift();
    const tempYear = this.yearList[0].year;
    if (tempMonth === 1) {
      this.yearList[0].count--;
      // this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`;
      this.yearList[0].width = `calc(((100% - 240px)/12) * ${this.yearList[0].count})`;
      const json = {
        year: tempYear + 1,
        count: 1,
        // width: `calc(((100% - 347px)/12) * 1)`
        width: `calc(((100% - 240px)/12) * 1)`
      };
      this.yearList.push(json);
    } else if (tempMonth === 12) {
      this.yearList.shift();
      this.yearList[0].count = 12;
      // this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`;
      this.yearList[0].width = `calc(((100% - 240px)/12) * ${this.yearList[0].count})`;
    } else {
      this.yearList[0].count--;
      // this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`;
      this.yearList[0].width = `calc(((100% - 240px)/12) * ${this.yearList[0].count})`;
      this.yearList[1].count++;
      // this.yearList[1].width = `calc(((100% - 347px)/12) * ${this.yearList[1].count})`;
      this.yearList[1].width = `calc(((100% - 240px)/12) * ${this.yearList[1].count})`;
    }
    this.monthList.push(tempMonth);
    // this.queryParams.startTimeLong =
    // new Date((moment().set({ 'year': this.yearList[0].year, 'month': this.monthList[0] - 1 })
    // .startOf('month')).toString()).getTime();
    this.queryParams.startTimeBegin = `${this.yearList[0].year}-${this.monthList[0]}-1`;
    // this.queryParams.endTimeLong =
    // new Date((moment().set({ 'year': this.yearList[this.yearList.length - 1].year, 'month': this.monthList[11] - 1 })
    // .endOf('month')).toString()).getTime();
    this.queryParams.startTimeEnd =
      `${this.yearList[this.yearList.length - 1].year}` +
      `-${this.monthList[11]}` +
      `-${this.dateUtil.getLastDay(this.yearList[this.yearList.length - 1].year, this.monthList[11])}`;
    this.campaignList = [];
    this.queryParams.page = 1;
    this.querySclPush(this.queryParams);
    this.queryCampaigns(this.queryParams);
    this.queryActiveUsers(this.queryParams);
  }

  /**
   * 计算单触点
   * @param data
   */
  calcSclPush(data: any) {
    if (!this.width) {
      this.width = document.getElementsByClassName('month-item-width')[0]['offsetWidth'];
    }
    if (!this.left) {
      this.left = document.getElementsByClassName('title-width')[0]['offsetWidth'];
    }
    if (!this.contentWidth) {
      this.contentWidth = document.getElementsByClassName('content-width')[0]['offsetWidth'];
    }
    const length = data.length;
    for (let i = 0; i < length; i++) {
      let tempWidth = 0;
      const startTime = new Date(data[i].time);
      const startLeft = this.calcLeftWidth(startTime, this.left, this.width, 1);
      const tempFullDate = this.calcPercent(startTime);
      tempWidth += +(this.width * (1 / tempFullDate)).toFixed(2);
      data[i]['endLeft'] = `${startLeft - this.left}px`; // 此处减去左侧的宽度   因为left距离是根据单触点投放右侧的div浮动
      data[i]['endWidth'] = `${tempWidth}px`;
    }
  }

  /**
   * 获取单触点投放列表
   * @param queryParam
   */
  querySclPush(queryParam: any) {
    const that = this;
    let param = cloneDeep(queryParam);
    param['type'] = 1; // 单触点投放类型
    param['pageSize'] = 9999; // 单触点投放数量（全量）
    that.marketingPlanService.queryCampaignList(param).subscribe((data: any) => {
      if (data['code'] !== 'OK' && data['code'] !== 200) {
        that.notification.create('warning', '错误提示', data.tipInfo);
        return;
      }
      const list = data['data'];
      let map = {},
        maplist = [];
      list['data'].forEach(element => {
        const key = element.startTime.substring(0, 10);
        if (map[key]) {
          map[key].push(element);
        } else {
          map[key] = [];
          map[key].push(element);
        }
      });
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          //                    const element = map[key];
          let data = {
            time: key,
            data: map[key]
          };
          maplist.push(data);
        }
      }
      that.sclPushList = maplist;
      that.count = list['total'];
      setTimeout(function() {
        that.calcSclPush(that.sclPushList);
      }, 100);
    });
  }

  /**
   * 获取多触点投放列表
   * @param queryParam
   */
  queryCampaigns(queryParam: any) {
    const that = this;
    that.isLoading = true;
    that.marketingPlanService.queryCampaignList(queryParam).subscribe((data: any) => {
      if (data['code'] !== 'OK' && data['code'] !== 200) {
        that.notification.create('warning', '错误提示', data.tipInfo);
        return;
      }
      const list = data['data'];
      if (list['data'].length === 0) {
        return;
      }
      that.campaignList = that.campaignList.concat(list['data']);
      that.count = list['total'];
      setTimeout(function() {
        that.calcTime(that.campaignList);
        ps.update(that.content);
        that.isLoading = false;
      }, 100);
    });
  }
}
