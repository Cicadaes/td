import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
import { ApiAccountService } from '../../api-account.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-tenant-table',
    templateUrl: './tenant-table.component.html',
    styleUrls: ['./tenant-table.component.css']
})
export class TenantTableComponent implements OnInit {
    moreSearchArray: any = [
        {
            id: 1,
            fieldName: 'name',
            fieldLabel: 'API账号名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'apiKey',
            fieldLabel: 'APIKey',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'status',
            fieldLabel: '状态',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: 1,
                label: '正常'
            }, {
                value: 0,
                label: '禁用'
            }]
        }
    ];
    queryParams: any;        // 查询列表请求参数
    _pageIndex = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    addFlag = false;
    editFlag = false;
    editData: any = {};
    tenantId: any;
    rolecode: any;
    constructor(
        private service: ApiAccountService,
        private activeRoute: ActivatedRoute,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private nzNotificationService: NzNotificationService) {
        this.rolecode = window['appConfig'].rolecode;
        this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            this.tenantId = window['appConfig'].tenant.id;
        }
        console.log('this.tenantId', this.tenantId, this.rolecode);
    }

    ngOnInit() {
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
        if (this.tenantId) {
            params.tenantId = this.tenantId;
        }

        this.service.getAccountsList(params).then((data: any) => {
            if (data.code === 200) {
                this._loading = false;
                this._total = data.data.total;
                this._dataSet = data.data.data;
                this.scrollSer.scrollToTop();
            }
        }).catch((err: any) => {
        });
    }

    onMoreSearch(params: any) {
        this.queryParams = {};
        for (const key in params) {
            if (params[key] !== null && params[key] !== '') {
                this.queryParams[key] = params[key];
            }
        }
        this.refreshData(true);
    }

    // 产变路由状态
    changeStatus(value: any, item: any) {
        const that = this;
        let title, content;
        if (item.status === 1 || item.status === '1' || item.status === true) {
            title = `你确定要禁用${item.companyName}的${item.name}吗？`;
            content = `禁用后，租户将不能使用此API账号访问有权限的API，你确定吗？`;
        } else {
            title = `你确定要启用${item.companyName}的${item.name}吗？`;
            content = `启用后，租户将可以使用此API账号访问有权限的API，你确定吗？`;
        }
        this.modalService.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                const obj = {};
                obj['id'] = item.id;
                obj['status'] = item.status ? 0 : 1;
                that.service.updateAccounts(obj).then((data: any) => {
                    if (data.code === 200) {
                        that._loading = true;
                        that.refreshData(true);
                    } else {
                        this.nzNotificationService.create('warning', '错误提示', data.message);
                    }
                }).catch((err: any) => {
                });
            }
        });
    }
}
