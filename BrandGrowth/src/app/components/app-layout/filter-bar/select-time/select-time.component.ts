import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as reducer from './../../../../ngrx/reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as global from './../../../../ngrx/action/global';

@Component({
  selector: 'select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.less'],
})
export class SelectTimeComponent implements OnInit {
  _dateRange = [new Date(), new Date(Date.now() + 3600 * 24 * 5 * 1000)];
  _isNeedSpecialPicker: boolean = false;

  globalMessage$: Observable<any>;
  guardMessage$: Observable<any>;

  static startDisabledTime: any;
  static endDisabledTime: any;

  constructor(
    private store$: Store<reducer.State>,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    SelectTimeComponent.startDisabledTime = new Date().getTime();
    SelectTimeComponent.endDisabledTime = new Date().getTime();
    this.globalMessage$ = this.store$.select('global');
    this.guardMessage$ = this.store$.select('guard');
    let rootUrl = router.routerState.snapshot.url;
    if ( rootUrl === '/activity') {
      this._isNeedSpecialPicker = true;
    }
  }

  ngOnInit() {
    if(localStorage.getItem("TD_BG_ACTIVITY_TIME") && JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_TIME"))) {
      this._dateRange = JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_TIME"));
      this.store$.dispatch({
        type: global.SET_GLOBAL_TIME,
        startTime: this._dateRange[0] ? new Date(this._dateRange[0]).getTime(): new Date().getTime(),
        endTime: this._dateRange[1] ? new Date(this._dateRange[1]).getTime(): new Date().getTime(),
      })
    } else {
      localStorage.setItem("TD_BG_ACTIVITY_TIME", JSON.stringify(this._dateRange));
    }
    this.globalMessage$.distinctUntilChanged().subscribe(result => {
      this._dateRange[0] = result.startTime ? new Date(result.startTime): new Date();
      this._dateRange[1] = result.endTime ? new Date(result.endTime): new Date();
    })
    this.store$.select('disabled').distinctUntilChanged().subscribe((data: any) => {
      SelectTimeComponent.startDisabledTime = data.startDisabledTime;
      SelectTimeComponent.endDisabledTime = data.endDisabledTime;
    })
  }

  /**
   * 当时间选择框范围被更改的时候，触发此函数
   * @param dateRange 时间选择框范围，同_dateRange
   */
  _dateRangeChange(dateRange: any): void {
    this.store$.dispatch({ // 更新store内的全局时间范围
      type: global.SET_GLOBAL_TIME,
      startTime: new Date(dateRange[0]).getTime(),
      endTime: new Date(dateRange[1]).getTime(),
    })
    localStorage.setItem("TD_BG_ACTIVITY_TIME", JSON.stringify(dateRange)); // 将全局时间范围保存到本地
  }

  /**
   * 设置时间范围
   * @param range 前第range天  0表示今天 1表示昨天 依次类推
   */
  setDateRange(range: number): void {
    let totalDays = range * 24 * 60 * 60 * 1000;
    let startTime = new Date(new Date().getTime() - totalDays);
    let endTime = new Date();
    this._dateRange = [startTime, endTime];
    this._dateRangeChange(this._dateRange);
  }

  /**
   * 指定不可选择日期 1. 不能选择今天以后的时间  2. 不能选择UserInfo的时间范围外的时间
   * @param current 
   */
  _disabledDate(current: Date): boolean {
    return current && ( current.getTime() > Date.now() || current.getTime() > SelectTimeComponent.endDisabledTime || current.getTime() < SelectTimeComponent.startDisabledTime );
  }
}
