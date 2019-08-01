import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LogsService } from '../logs.service';
import { ScrollToTopService } from '../../../@themes/scroll-service';

@Component({
    selector: 'tenant-log-table',
    templateUrl: './tenant-log-table.component.html',
    styleUrls: ['./tenant-log-table.component.css']
})

export class TenantLogTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any = {};
    @Input() isReloadData = false;

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
        this.scrollSer.scrollToTop();
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
            }
            this._loading = false;
            this.isReloadData = false;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const key in changes) {
            if (key === 'queryParams' && changes.queryParams.currentValue != null) {
                this.queryParams = changes.queryParams.currentValue || {};
                this.reset();
            } else if (key === 'isReloadData' && changes.isReloadData.currentValue != null) {
                this.isReloadData = changes.isReloadData.currentValue || false;
                if (this.isReloadData === true) {
                    this.reset();
                }
            }
        }
    }

    ngOnInit() {
    }
}
