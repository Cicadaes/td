import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';

@Injectable()
export class DatePickerService extends CurdService {
  public weekListMap: any = {};

  endDateOfMonthMap = {
    1: '31',
    2: '28',
    3: '31',
    4: '30',
    5: '31',
    6: '30',
    7: '31',
    8: '31',
    9: '30',
    10: '31',
    11: '30',
    12: '31'
  };

  constructor(private injector: Injector) {
    super(injector);
  }

  public queryWeekList(year: number) {
    if (!this.weekListMap[year - 1]) {
      this.queryByYearSimple(year - 1);
    }
    return this.queryByYearSimple(year);
  }

  private queryByYearSimple(year: number) {
    let url = '/crowd/week/weekList/' + year;
    let obs = this.http.get(url);
    obs.subscribe((data: any) => {
      if (!this.weekListMap[year]) {
        this.weekListMap[year] = data.data;
      }
    });
    return obs;
  }

  public getDespOfPeriod(dateParam: any) {
    let returnValue = '';
    if (dateParam.dateType == 'week') {
      let obj = this.weekListMap[dateParam.year] ? this.weekListMap[dateParam.year][dateParam.valueOfYear - 1] : {};
      if (dateParam.valueOfYear == 53 && obj == null) {
        obj = this.weekListMap[dateParam.year][dateParam.valueOfYear - 2];
      }
      returnValue = `${obj.startDate} ~ ${obj.endDate}`;
    } else {
      let month = `${dateParam.year}-${(dateParam.valueOfYear < 10 ? '0' : '') + dateParam.valueOfYear}`;

      returnValue = `${month}-01 ~ ${month}-${this.endDateOfMonthMap[dateParam.valueOfYear]}`;
    }
    return returnValue;
  }

  public getDespOfPeriod2(dateParam: any) {
    let retObj = {};
    //        let returnValue = '';
    if (dateParam.dateType == 'week') {
      let obj = this.weekListMap[dateParam.year] ? this.weekListMap[dateParam.year][dateParam.valueOfYear - 1] : {};
      if (dateParam.valueOfYear == 53 && obj == null) {
        obj = this.weekListMap[dateParam.year][dateParam.valueOfYear - 2];
      }
      retObj = {
        startDate: obj.startDate,
        endDate: obj.endDate
      };
      //            returnValue = obj.startDate + ' ~ ' + obj.endDate
    } else {
      let month = `${dateParam.year}-${(dateParam.valueOfYear < 10 ? '0' : '') + dateParam.valueOfYear}`;
      //            returnValue = month + '-01 ~ ' + month + '-' + this.endDateOfMonthMap[dateParam.valueOfYear];

      retObj = {
        startDate: `${month}-01`,
        endDate: `${month}-${this.endDateOfMonthMap[dateParam.valueOfYear]}`
      };
    }
    return retObj;
  }
}
