import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../@themes/scroll-service';
import { GatewayRouteervice } from './gateway-route.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-gateway-route',
    templateUrl: './gateway-route.component.html',
    styleUrls: ['./gateway-route.component.css']
})
export class GatewayRouteComponent implements OnInit {
    moreSearchArray: any = [
        {
            id: 1,
            fieldName: 'name',
            fieldLabel: '规则名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'originUrl',
            fieldLabel: '原始路径',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'routingType',
            fieldLabel: '映射方式',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: 1,
                label: 'URL映射'
            }, {
                value: 2,
                label: 'ServiceId映射'
            }]
        }, {
            id: 4,
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
                label: '已发布'
            }, {
                value: 0,
                label: '未发布'
            }]
        }
    ];                       // 搜索组件数组
    queryParams: any;        // 查询列表请求参数
    _pageIndex = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    addFlag = false;
    editFlag = false;
    editData: any = {};

    constructor(
        private service: GatewayRouteervice,
        private activeRoute: ActivatedRoute,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private nzNotificationService: NzNotificationService) {
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
        params.orderBy = 'createTime';
        params.order = 'desc';


        this.service.getWayRouteList(params).then((data: any) => {
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

    // 查看返回码
    detail(one: any) {
        this.editData = one;
    }

    // 删除
    delete(one: any) {
        this.modalService.confirm({
            nzMaskClosable: false,
            nzTitle: `你确认要删除此路由规则吗？`,
            nzContent: '删除后无法恢复，你还要继续吗？',
            nzOnOk: () => {
                this.service.deletegWayRoute(one.id).then((response: any) => {
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
            title = `你确定要下线${item.name}吗？`;
            content = `下线后，API网关将不能使用此规则进行请求路由转发。`;
        } else {
            title = `你确定要发布${item.name}吗？`;
            content = `发布后，API网关可以使用此规则进行请求路由转发。`;
        }
        this.modalService.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                const obj = {};
                obj['id'] = item.id;
                obj['status'] = item.status ? 0 : 1;
                that.service.updateWayRoute(obj).then((data: any) => {
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
