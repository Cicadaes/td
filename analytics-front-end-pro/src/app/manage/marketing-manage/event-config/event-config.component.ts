import {Component, OnInit, OnChanges} from '@angular/core';
import {MarketingManageService} from '../marketing-manage.service';
import {CommonService} from '../../../common/services/common.service';
import {TABLE_PAGE_SIZE_OPTIONS} from '../../../common/config/page.size.config';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
    selector: 'app-event-config',
    templateUrl: './event-config.component.html',
    styleUrls: ['./event-config.component.less']
})
export class EventConfigComponent implements OnInit {

    productId: number;                      // 产品ID
    eventData: any;                         // 指标table Data
    eventTableLoading: boolean;             // 指标table的loading
    pageSizeOptions: any[];                 // 指标table 分页options
    itemObj: any;                           // 删除指标维度相关信息
    addFlag = false;                        // 新建指标弹框显示flag
    isVisible = false;
    removeFlag = false;                     // 删除弹框
    _item: any;                             // 待删除的某条数据
    // 分页数据
    _pageIndex = 1;                         // 当前页
    _pageSize = 10;                         // 每页条数
    _total = 1;                             // 数据总量
    parmas: any = {};                       // 查询指标列表参数
    editData: any;                          // 编辑时的当前数据
    editFlag: boolean;
    serachParam: any;

    constructor(private marketingManageService: MarketingManageService,
                private commonService: CommonService,
                private notification: NzNotificationService) {
    }

    ngOnInit() {
        if (localStorage.getItem('productId')) {
            this.productId = Number(localStorage.getItem('productId'));
        }

        this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;
        this.parmas = {
            page: 1,
            pageSize: 10,
            productId: this.productId
        };
        this.getEventList(this.parmas);
    }

    /* 指标列表查询 */
    getEventList(value: any) {
        this.marketingManageService.getEventList(value).subscribe((response: any) => {
            this.eventTableLoading = false;
            if (response.code === 200) {
                // response.data.data.map((one) => {
                //     one.scope = one.scope.split(',');
                // });
                this.eventData = response.data.data;
                this._total = response.data.total;
            } else {
                this.notification.create('warning', '错误提示', response.message);

            }
        });
    }

    // 改变页码
    PageIndexChange(e: number) {
        this.eventData = [];
        if (this._pageIndex === e) {
            this.parmas.page = e;
            this.eventTableLoading = true;
            this.getEventList(this.parmas);
        } else {
            this._pageIndex = e;
        }
    }

    // 改变每页数量
    PageSizeChange(e: any) {
        this.eventTableLoading = true;
        this.parmas.pageSize = this._pageSize;
        this.PageIndexChange(1);
    }

    /**
     * 根据name搜索指标列表
     */
    serach(event: any) {
        const that = this;
        if (event.keyCode === 13) {
            that.eventTableLoading = true;
            that._pageIndex = 1;
            that.parmas.page = that._pageIndex;
            if (that.serachParam) {
                that.parmas.name = that.serachParam;
            } else {
                if (that.parmas.name) {
                    delete that.parmas.name;
                }
            }
            that.getEventList(that.parmas);
        }
    }

    // 新建维度  -- 弹框
    create() {
        this.isVisible = true;
        this.editFlag = false;
    }

    // 隐藏新建维度 -- 弹框
    hideDialog(type: any) {
        this.isVisible = false;
        this.editFlag = false;
    }

    // 保存维度结果
    saveDate() {
        this.isVisible = false;
        this.eventTableLoading = true;
        this.getEventList(this.parmas);
    }

    // 编辑人群维度
    edit(item: any) {
        this.isVisible = true;
        this.editFlag = true;
        this.editData = item;
    }

    // 删除事件
    delete(item: any) {
        this.removeFlag = true;
        this._item = item;
        if (item.status === 0) {
            this.itemObj = {
                type: 'information',
                message: `请确认是否禁用事件"${this._item['name']}"?`,
                status: 1
            };
            // this._item.status = 0;
        } else {
            // this._item.status = 1;
            this.itemObj = {
                type: 'information',
                message: `请确认是否启用事件"${this._item['name']}"?`,
                status: 0
            };
        }
    }

    // 确定删除
    confirmHideDialog(type: any) {
        const that = this;
        if (this._item.status === 0) {
            this._item.status = -1;
        } else {
            this._item.status = 0;
        }
        this.marketingManageService.updateEvent(that._item).subscribe((response) => {
            if (response.code === 200) {
                this.removeFlag = false;
                that.eventTableLoading = true;
                this.getEventList(this.parmas);
            } else {
                this.removeFlag = false;
                this.notification.create('warning', '错误提示', response.message);
            }
        }, (err: any) => {
            this.removeFlag = false;
        });
    }

    // 取消删除
    hideItemDialog(type: any) {
        this.removeFlag = false;
    }

}
