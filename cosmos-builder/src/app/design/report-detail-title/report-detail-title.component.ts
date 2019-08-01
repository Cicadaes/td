import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ElementRef, AfterViewChecked, ViewChild } from '@angular/core';
import { ReportDetailTitleService } from './report-detail-title.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Subscription } from 'rxjs/Subscription';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { Scope } from './createId';
import { DataStore } from 'cosmos-td-sdk';

interface AppState {
    reportTabs: any;
}

@Component({
    selector: 'report-detail-title',
    templateUrl: './report-detail-title.html',
    styleUrls: ['./report-detail-title.less'],
})

export class ReportDetailTitleComponent implements OnInit, OnDestroy {
    status: string = '';
    positionStyles: any = { 'left': '0px' };
    id: number;
    title: Array<any>;
    portdataId: any;
    isOpen: boolean = false;
    active: number = 1;
    total: number;
    leftDisabled: boolean = true;
    rightDisabled: boolean = false;
    switch: boolean = true;
    data: any = {};
    positions: any = [];
    subscription: Subscription;
    isDisabled: boolean;
    @Input() set reportId(id:any) {
        if(id){
            this.portdataId = id
        }
        
    };
    constructor(
        private reportDetailTitleService: ReportDetailTitleService,
        private _notification: CmNotificationService,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private confirmServ: CmModalService,
    ) {
        // this.title = this.route.snapshot.data['title'];
        // this.portdataId = this.route.params['value']['id'];
        // this.title[2]['url'] = `reportconfig/${this.route.snapshot.url[0]['path']}/${this.portdataId}`;
        // if (this.title[1].name == "报表") {
        //     this.store.dispatch({ type: '报表' });
        // }
        this.subscription = this.reportDetailTitleService.missionGrabble$.subscribe((grabble: any) => {
            this.assignment(grabble);
        });
        // 保存成功-再次渲染
        this.subscription = this.reportDetailTitleService.missionsaveOK$.subscribe((data: any) => {
            this.total = data.length;
            if (this.total == 0) {
                this.total = 1
            }
            if (this.total == 1) {
                this.leftDisabled = true;
                this.rightDisabled = true;
            }
            for (var i = 0; i < data.length; i++) {
                this.positions.push({
                    id: data[i].pageNum,
                    index: i + 1,
                    value: data[i].name ? data[i].name : `第${i + 1}页`,
                    showEllipsis: false,
                    writeIN: false,
                    showOpera: false,
                });
            }
        });
        // 查看进入预览-新增进入编辑
        // let params = (this.route.snapshot.params.id).split("?")[1];
        // if (params) {
        //     this.reportDetailTitleService.switchChange(true)
        //     this.switch = true;
        // } else {
        //     this.reportDetailTitleService.switchChange(false)
        //     this.switch = false;
        // }
        this.reportDetailTitleService.switchChange(false)
        this.switch = false;
    }

    ngOnInit() {
        // this.changeTitle(this.title);
        this.InitData();
    }

    // 初始化数据
    InitData() {
        let scopeId = Scope.getInstance().getscope();
        // this.id = (this.route.snapshot.params.id).split("?")[0];
        if(this.portdataId){
            this.reportDetailTitleService.get(this.portdataId).then((response: any) => {
                if (response) {
                    DataStore.saveGlobalData(response.styleConfig);
                    // this.title[2]['name'] = response.name;
                }
                if (response.pages.length == 0) {
                    response.pages = [
                        {
                            "name": "",
                            "pageNum": scopeId,
                            "styleConfig": {
                                "back": "blafgfck"
                            },
                            "charts": []
                        }
                    ]
                }
                this.assignment(response);
                this.reportDetailTitleService.initdata(response.pages);
            }).catch(err => {
                // return this._notification.error(err, "", { 'nzDuration': 3000 })
            });
        }
        
    }

     // 赋值
    assignment(response: any) {
        let scopeId = Scope.getInstance().getscope();
        this.data = response;
        this.total = response.pages.length;
        if (this.total == 0) {
            this.total = 1
        }
        if (this.total == 1) {
            this.leftDisabled = true;
            this.rightDisabled = true;
        }
        for (var i = 0; i < this.total; i++) {
            this.positions.push({
                id: response.pages.length > 0 ? response.pages[i].pageNum : scopeId,
                index: i + 1,
                value: response.pages.length > 0 && response.pages[i].name ? response.pages[i].name : `第${i + 1}页`,
                showEllipsis: false,
                writeIN: false,
                showOpera: false,
            });
        }
    }

