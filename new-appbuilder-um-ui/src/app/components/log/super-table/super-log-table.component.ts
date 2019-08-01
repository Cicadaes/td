import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LogsService } from '../logs.service';
import { ScrollToTopService } from '../../../@themes/scroll-service';

@Component({
    selector: 'super-log-table',
    templateUrl: './super-log-table.component.html',
    styleUrls: ['./super-log-table.component.css']
})

export class SuperLogTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() isReloadData = false;

    isShowLogModal = false;
    log: any;

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = false;
    _sortValue: any = null;

    constructor(private scrollSer: ScrollToTopService, private service: LogsService) {

    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }

        const params = this.queryParams || {};
        params.page = this._current;
        params.rows = this._pageSize;

        this._loading = true;
        this.service.queryLogByPage(params).then((data: any) => {
            if (data.success === true) {
                this._total = data.total;
                this._dataSet = data.data;
                this.scrollSer.scrollToTop();
            }
            this._loading = false;
            this.isReloadData = false;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.queryParams = changes.queryParams.currentValue || {};
        this.reset();
    }

    ngOnInit() {
        this.reset();
    }
}
