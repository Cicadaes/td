import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { ApiService } from '../api.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-version-list',
    templateUrl: './version-list.compontent.html',
    styleUrls: ['./version-list.compontent.css']
})
export class VersionListComponent implements OnInit, OnChanges {
    queryParams: any;
    currentApp: any;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    versionData: any = [];
    loading = true;
    addVersionFlag = false;
    editVersionFlag: any = 'add';
    editVersionData: any;
    catalogList: any = [];
    catalogObj: any = {
        catalogId: '',
        catalogName: ''
    };
    _productList: any;
    _nowData: any;
    catalogId: any;
    searchValue: any;
    @Input() set nowData(value: any) {
        this._nowData = value;
        this.queryParams = {};
        this.catalogObj = {
            catalogId: this._nowData.value,
            catalogName: this._nowData.label,
        };
        if (this._nowData.label) {
            this.queryParams['catalogId'] = this._nowData.value;
            this.catalogId = this._nowData.value;
        }
        this.refreshData(true);
    }
    constructor(
        private service: ApiService,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private notificationService: NzNotificationService
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    // 根据版本模糊搜索
    onSearch(event: any, type: any) {
        const that = this;
        if (type === 'click') {
            if (event) {
                event = event.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.queryParams = { version: event };
            that.refreshData(true);
        } else {
            if (event.keyCode === 13) {
                if (that.searchValue) {
                    that.searchValue = that.searchValue.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.queryParams = { version: that.searchValue };
                that.refreshData(true);
            }
        }
    }

    // 获取版本列表
    refreshData(reset = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = this.queryParams || {};
        if (this.catalogId) {
            params['catalogId'] = this.catalogId;
        }
        params.page = this.pageIndex;
        params.pageSize = this.pageSize;

        this.service.getVersionList(params).then((data: any) => {
            if (data.code === 200) {
                this.loading = false;
                this.versionData = [];
                this.total = data.data.total;
                data.data.data.forEach((one: any) => {
                    if (one.status === '1' || one.status === 1) {
                        one.copyStatus = true;
                    } else {
                        one.copyStatus = false;
                    }
                    this.versionData.push(one);
                });
                this.scrollSer.scrollToTop();
            } else {
                this.notificationService.create('warning', '错误提示', data.message);
            }
        }).catch((err: any) => {
        });
    }

    // 添加版本
    addVersion() {
        this.editVersionFlag = 'add';
        this.addVersionFlag = true;
    }

    // 编辑
    edit(one: any) {
        this.editVersionFlag = 'edit';
        this.addVersionFlag = true;
        this.editVersionData = one;
    }

    // 删除
    delete(one: any) {
        const that = this;
        if (one.status === 1) {
            this.modalService.warning({
                nzTitle: `请先禁用${one.catalogName}的${one.version}版本再进行删除`,
                nzOkText: '知道了'
            });
        } else {
            this.modalService.confirm({
                nzMaskClosable: false,
                nzTitle: `你确定要删除${one.catalogName}的${one.version}版本及此版本下的API信息吗?`,
                nzContent: '<p style="color: red;">删除后无法恢复，你还要继续吗？</p>',
                nzOnOk: () => {
                    that.service.deleteVersion(one.id).then((data: any) => {
                        if (data.code === 200) {
                            that.loading = true;
                            that.refreshData(true);
                        } else {
                            this.notificationService.create('warning', '错误提示', data.message);
                        }
                    }).catch((err: any) => {
                    });
                }
            });
        }
    }

    // 复制
    copy(one: any) {
        this.editVersionFlag = 'copy';
        this.addVersionFlag = true;
        this.editVersionData = one;
    }

    // 启用或者禁用版本状态
    changeStatus(value: any, item: any) {
        const that = this;
        let title, content;
        if (item.status === 1 || item.status === '1') {
            title = `你确定要禁用${item.catalogName}的${item.version}版本吗`;
            content = `禁用后用户将无法查看此版本下所有API的使用帮助，你还要继续吗？`;
        } else {
            title = `你确定要启用${item.catalogName}的${item.version}版本吗？`;
            content = `启用后用户将能查看此版本下所有API的使用帮助，你还要继续吗？`;
        }
        this.modalService.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                const obj = {};
                obj['id'] = item.id;
                obj['status'] = item.status ? 0 : 1;
                that.service.updateVersion(obj).then((data: any) => {
                    if (data.code === 200) {
                        that.loading = true;
                        that.refreshData(true);
                    } else {
                        this.notificationService.create('warning', '错误提示', data.message);
                    }
                }).catch((err: any) => {
                });
            }
        });
    }

    // 隐藏新建弹框
    hideVersionDialog($event: any) {
        this.addVersionFlag = false;
        // this.editVersionFlag = 'add';
    }

    // 保存新建、编辑分类弹框
    saveVersionDate() {
        this.addVersionFlag = false;
        // this.editVersionFlag = 'add';
        this.refreshData(true);
    }
}
