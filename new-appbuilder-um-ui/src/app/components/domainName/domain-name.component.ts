import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ScrollToTopService } from '../../@themes/scroll-service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import { DomainNameService } from './domain-name.service';

@Component({
    selector: 'app-domain-name',
    templateUrl: './domain-name.component.html',
    styleUrls: ['./domain-name.component.css']
})
export class DomainNameComponent implements OnInit {
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
    domainNameArray: any = [
        {
            id: 1,
            fieldName: 'name',
            fieldLabel: '名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'domain',
            fieldLabel: '域名前缀',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'catalogId',
            fieldLabel: '适用产品',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }]
        }
    ];
    detailFlag: boolean;


    constructor(
        private service: DomainNameService,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private nzNotificationService: NzNotificationService
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
                this.initDomainNameArray();
            }

        }).catch((err: any) => {
        });
    }

    initDomainNameArray(): void {
        this.domainNameArray = [
            {
                id: 1,
                fieldName: 'name',
                fieldLabel: '名称',
                fieldType: 'input'
            }, {
                id: 2,
                fieldName: 'domain',
                fieldLabel: '域名前缀',
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

    onSearchDomainNameList(params: any) {
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

        this.service.getDomainName(params).then((data: any) => {
            if (data.code === 200) {
                this._loading = false;
                this._total = data.data.total;
                this._dataSet = data.data.data;
                this.scrollSer.scrollToTop();
            }
        }).catch((err: any) => {
        });
    }

    // 新增域名前缀
    add() {
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
        this.service.getDeleteStatus(one.name).then((data: any) => {
            if (data.code === 200) {
                this.modalService.confirm({
                    nzMaskClosable: false,
                    nzTitle: '你确定要删除域名前缀“' + one.name + '”吗？',
                    nzContent: '<p style="color: red;">删除后无法恢复，你还要继续吗？</p>',
                    nzOnOk: () => {
                        this.service.deleteDomainName(one.name).then((response: any) => {
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
            } else {
                this.modalService.warning({
                    nzTitle: '域名前缀“' + one.name + '”已被API接口引用，请先删除引用再删除该域名前缀。',
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
