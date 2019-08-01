import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AuthLicencesTableService } from './auth-licences-table.service';
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
    selector: 'auth-licences-table',
    templateUrl: './auth-licences-table.component.html',
    styleUrls: ['./auth-licences-table.component.css']
})

export class AuthLicencesTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() licenceId: any;
    isShowAddAppModal: boolean = false;
    isShowInstanceModal: boolean = false;
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    tenant: any;

    constructor(private scrollSer: ScrollToTopService, private service: AuthLicencesTableService) {

    }
    reset() {
        this.refreshData(true);
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.page = this._current;
        params.rows = this._pageSize;
        params.licenceId = this.licenceId;

        this.service.getAuthLicences(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
            this.scrollSer.scrollToTop();
        }).catch((err: any) => {
            console.log(err);
        });

    }
    showInstanceModal(data: any) {
        console.dir('data:' + data);
        this.isShowInstanceModal = true;
        this.tenant = data;
    }

    hideInstanceModal() {
        this.isShowInstanceModal = false;
    }
    ngOnChanges(changes: SimpleChanges) {
        this.queryParams = changes.queryParams.currentValue || {};
        this.reset();
    }

    ngOnInit() {
    }
}
