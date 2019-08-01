import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ResponseCodeService } from './response-code.service';
import { ScrollToTopService } from '../../@themes/scroll-service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-response-code',
    templateUrl: './response-code.component.html',
    styleUrls: ['./response-code.component.css']
})
export class ResponseCodeComponent implements OnInit {
    responseCodeArray: any = [
        {
            id: 1,
            fieldName: 'code',
            fieldLabel: '返回码',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'catalogId',
            fieldLabel: '适用产品',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{ label: '全部', value: '' }]
        }
    ];
    queryParams: any;
    currentApp: any;
    _pageIndex = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    addFlag = false;
    editFlag: any = 'add';
    editData: any = {};
    pDataList: any = [];
    detailFlag: boolean;

    constructor(
        private service: ResponseCodeService,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private notificationService: NzNotificationService
    ) {
    }

    ngOnInit() {
        this.getProduct();
        this.refreshData(true);
    }

    // 获取产品列表
    getProduct() {
        this.service.getProduct().then((data: any) => {
            if (data.code === 200) {
                this.pDataList = [];
                this.pDataList.unshift({ label: '全部', value: '' });
                if (data.data.data.length) {
                    this.pDataList.push({ label: '所有产品', value: '0' });
                    for (let i = 0; i < data.data.data.length; i++) {
                        this.pDataList.push({
                            label: data.data.data[i].name,
                            value: data.data.data[i].id.toString()
                        });
                    }
                }
                this.initResponseCodeArray();
            }

        }).catch((err: any) => {
        });
    }

    initResponseCodeArray(): void {
        this.responseCodeArray = [
            {
                id: 1,
                fieldName: 'code',
                fieldLabel: '返回码',
                fieldType: 'input'
            }, {
                id: 3,
                fieldName: 'catalogId',
                fieldLabel: '适用产品',
                fieldType: 'select',
                apiData: false,
                initValue: '',
                selectOptions: this.pDataList
            }
        ];
    }

    onSearchResponseCodeList(params: any) {
        this.queryParams = {};
        for (const key in params) {
            if (params[key] !== null && params[key] !== '') {
                this.queryParams[key] = params[key];
            }
        }
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

        this.service.getResponseCode(params).then((data: any) => {
            if (data.code === 200) {
                this._loading = false;
                this._total = data.data.total;
                this._dataSet = data.data.data;
                this.scrollSer.scrollToTop();
            }

        }).catch((err: any) => {
        });
    }

    // 新增返回码
    addCode() {
        this.addFlag = true;
        this.editFlag = 'add';
    }

    // 编辑返回码
    edit(one: any) {
        this.addFlag = true;
        this.editFlag = 'edit';
        this.editData = one;
    }

    // 查看返回码
    detail(one: any) {
        this.detailFlag = true;
        this.editData = one;
    }

    // 删除
    delete(one: any) {
        this.service.getDeleteStatus(one.code).then((data: any) => {
            if (data.code === 200) {
                this.modalService.confirm({
                    nzMaskClosable: false,
                    nzTitle: '你确定要删除返回码“' + one.code + '”吗？',
                    nzContent: '<p style="color: red;">删除后无法恢复，你还要继续吗？</p>',
                    nzOnOk: () => {
                        this.service.deleteResponseCode(one.code).then((response: any) => {
                            if (response.code === 200) {
                                this._loading = true;
                                this.refreshData(true);
                            }
                        }).catch((err: any) => {
                        });
                    }
                });
            } else {
                this.modalService.warning({
                    nzTitle: '返回码“' + one.code + '”已被API接口引用，请先删除引用再删除此返回码。',
                    nzOkText: '知道了'
                });
            }
        }).catch((err: any) => {

        });
    }

    // 隐藏新建弹框
    hideDialog(type: any) {
        this.addFlag = false;
        this.editFlag = 'add';
    }

    hideDetailDialog(type: any) {
        this.detailFlag = false;
    }

    // 保存编辑或新建的数据
    saveDate() {
        this.editFlag = 'add';
        this.addFlag = false;
        this._loading = true;
        this.refreshData(true);
    }
}
