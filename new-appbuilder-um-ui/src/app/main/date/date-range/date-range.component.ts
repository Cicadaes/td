import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.css'],
    providers: []
})

export class DateRangeComponent implements OnInit, OnDestroy, OnChanges {
    @Output() onSelect = new EventEmitter<any>();
    @Input() initDateRange: any[];
    @Input() noLimit: boolean;

    _dateRange: any;
    _datePlaceholder: any[] = ['开始日期', '结束日期'];
    _selectedDateRange: any;
    dateFormat = 'yyyy-MM-dd';
    period: any;
    @Input()
    set disabled(data: any) {
        if (data == 1) {
            this.period = 1;
        } else if (data == 0) {
            this.period = 0;
        } else {
            this.period = 2;
        }
    }
    constructor() {
    }

    _disabledDate1(current: Date): any {
        const date = new Date();
        if (current) {
            if (((current.getTime() + 86400000) - date.getTime() >= 0)) {
                return false;
            } else {
                return true;
            }
        }
    }

    _disabledDate(current: Date): any {
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
            // this._dateRange[0] = new Date(changes.initDateRange.currentValue[0]);
            // this._dateRange[1] = new Date(changes.initDateRange.currentValue[1]);
            this._dateRange = [new Date(changes.initDateRange.currentValue[0]), new Date(changes.initDateRange.currentValue[1])];

        }
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

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
