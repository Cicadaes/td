import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
import { ApiAccountService } from '../../api-account.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-oper-table',
    templateUrl: './oper-table.component.html',
    styleUrls: ['./oper-table.component.css']
})
export class OperTableComponent implements OnInit {
    moreSearchArray: any;    // 搜索组件数组
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
        if (this.tenantId) {
            this.moreSearchArray = [
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
        } else {
            this.moreSearchArray = [
                {
                    id: 1,
                    fieldName: 'companyName',
                    fieldLabel: '所属租户名称',
                    fieldType: 'input'
                }, {
                    id: 2,
                    fieldName: 'name',
                    fieldLabel: 'API账号名称',
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
                }, {
                    id: 4,
                    fieldName: 'apiKey',
                    fieldLabel: 'APIKey',
                    fieldType: 'input'
                }
            ];
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

    // 新增域名前缀
    add() {
        this.addFlag = true;
        this.editFlag = false;
    }

    // 编辑返回码
    edit(one: any) {
        this.addFlag = true;
        this.editFlag = true;
        this.editData = one;
    }

    // 删除
    delete(one: any) {
        this.modalService.confirm({
            nzMaskClosable: false,
            nzTitle: `您确认要删除租户"${one.companyName}"的API账号"${one.name}"吗？`,
            nzContent: '<p style="color: red;">删除后租户无法使用此API账号访问对应的API，你还要继续吗？</p>',
            nzOnOk: () => {
                this.service.deleteAccounts(one.id).then((response: any) => {
                    if (response.code === 200) {
                        this._loading = true;
                        this.refreshData(true);
                    } else {
                        this.nzNotificationService.create('warning', '错误提示', response.message);
                    }

                }).catch((err: any) => {
                });
            }
        });
    }

    // 隐藏新建弹框
    hideDialog(type: any) {
        this.addFlag = false;
        this.editFlag = false;
    }

    // 保存编辑或新建的数据
    saveDate() {
        this.editFlag = false;
        this.addFlag = false;
        this._loading = true;
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
