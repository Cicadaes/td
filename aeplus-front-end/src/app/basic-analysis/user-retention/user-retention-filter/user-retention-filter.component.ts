import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {NzMessageService} from 'ng-cosmos-ui';
import * as differenceInDays from 'date-fns/difference_in_days';
import {Globals} from '../../../utils/globals';
import {UserRetentionService} from '../user-retention.service';

@Component({
    selector: 'app-user-retention-filter',
    templateUrl: './user-retention-filter.component.html',
    styleUrls: ['./user-retention-filter.component.less']
})
export class UserRetentionFilterComponent implements OnInit, OnChanges {
    @Output() onBack = new EventEmitter<any>();
    _dateFormat = 'yyyy-MM-dd';
    _today = new Date();
    _dateRange;
    _dateRangeOld;
    backDateRange: any[];
    _selectCustom: any;
    _selectCustomValue: any = 'newuser';
    _selectBehaviorType: any;
    _selectBehaviorTypeValue: any;
    _selectEvent: any;
    _selectEventValue: any;
    _dataFilter: any;
    _isInited: boolean;

    constructor(private message: NzMessageService, private globals: Globals, private service: UserRetentionService) {
    }

    _disabledDate = (current: Date): boolean => {
        return differenceInDays(current, this._today) > 0; // || differenceInDays(current, this._today) < -365;
    }

    _initDateRange() {
        if (!this._dateRange) {
            const date = this.globals.getDateRangeByLastDay(-6);
            this._dateRange = [new Date(date.start), new Date(date.end)];
        }
        this.onBackDateRange();
    }

    onBackDateRange() {
        if (this._dateRange && this._dateRange.length === 2) {
            const start = this.globals.dateFormat(this._dateRange[0].getTime(), 'day');
            const end = this.globals.dateFormat(this._dateRange[1].getTime(), 'day');
            this._dateRangeOld = this._dateRange;
            this.backDateRange = [start, end];
        }
    }

    _changeDaterange(value: any) {
        const days = this.globals.getDateDays(this._dateRange[0], this._dateRange[1]);
        console.dir(days);
        if (days > 365) {
            setTimeout(() => {
                this._dateRange = this._dateRangeOld;
            }, 100);
            this.message.create('warning', '时间范围不能超过一年');
            return false;
        }
        this._dateRange = value;
        this.onBackDateRange();
    }

    onSelectCustom(data: any) {
        this._selectCustomValue = data.value;
    }

    initSelectEvent() {
        const parentId = this._selectBehaviorTypeValue || '';
        this._selectEvent = {
            solid: true,
            apiUrl: this.service.queryEventPagingUrl + parentId + '&page=',
            apiType: 'get',
            apiData: true,
            apiPaging: true,
            apiSearch: true,
            keywordFiled: 'searchName',
            initFirst: true,
//      keywordFiled: 'searchName',
            apiParam: {}
        };
    }

    onSelectBehaviorType(data: any) {
        if (data) {
            this._selectBehaviorTypeValue = data.value || null;
        }
        this._selectEventValue = '';
        this.initSelectEvent();
    }

    onSelectEvent(data: any) {
        this._selectEventValue = '';
        if (data) {
            this._selectEventValue = data.value;
        }
        if (!this._isInited) {
            this._isInited = true;
            this.search();
        }
    }

    search() {
        this._dataFilter = {
            dateRange: this.backDateRange,
            user: this._selectCustomValue,
            behaviorType: this._selectBehaviorTypeValue,
            event: this._selectEventValue
        };
        this.onBack.emit(this._dataFilter);
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    querySelectBehaviorType() {
        this._selectBehaviorType = {
            apiData: true,
            apiType: 'get',
            apiUrl: this.service.queryEventTypeUrl,
            apiParam: {
                /*mark: 'keep',
                productid: this.globals.getProductIdByStorage(),
                dictCode: 'eventtype',
                keyword: '',
                page : 1,
                pageSize : 20*/
            },
            initValue: this._selectBehaviorTypeValue,
            defaultLabel: '请选择',
            selectOptions: []
        };
//    this.initSelectEvent();
    }

    ngOnInit() {
        this._selectCustom = {
            apiData: false,
            initValue: this._selectCustomValue,
            selectOptions: [{
                value: 'newuser',
                label: '新增访客'
            }, {
                value: 'launchuser',
                label: '活跃访客'
            }]
        };
        this.querySelectBehaviorType();
        this._initDateRange();
    }

}
