import { Component, OnInit, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducer from './../../ngrx/reducer';
import * as global from '../../ngrx/action/global';
import * as secondLevel from '../../ngrx/action/secondLevel';
import * as moment from 'moment';
import { Router } from "@angular/router"

const _ = require('lodash');

import { AdcampSourceService } from '../../services/source/adcamp.source.service'
import { IndicatorsSourceService } from '../../services/source/indicators.source.service'
@Component({
  selector: 'activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.less'],
  providers: [
    AdcampSourceService,
    IndicatorsSourceService,

  ]
})
export class ActivityContainerComponent implements OnInit {
  // table数据
  private _dataSet: any = [];
  private activityData: any = [];
  private search: string = '';
  private tableData: any = [];
  private isResult: boolean = true;
  // 全局数据
  private _store: any;
  private _startTime: number = null;
  private _endTime: number = null;
  // sortData
  private sortMap: any = {
    impression_pv: 'descend',
    impression_anti: null,
    click_pv: null,
    click_anti: null,
  };
  // 分页数据
  private _current: number = 1; //当前页
  private _pageSize: number = 10;  //每页条数
  private _total: number = 1;   //数据总量
  private parmas: any = {};
  constructor(
    private router: Router,
    private adcampSourceService: AdcampSourceService,
    private indicatorsSourceService: IndicatorsSourceService,
    private store$: Store<reducer.State>,
  ) {
    // 获取全局时间
    this._store = this.store$.select('global').debounceTime(1000).subscribe(result => {
      this._startTime = result.startTime;
      this._endTime = result.endTime;
      this.parmas =
        {
          "metrics": ["impression_pv", "click_pv", "impression_anti", "click_anti"],
          "dimension": "activity",
          "start": moment(this._startTime).format('YYYY-MM-DD'),
          "end": moment(this._endTime).format('YYYY-MM-DD'),
          "orderByStr": "impression_pv",
          "desc": false,
          "currentPage": 1,
          "pageSize": 10,
        }
      this.getActivityAllList(this.parmas)
    })
  }

  getActivityAllList(parmas: any) {
    this.adcampSourceService.getActivityListAll(parmas).then((data: any) => {
      if (data.code == 200 && data.result && data.result.resultData) {
        // 重置table数据格式
        this.isResult = true;
        const list = data.result.resultData.map((item: any) => {
          let statusNum = this.timeStamp(item.activity.startTime, item.activity.endTime),
            parmas = {
              activitykey: item.activity.activityKey,
              name: item.activity.name,
              status: statusNum,
              count: item.monitorLinkCount,
              exposure: '--',
              abnormalEp: '--',
              click: '--',
              abnormalCk: '--',
              allDay: '--',
              beStart: '--',
            };
          //状态提示信息 
          if (statusNum == 0) {
            let _start = moment(item.activity.startTime).format('YYYY-MM-DD'),
              _end = moment(item.activity.endTime).format('YYYY-MM-DD'),
              _now = this.getNowFormatDate()
            parmas.allDay = String(this.dayNum(_start, _end))
            parmas.beStart = String(this.dayNum(_now, _start))
          }
          // 指标
          if (item.kvs.length > 0) {
            parmas.exposure = item.kvs[0].value;
            parmas.abnormalEp = item.kvs[2].value;
            parmas.click = item.kvs[1].value;
            parmas.abnormalCk = item.kvs[3].value
          }
          return parmas;
        });
        this._total = data.result.page.totalCount;
        this.tableData = list;
      } else {
        // this.tableData = [];
        this.isResult = false;
      }
    })
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }

  // 搜索
  onSearch(e: any) {
    this.parmas.keyword = e;
    this.PageIndexChange(1);   
  }
  blur() {
    if (this.search === '' && this.parmas.keyword ) {
      this.parmas.keyword = '';
       this.PageIndexChange(1);
    }
  }
  //改变页码
  PageIndexChange(e: number) {
    this.isResult = true;
    this.tableData = [];
    if (this._current === e) {
      this.parmas.currentPage = e;
      this.getActivityAllList(this.parmas);
    } else {
      this._current = e;
    }
  }
  // 改变每页数量
  PageSizeChange(e: any) {
    this.parmas.pageSize = this._pageSize;
    this.PageIndexChange(1);
  }
  create(name: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: name
    })
    this.router.navigate(['/activity/create/', name])
  }

  inDetail(data: any) {
    if (data !== null && data !== undefined) {
      this.store$.dispatch({
        type: global.SET_GLOBAL_CAMPAIGN_OPTION,
        activityKey: data.activitykey,
        activityName: data.name
      });
      localStorage.setItem('TD_BG_ACTIVITY_OPTION', JSON.stringify({ 'value': data.activitykey, 'label': data.name }))
      this.router.navigate(['/activity/overview'])
    }
  }

  toEdit(data: any) {
    if (data !== null && data !== undefined) {
      this.store$.dispatch({
        type: global.SET_GLOBAL_CAMPAIGN_OPTION,
        activityKey: data.activitykey,
        activityName: data.name
      });
      localStorage.setItem('TD_BG_ACTIVITY_OPTION', JSON.stringify({ 'value': data.activitykey, 'label': data.name }))
      this.router.navigate(['/activity/setting'])
    }
  }
  // 排序
  sort(sortName: any, value?: any) {
    let flag = value ? value : this.sortMap[sortName];
    if (!value) {
      if (flag === null || flag === 'ascend') {
        flag = 'descend';
      } else if (flag === 'descend') {
        flag = 'ascend';
      }
    }
    this.parmas.desc = flag === 'ascend';
    this.parmas.orderByStr = sortName;
    Object.keys(this.sortMap).forEach(key => {
      this.sortMap[key] = key !== sortName ? null : flag;
    });
    this.PageIndexChange(1);
  }

  // 状态值
  timeStamp(start: any, end: any) {
    let nowstamp = new Date().getTime(),
      startstsmp = Number(new Date(start)),
      endstamp = Number(new Date(end)),
      balance = (nowstamp - startstsmp) / (endstamp - startstsmp) * 100;
    if ((endstamp - startstsmp) == 0 && (endstamp < nowstamp) || balance > 100) {
      balance = 100;
    } else if ((endstamp - startstsmp) == 0 && (endstamp > nowstamp) || (nowstamp - startstsmp) / (endstamp - startstsmp) < 0) {
      balance = 0;
    }
    return balance;
  }
  // 日期减法
  dayNum(startTime: any, endTime: any) {
    var date1 = new Date(startTime)
    var date2 = new Date(endTime)
    var s1 = date1.getTime(), s2 = date2.getTime();
    var total = (s2 - s1) / 1000;
    var day = Number(total / (24 * 60 * 60));//计算整数天数
    return day;
  }
  // 获取当前日期
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month: any = date.getMonth() + 1;
    var strDate: any = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    return currentdate;
  }
}
