import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'date-single',
    templateUrl: './date-single.component.html',
    styleUrls: ['./date-single.component.css'],
    providers: []
})

export class DateSingleComponent implements OnInit, OnDestroy {
    @Input() isMonth = false;
    @Output() onSelect = new EventEmitter<boolean>();

    _date: any = null;
    _moment: any = null;
    _isMonth = false;
    _disabledDate(current: any) {
        return current && current.getTime() > Date.now();
    }

    _disabledMonth(current: any) {
        return current && moment(current).day(0).valueOf() > moment().valueOf();
    }

    _changeDateSingle() {
        let date = this._date;
        if (this._isMonth) {
            date = this._moment;
        }
        if (date) {
            date = date.getTime();
        }
        this.onSelect.emit(date);
    }

    constructor() {
    }

    ngOnInit() {
        this._isMonth = this.isMonth;
    }

    ngOnDestroy() {

    }

}
