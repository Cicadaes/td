import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatePickerService } from '../date-picker.service';
import * as differenceInDays from 'date-fns/difference_in_days';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.less']
})
export class ControlPanelComponent implements OnInit, OnChanges {
  @Input() zoomName: string = 'world'; // 世界地图和中国地图切换
  @Input() chinaClick: any = 0; // 中国地图点击
  @Output() dataChange = new EventEmitter<any>(); // 回调事件
  // this.dataChange.emit(this.boolFilters);

  subTitle: any = ''; // 2017-01-02 ~ 2017-01-08;
  period: string = 'Year';
  switchValue: any = false;
  isMonth: any = false;
  date: any;
  weekDateDefault: any;
  monthDateDefault: any;
  dateParam: any = {};

  today = new Date();
  disabledDateWeek: any;
  disabledDateMonth: any;

  constructor(private datePickerService: DatePickerService) {}

  ngOnInit() {
    // ----初始化周月默认值----
    const now = new Date();

    // 周默认值
    const weekTmp = now.getTime() - 86400000 * 7;
    this.weekDateDefault = new Date(weekTmp);
    this.date = new Date(weekTmp);

    // 月默认值
    let monthTmp;
    if (now.getMonth() === 0) {
      monthTmp = `${now.getFullYear() - 1}-12-1`;
    } else {
      monthTmp = `${now.getFullYear()}-${now.getMonth()}-1`;
    }
    this.monthDateDefault = new Date(monthTmp);
    // ----初始化周月默认值_end----

    // -----初始化禁用日期范围----
    const prefix = this.today.getDay() || 7;
    const timeLong = this.today.getTime() - 86400000 * prefix;
    const weekEnd = new Date(timeLong);
    this.disabledDateWeek = (current: Date): boolean => {
      return differenceInDays(current, weekEnd) > 0;
    };

    const thisMonthFirst = new Date(`${this.today.getFullYear()}-${this.today.getMonth() + 1}-1`);

    const monthTimeLong = thisMonthFirst.getTime() - 86400000;
    const monthEnd = new Date(monthTimeLong);
    this.disabledDateMonth = (current: Date): boolean => {
      return differenceInDays(current, monthEnd) > 0;
    };
    // -----初始化禁用日期范围_end----

    this.initWeekDateParam();

    this.dataChange.emit({
      dateParam: this.dateParam
    });

    // 请求周列表
    this.datePickerService.queryWeekList(now.getFullYear());
  }

  // 切换地图
  changeZoomName(zoomName) {
    this.zoomName = zoomName;
    // this.dataChange.emit({
    //     zoomName: zoomName,
    //     dateParam: this.dateParam
    // });

    const period = this.switchValue ? this.period : 'Current';
    this.requestPeriod2(period, true);
  }

  initWeekDateParam() {
    const dateStr = new DatePipe(this.date).transform(this.date, 'yyyy-ww', '+0086', 'zh_CN');
    const dataArray = dateStr.split('-');

    const prefix = this.date.getDay() ? this.date.getDay() : 7;
    const startDateObj: any = new Date(this.date.getTime() - (prefix - 1) * 86400000);
    const endDateObj: any = new Date(this.date.getTime() + (7 - prefix) * 86400000);

    this.dateParam = {
      year: dataArray[0],
      dateType: 'week',
      valueOfYear: dataArray[1],
      startDate: new DatePipe(startDateObj).transform(startDateObj, 'yyyyMMdd', '+0086', 'zh_CN'),
      endDate: new DatePipe(endDateObj).transform(endDateObj, 'yyyyMMdd', '+0086', 'zh_CN'),
      startDateTip: new DatePipe(startDateObj).transform(startDateObj, 'yyyy/MM/dd', '+0086', 'zh_CN'),
      endDateTip: new DatePipe(endDateObj).transform(endDateObj, 'yyyy/MM/dd', '+0086', 'zh_CN')
    };
  }

  initMonthDateParam() {
    const dateStr = new DatePipe(this.date).transform(this.date, 'yyyy-MM', '+0086', 'zh_CN');
    const dataArray = dateStr.split('-');

    this.dateParam = {
      year: dataArray[0],
      dateType: 'month',
      valueOfYear: parseInt(dataArray[1])
    };

    const dateObj: any = this.datePickerService.getDespOfPeriod2(this.dateParam);
    this.dateParam.startDate = dateObj.startDate.replace(/-/g, '');
    this.dateParam.endDate = dateObj.endDate.replace(/-/g, '');

    this.dateParam.startDateTip = dateObj.startDate.replace(/-/g, '/');
    this.dateParam.endDateTip = dateObj.endDate.replace(/-/g, '/');
  }

