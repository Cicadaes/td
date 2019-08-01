import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css'],
  providers: []
})
export class DateRangeComponent implements OnInit, OnDestroy, OnChanges {
  @Output() onSelect = new EventEmitter<any>();
  @Input() initDateRange: any[];
  @Input() noLimit = true;

  _dateRange: any[] = [];
  _datePlaceholder: any = ['开始日期', '结束日期'];
  _selectedDateRange: any;

  constructor() {}

  _disabledDate(current: Date): boolean {
    return current && current.getTime() > Date.now();
  }

  _changeDateRange() {
    let start = this._dateRange[0];
    let end = this._dateRange[1];

    this.checkExTime();

    if (start && end) {
      start = start.getTime();
      end = end.getTime();
    }

    this._selectedDateRange = {
      start: start,
      end: end
    };
    this.onSelect.emit(this._selectedDateRange);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initDateRange) {
      this._dateRange[0] = new Date(changes.initDateRange.currentValue[0]);
      this._dateRange[1] = new Date(changes.initDateRange.currentValue[1]);
    }
  }

  ngOnInit() {}

  ngOnDestroy() {}

  /**
   * 交换data-range时间
   * @return {[type]} [description]
   */
  private checkExTime() {
    if (this._dateRange[0] && this._dateRange[1]) {
      if (this._dateRange[0].getTime() > this._dateRange[1].getTime()) {
        const temp = this._dateRange[0];
        this._dateRange[0] = this._dateRange[1];
        this._dateRange[1] = temp;
      }
    }
  }
}
