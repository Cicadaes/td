import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'common-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.less']
})
export class DateComponent implements OnInit, OnDestroy {
  newData: any; //当前默认日期
  _newData: any; //上一次选择时间
  //日期组件下方日期的时间底部快捷键
  // nzRangesData = {
  // 今天: [new Date(), new Date()],
  // 昨天: [
  // 	new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
  // 	new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
  // ],
  // 近7天: [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()],
  // 近30天: [new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000), new Date()],
  // 近180天: [new Date(new Date().getTime() - 179 * 24 * 60 * 60 * 1000), new Date()],
  // 近1年: [new Date(new Date().getTime() - 364 * 24 * 60 * 60 * 1000), new Date()]
  // };
  /**
   * 禁用日期
   * @param current
   */
  _disabledDate(current: Date): any {
    if (current) {
      if (Date.now() - current.getTime() > 0) {
        return false;
      } else {
        return true;
      }
    }
  }
  constructor(private message: NzMessageService) {}

  @Output() dateChange = new EventEmitter();
  @Input()
  set _date(date: any) {
    if (date && date[0] && date[1]) {
      this.newData = [date[0], date[1]];
    } else {
      this.newData = [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()];
    }
  }
  public changeModel(date: any) {
    if (date && date[0] && date[1]) {
      if (date[1].getTime() - date[0].getTime() > 31536000000) {
        // this.newData = [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()];
        this.newData = [this._newData[0], this._newData[1]];
        this.message.create('warning', '时间范围不能超过一年');
      } else {
        this._newData = this.newData;
        this.dateChange.emit(date);
      }
    }
  }
  ngOnInit() {
    //初始加载时间点
    this._newData = this.newData;
    // this.changeModel(this.newData);
  }
  ngOnDestroy() {}
}