  // 切换周、月
  changeDateType() {
    this.switchValue = false;
    this.isMonth = !this.isMonth;
    if (this.isMonth) {
      this.date = new Date(this.monthDateDefault);
      this.initMonthDateParam();
    } else {
      this.date = new Date(this.weekDateDefault);
      this.initWeekDateParam();
    }

    this.onDateChange(this.date);
  }

  // 切换日期值
  onDateChange(date) {
    this.switchValue = false;
    let dateStr = '';
    if (!this.isMonth) {
      if (!date.getDay()) {
        date = date.getTime() - 86400000;
      }
      dateStr = new DatePipe(date).transform(date, 'yyyy-ww', '+0086', 'zh_CN');
    } else {
      dateStr = `${1900 + date.getYear()}-${date.getMonth() + 1}`;
    }

    const dateArray = dateStr.split('-');
    this.datePickerService.queryWeekList(parseInt(dateArray[0]));

    const dateParam: any = {
      dateType: this.isMonth ? 'month' : 'week',
      valueOfYear: dateArray[1],
      year: dateArray[0]
    };
    this.dateParam = dateParam;

    // this.subTitle = this.datePickerService.getDespOfPeriod(this.dateParam);
    const dateObj: any = this.datePickerService.getDespOfPeriod2(this.dateParam);
    this.subTitle = `${dateObj.startDate} ~ ${dateObj.endDate}`;
    dateParam.startDate = dateObj.startDate.replace(/-/g, '');
    dateParam.endDate = dateObj.endDate.replace(/-/g, '');

    dateParam.startDateTip = dateObj.startDate.replace(/-/g, '/');
    dateParam.endDateTip = dateObj.endDate.replace(/-/g, '/');

    this.dataChange.emit({
      dateParam: dateParam
    });
  }

  // 同比 开关
  periodOpen(open) {
    if (!open) {
      this.requestPeriod2('Current', false);
    } else {
      this.requestPeriod2(this.period, false);
    }
  }

  // 同比 切换
  changePeriod(period) {
    this.period = period;
    if (this.switchValue) {
      this.requestPeriod2(period, false);
    }
  }

  // 同比，环比，当前
  requestPeriod2(period: string, type: boolean) {
    let dateParamTmp: any;
    const dateParamOld = this.dateParam;
    if (period === 'Year') {
      dateParamTmp = {
        year: dateParamOld.year - 1,
        dateType: dateParamOld.dateType,
        valueOfYear: dateParamOld.valueOfYear
      };
    } else if (period === 'Ring') {
      // 当前周期为1，回退上一年最后一个周期
      if (dateParamOld.valueOfYear === 1 || dateParamOld.valueOfYear === '1') {
        const lastWeek = this.datePickerService.weekListMap[dateParamOld.year - 1]
          ? this.datePickerService.weekListMap[dateParamOld.year - 1].length
          : 52;
        const lastValue = dateParamOld.dateType === 'week' ? lastWeek : 12;
        dateParamTmp = {
          year: dateParamOld.year - 1,
          dateType: dateParamOld.dateType,
          valueOfYear: lastValue
        };
      } else {
        dateParamTmp = {
          year: dateParamOld.year,
          dateType: dateParamOld.dateType,
          valueOfYear: dateParamOld.valueOfYear - 1
        };
      }
    } else {
      dateParamTmp = dateParamOld;
    }

    // this.subTitle = this.datePickerService.getDespOfPeriod(dateParamTmp);
    const dateObj: any = this.datePickerService.getDespOfPeriod2(dateParamTmp);
    this.subTitle = `${dateObj.startDate} ~ ${dateObj.endDate}`;

    if (dateObj && dateObj.startDate) {
      dateParamTmp.startDate = dateObj.startDate.replace(/-/g, '');
      dateParamTmp.startDateTip = dateObj.startDate.replace(/-/g, '/');
    }
    if (dateObj && dateObj.endDate) {
      dateParamTmp.endDate = dateObj.endDate.replace(/-/g, '');
      dateParamTmp.endDateTip = dateObj.endDate.replace(/-/g, '/');
    }

    const obj = {
      dateParam: dateParamTmp
    };

    if (type) {
      obj['zoomName'] = this.zoomName;
    }
    this.dataChange.emit(obj);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chinaClick'] && changes['chinaClick'].firstChange === false) {
      this.changeZoomName('china');
    }
  }
}
