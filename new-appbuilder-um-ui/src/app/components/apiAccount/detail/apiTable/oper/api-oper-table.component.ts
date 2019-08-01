import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';
import { ApiAccountService } from '../../../api-account.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-api-oper-table',
    templateUrl: './api-oper-table.component.html',
    styleUrls: ['./api-oper-table.component.css']
})
export class ApiOperTableComponent implements OnInit {
    moreSearchArray: any = [
        {
            id: 1,
            fieldName: 'catalogId',
            fieldLabel: 'API所属产品',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }]
        }, {
            id: 2,
            fieldName: 'metaName',
            fieldLabel: 'API名称',
            fieldType: 'input',
        }
    ];
    queryParams: any;        // 查询列表请求参数
    _pageIndex = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    tenantId: any;
    rolecode: any;
    accountId: any;
    productOptions: any;
    /*checkbox使用变量*/
    _allChecked = false;
    _indeterminate = false;
    _checkList: any = [];      // 选中的项
    addFlag: any = false;      // 授权API弹框
    constructor(
        private service: ApiAccountService,
        private activeRoute: ActivatedRoute,
        private scrollSer: ScrollToTopService,
        private nzNotificationService: NzNotificationService,
        private modalService: NzModalService) {
        this.rolecode = window['appConfig'].rolecode;
        this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        this.accountId = this.activeRoute.snapshot.params['id'];
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            this.tenantId = window['appConfig'].tenant.id;
        }
        console.log('this.tenantId', this.tenantId, this.rolecode);
    }

    ngOnInit() {
        this.getProduct();
        this.refreshData(true);
    }

    // 获取选择产品列表
    getProduct() {
        this.service.getProduct().then((data: any) => {
            this.productOptions = [];
            if (data.code === 200) {
                this.productOptions.push({ label: '全部', value: '' });
                if (data.data.data.length) {
                    for (let i = 0; i < data.data.data.length; i++) {
                        this.productOptions.push({
                            label: data.data.data[i].name,
                            value: data.data.data[i].id.toString()
                        });
                    }
                    this.initMoreSearchArray();
                }
            }
        }).catch((err: any) => {
        });
    }

    initMoreSearchArray() {
        this.moreSearchArray = [
            {
                id: 1,
                fieldName: 'catalogId',
                fieldLabel: 'API所属产品',
                fieldType: 'select',
                apiData: false,
                initValue: '',
                selectOptions: this.productOptions
            }, {
                id: 2,
                fieldName: 'metaName',
                fieldLabel: 'API名称',
                fieldType: 'input',
            }
        ];
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
                if (this._total) {
                    this._refreshStatus();
                } else {
                    this._allChecked = false;
                    this._indeterminate = false;
                }
                this.scrollSer.scrollToTop();
            } else {
                this.nzNotificationService.warning('错误提示', data.message);
            }
        }).catch((err: any) => {
        });
    }

    // 全选逻辑
    _checkAll(value: boolean) {
        if (value) {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = true;
            });
        } else {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = false;
            });
        }
        this._refreshStatus();
    }

    // 单选逻辑
    _refreshStatus() {
        const allChecked = this._dataSet.every((value: any) => value.checked === true);
        const allUnChecked = this._dataSet.every((value: any) => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this.callbackSelect();
    }

    // 改变选中状态
    callbackSelect() {
        this._checkList = [];
        this._dataSet.forEach((user: any, index: any) => {
            if (user.checked) {
                this._checkList.push(user);
            }
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

    // 保存授全API
    save(data: any) {
        this.addFlag = false;
        this.refreshData(true);
    }

    // 保存授全API
    hideDialog(data: any) {
        this.addFlag = false;
    }

    // 授权API
    add() {
        this.addFlag = true;
    }

    // 单个授权过的API删除
    delete(value: any) {
        this.modalService.confirm({
            nzMaskClosable: false,
            nzTitle: `您确认要删除API账号对API"${value.metaName}"的访问授权吗？`,
            nzContent: '<p style="color: red;">删除后租户无法使用此API账号访问对应的API，你还要继续吗？</p>',
            nzOnOk: () => {
                this.service.deleteApi(value.id).then((data: any) => {
                    if (data.code === 200) {
                        this._loading = true;
                        this._checkList = [];
                        this.refreshData(true);
                    } else {
                        this.nzNotificationService.warning('错误提示', data.message);
                    }
                }).catch((err: any) => {
                });
            }
        });
    }

    initKey() {
        this._checkList.array.forEach(element => {
            return element.id;
        });
    }

    // 批量删除授权的api
    deleteAll() {
        if (this._checkList.length) {
            const arr = [];
            let str;
            this._checkList.forEach(element => {
                arr.push(element.id);
            });
            str = arr.join(',');
            this.modalService.confirm({
                nzMaskClosable: false,
                nzTitle: `您确认要删除API账号对如下所选API的访问授权吗？`,
                nzContent: '',
                nzOnOk: () => {
                    this.service.deleteAllApi(str).then((data: any) => {
                        if (data.code === 200) {
                            this._checkList = [];
                            this._loading = true;
                            this.refreshData(true);
                        } else {
                            this.nzNotificationService.warning('错误提示', data.message);
                        }
                    }).catch((err: any) => {
                    });
                }
            });
        } else {
            this.modalService.warning({
                nzTitle: `请选择要移除授权的API`,
                nzOkText: '知道了'
            });
        }
    }
}
