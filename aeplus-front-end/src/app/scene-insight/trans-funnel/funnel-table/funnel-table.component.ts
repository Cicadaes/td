import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {FunnelTableService} from './funnel-table.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-funnel-table',
    templateUrl: './funnel-table.component.html',
    styleUrls: ['./funnel-table.component.less'],
    providers: [FunnelTableService]
})
export class FunnelTableComponent extends BaseComponent implements OnInit, OnChanges {

    laoding: boolean;
    page: number;       // table页数
    pageSize: number;   // table每页条数
    total: number;         // table列表总条数
    tableList: any;       // 测试数据

    removeFlag = false;             // 删除弹框
    itemObj: any;
    _item: any;
    urlParams: any;

    constructor(private funnelTableService: FunnelTableService,
                private injector: Injector) {

        super(injector);
        this.initRouterList('转化漏斗');

        this.buildUrlParams();
        const that = this;

        that.laoding = false;
        that.page = 1;
        that.pageSize = 10;
        that.total = 100;
    }

    goToAdd() {

        this.commonService.goInto({
            name: '添加漏斗',
            url: `/scene-insight/trans-funnel/add`,
            params: this.urlParams
        });

    }

    buildUrlParams() {
        this.urlParams = {};
    }

    ngOnInit() {
        const that = this;
        that.getList();
    }

    getList() {
        const that = this;
        const json = {
            page: that.page,
            rows: that.pageSize,
            sort: 'id',
            order: 'desc',
            productId: that.productId
        };
        this.funnelTableService.getFunnelList(json).subscribe((response: any) => {
            if (json.page === that.page && json.rows === that.pageSize) {
                that.tableList = response.list;
                that.total = response.total;
            }
        });
    }

    remove(data: any) {
        this._item = data;
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: `确定要删除漏斗"${data.name}"？`,
            nzOnOk: () => {
                this.funnelTableService.deleteFunnel(this._item.id).subscribe((response: any) => {
                    this.getList();
                });
            }
        });
    }

    // 确定删除 todo -del
    confirmHideDialog(type: any) {
        this.removeFlag = type;
        this.funnelTableService.deleteFunnel(this._item.id).subscribe((response: any) => {
            this.getList();
        });
    }

    // 取消删除
    hideItemDialog(type: any) {
        this.removeFlag = type;
    }

    // 查看详情
    detail(item: any) {

        this.commonService.goInto({
            name: '查看漏斗',
            url: `/scene-insight/trans-funnel/view`,
            params: {
                funnelId: item.id
            }
        });
    }

    edit(item: any) {

        this.commonService.goInto({
            name: '编辑漏斗',
            url: `/scene-insight/trans-funnel/edit`,
            params: {
                funnelId: item.id
            }
        });
    }

}
