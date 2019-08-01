import { Component, OnInit, ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { Component as CosmosComponent } from 'cosmos-td-sdk';
import { ReportDetailTitleService } from './report-detail-title/report-detail-title.service';
import { Subscription } from 'rxjs/Subscription';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { CosmosSDK, EventEmitter, DataStore, EventType } from 'cosmos-td-sdk';
import { componentList } from '../../../../../sdk-ui/component.list';
import { ConfigApi } from '../../../../../sdk-ui/api/config-api';
import { ActivatedRoute } from '@angular/router';
import { ReportConfigService } from '../../../../../sdk-ui/service/report-config.service';
import { SwitchRequestGraph } from '../../../../../sdk-ui/components/angular/common/switch-request.graph';
import ComponentBootstrap from '../../../../../sdk-ui/components/angular/component.bootstrap';

@Component({
    selector: 'report-detail',
    templateUrl: './report-detail.component.html',
    styleUrls: ['./report-detail.component.less'],
    providers: [ConfigApi]
})
export class ReportDetailComponent implements OnInit {
    private positionStyles: object = {};
    private widthStyles: object = {};
    private width: number;
    private cosmosSDK: CosmosSDK = null;
    public layoutData: any = null;
    private subscription: Subscription;
    private switchStatus: boolean;
    private reportData: any = null;//报表配置数据
    constructor(
        private reportDetailTitleService: ReportDetailTitleService,
        private _notification: CmNotificationService,
        private configApi: ConfigApi,
        private route: ActivatedRoute,
        private reportConfigService: ReportConfigService,
        private appRef: ApplicationRef,
        private resolver: ComponentFactoryResolver
    ) {
        // 舞台启动组件
        ComponentBootstrap.appRef = appRef;
        ComponentBootstrap.resolver = resolver;

        // 初始化数据
        this.subscription = this.reportDetailTitleService.missioninitData$.subscribe((data: object) => {
            if (this.cosmosSDK) {
                this.cosmosSDK.data = data;
            }
            this.reportData = data;
        });
        // 翻页
        this.subscription = this.reportDetailTitleService.missionpageChange$.subscribe((pageNum: number) => {
            if (this.cosmosSDK) {
                this.cosmosSDK.changePage(pageNum);
            }
        });

        // 重命名
        this.subscription = this.reportDetailTitleService.missionPageName$.subscribe((page: any) => {
            if (this.cosmosSDK) {
                this.cosmosSDK.changePageName(page);
            }
        });

        // 删除页
        this.subscription = this.reportDetailTitleService.missionRemovePage$.subscribe((page: any) => {
            if (this.cosmosSDK) {
                this.cosmosSDK.removePage(page.pageNum, page.changePage);
            }
        });

        // 保存
        this.subscription = this.reportDetailTitleService.missiontoSave$.subscribe((data: any) => {
            if (this.cosmosSDK) {
                this.saveData(data);
            }
        });
        // 预览
        this.subscription = this.reportDetailTitleService.missionswitchstatus$.subscribe((status: boolean) => {
            this.switchStatus = status;
            this.showRight(status);
            if (this.cosmosSDK) {
                this.cosmosSDK.previewMode = status;
            }
        });
        EventEmitter.register(EventType.VISUALAREAINIT, this.loadChartData, this);
        EventEmitter.register(EventType.CHARTUPDATE, this.componentTrigger, this);
    }

    ngOnInit() {
        this.cosmosSDK = new CosmosSDK('.stage', '.list','.trash');
        this.cosmosSDK.registerComponents(componentList);
        let params = (this.route.snapshot.params.id).split("?")[1];
        if (params) {
            this.cosmosSDK.previewMode = true;//查看进入预览
        } else {
            this.cosmosSDK.previewMode = false;//新增进入编辑
        }
    }

    showRight(status: boolean) {
        if (status == true) {
            this.widthStyles = {
                'transition': 'all 0.5s ease 0s'
            }
            this.positionStyles = {
                'transform': 'translateX(0px)',
                'transition': 'all 0.5s ease 0s'
            }

        } else {
            this.positionStyles = {
                'transform': 'translateX(-260px)',
                'transition': 'all 0.5s ease 0s'
            }
            this.widthStyles = {
                'width': 'calc(100% - 300px)',
                'transition': 'all 0.5s ease 0s'
            }
        }
    }

    // 保存
    saveData(data: any) {
        let obj = data;
        obj['pages'] = this.cosmosSDK.data;
        obj['styleConfig'] = DataStore.getGlobalData();
        if (!this.switchStatus) {
            this.reportDetailTitleService.save(obj).then((response: any) => {
                if (JSON.parse(response._body).success) {
                    this.reportDetailTitleService.saveOK(obj['pages']);
                    return this._notification.success(JSON.parse(response._body).msg, "", { 'nzDuration': 2000 })
                } else {
                    return this._notification.error(JSON.parse(response._body).msg, "", { 'nzDuration': 3000 })
                }
            }).catch(err => {
                // return this._notification.error(err, "", { 'nzDuration': 3000 })
            });
        }
    }

    /**
     * 图表本身触发（比如表格切换页码）
     * @param e 
     * @param message 
     */
    componentTrigger(e: any, message: any) {
        this.loadChart(message);
    }

    /**
     * 修改回显时调用（或者过滤器触发）
     * @param data 
     */
    loadChartData(e: any, message: any) {
        //修改回显或者过滤器触发时，表格从第一页开始
        if (message["componentFilter"]) {
            message["componentFilter"].forEach((element: any) => {
                if (element && element["page"]) {
                    element["page"] = 1;
                    element["pageSize"] = 10;
                }
            });
        }
        this.loadChart(message);
    }

    /**
     * 加载图表数据
     * @param message 
     */
    loadChart(message: any) {
        let config = DataStore.getConfigData(message.scope);
        let component: CosmosComponent = DataStore.getComponentInstance(message.scope);
        if (!component.styleAndData) {
            if (config && config["styleConfig"] ) {
                EventEmitter.trigger(EventType.STYLECHANGE,
                    {
                        scope: message.scope,
                        data: config["styleConfig"]
                    }
                );
            }
            if (config && config["dataConfig"]) {
                EventEmitter.trigger(EventType.DATACHANGE,
                    {
                        scope: message.scope,
                        data: {
                            code: "200",
                            data: [config["dataConfig"]]
                        }
                    }
                );
            }
            return;
        }

        let styleConfig = config && config["styleConfig"] && JSON.parse(JSON.stringify(config["styleConfig"]));

        if (config && config["styleConfig"] && message["componentFilter"] && message["componentFilter"].length > 0) {
            styleConfig["linkageData"] = message["componentFilter"];
        }

        config && config["dataConfig"] && new SwitchRequestGraph(
            component["name"],
            {
                "queryParam": config["dataConfig"],
                "scope": message.scope,
                "linkageData": message["componentFilter"],
                "callback": () => {
                    EventEmitter.trigger(EventType.STYLECHANGE,
                        {
                            scope: message.scope,
                            data: styleConfig
                        }
                    );
                }
            },
            this.reportConfigService
        );
    }

    ngOnDestroy() {
        this.cosmosSDK.destroy();
        EventEmitter.unRegister(EventType.VISUALAREAINIT, this.loadChartData, this);
        EventEmitter.unRegister(EventType.CHARTUPDATE, this.componentTrigger, this);
        this.cosmosSDK = null;
        this.subscription.unsubscribe();
    }
}