    open() {
        this.isOpen = true;
    }

    no() {
        this.isOpen = false;
    }
    // 左翻页
    reduce() {
        if (this.active == 1) {
            this.active = 1;
            this.leftDisabled = true;
        } else {
            this.leftDisabled = false;
            this.rightDisabled = false;
            this.active--;
            if (this.active == 1) {
                this.leftDisabled = true;
            }
        }
        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i].index == this.active) {
                let pageChangeId = this.positions[i].id;
                this.reportDetailTitleService.pagesChange(pageChangeId);
            }
        }
    }

    //右翻页
    add() {
        if (this.active == this.total) {
            this.active = this.total;
            this.rightDisabled = true;
        } else {
            this.rightDisabled = false;
            this.leftDisabled = false;
            this.active++;
            if (this.active == this.total) {
                this.rightDisabled = true;
            }
        }
        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i].index == this.active) {
                let pageChangeId = this.positions[i].id;
                this.reportDetailTitleService.pagesChange(pageChangeId);
            }
        }
    }

    // 跳转页
    select(item: any, addTotal?: boolean) {
        item['showEllipsis'] = false;
        item['showOpera'] = false;
        this.reportDetailTitleService.pagesChange(item.id);
        this.active = item.index;
        if (item.index == this.total) {
            this.rightDisabled = true;
            if (item.index == 1) {
                this.leftDisabled = true;
            } else {
                this.leftDisabled = false;
            }
        } else if (item.index == 1) {
            this.leftDisabled = true;
            this.rightDisabled = false;
        } else {
            this.leftDisabled = false;
            this.rightDisabled = false;
        }
    }

    // 新增页
    addTotal() {
        let scopeId = Scope.getInstance().getscope();
        this.rightDisabled = false;
        this.total = this.total + 1;
        this.positions.push({
            id: scopeId,
            index: this.total,
            value: `第${this.total}页`,
            showEllipsis: false,
            writeIN: false,
            showOpera: false,
        });
        this.reportDetailTitleService.pagesChange(this.positions[this.positions.length - 1].id);
        this.select(this.positions[this.positions.length - 1], true);
    }
    // 预览开关
    switchChange() {
        if (this.switch == true) {
            this.reportDetailTitleService.switchChange(true)
        } else {
            this.reportDetailTitleService.switchChange(false)
        }
    }
    // 配置数据
    updateData() {
        this.positions = [];
        this.reportDetailTitleService.toSave(this.data);
    }

    @ViewChild("root") element: ElementRef;

    // 页码命名
    ChangeName(event: Event, active: any) {
        event.stopPropagation();
        active.writeIN = true;
        this.element.nativeElement.querySelector(`#input-${active.index}`).focus()
    }

    // 命名确认
    ChangeNameOK(item: any) {
        item.writeIN = false;
        item.showOpera = false;
        this.reportDetailTitleService.pageNameChange({
            pageNum: item.id,
            name: item.value
        })
    }

    // 删除页
    removePage(event: Event, page: number) {
        event.stopPropagation();
        let that = this;
        this.confirmServ.confirm({
            title: `确定要删除舞台第${page}页`,
            showConfirmLoading: true,
            onOk() {
                that.deleteOK(page);
            },
            onCancel() {
            }
        });
    }

    // 确认删除重新渲染页码
    deleteOK(pageNum: number) {
        let pageId = -1;
        let pageChangeId = -1;
        this.total = this.total - 1;
        if (this.active == pageNum) {
            if (pageNum == this.total + 1) {
                this.active = this.total;
            } else {
                this.active = pageNum;
            }
        } else if (this.active == this.total + 1) {
            this.active = this.active - 1;
        }

        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i].index == pageNum) {
                pageId = this.positions[i].id;
            }
            if (this.positions[i].index == this.active) {
                if (this.total == pageNum) {//在最后一页删除其他的
                    pageChangeId = this.positions[this.total].id;
                } else {
                    pageChangeId = this.positions[this.active - 1].id;
                }
            }
        }
        this.positions.splice(pageNum - 1, 1);
        for (let i = 0; i < this.positions.length; i++) {
            this.positions[i].index = i + 1;
        }
        this.reportDetailTitleService.removePageChange(pageId, pageChangeId);
    }

    //显示操作
    showOpera(event: Event, item: any) {
        event.stopPropagation();
        item.showOpera = true;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}



