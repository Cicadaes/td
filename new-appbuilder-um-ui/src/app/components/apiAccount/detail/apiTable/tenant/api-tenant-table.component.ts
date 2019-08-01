import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';
import { ApiAccountService } from '../../../api-account.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-api-tenant-table',
    templateUrl: './api-tenant-table.component.html',
    styleUrls: ['./api-tenant-table.component.css']
})
export class ApiTenantTableComponent implements OnInit {
    queryParams: any;        // 查询列表请求参数
    _pageIndex = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    tenantId: any;
    rolecode: any;
    accountId: any;
    search: any;             // 搜索的参数
    apiDocUrl: any;
    constructor(
        private service: ApiAccountService,
        private activeRoute: ActivatedRoute,
        private scrollSer: ScrollToTopService,
        private nzNotificationService: NzNotificationService) {
        this.rolecode = window['appConfig'].rolecode;
        this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        this.accountId = this.activeRoute.snapshot.params['id'];
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            this.tenantId = window['appConfig'].tenant.id;
        }
        console.log('this.tenantId', this.tenantId, this.rolecode);
    }

    ngOnInit() {
        this.getApiDoc();
        this.refreshData(true);
    }

    refreshData(reset = false) {
        if (reset) {
            this._pageIndex = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.page = this._pageIndex;
        params.pageSize = this._pageSize;
        params.accountId = this.accountId;

        this.service.getApiLIst(params).then((data: any) => {
            if (data.code === 200) {
                this._loading = false;
                this._total = data.data.total;
                this._dataSet = data.data.data;
                this.scrollSer.scrollToTop();
            } else {
                this.nzNotificationService.warning('错误提示', data.message);
            }
        }).catch((err: any) => {
        });
    }

    getApiDoc() {
        this.service.getApiDoc().then((response: any) => {
            if (response.code === 200) {
                this.apiDocUrl = response.data;
            } else {
                this.nzNotificationService.warning('错误提示', response.message);
            }
        }).catch((err: any) => {
        });
    }

    onSearch(params: any, type: any) {
        const that = this;
        that.queryParams = {};
        if (type === 'click') {
            if (params) {
                params = params.replace(/(^\s*)|(\s*$)/g, '');
                that.queryParams = {metaName: params};
            }
            that.refreshData(true);
        } else {
            if (params.keyCode === 13) {
                if (that.search) {
                    that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
                    that.queryParams = {metaName: that.search};
                }
                that.refreshData(true);
            }
        }
    }

    goApiDoc(item: any) {
        if (this.apiDocUrl) {
            window.open(`${this.apiDocUrl}/#/api-doc?path=${encodeURIComponent(item.path)}
            &catalogId=${item.catalogId}&name=${encodeURIComponent(item.metaName)}`);
        }
    }
}
