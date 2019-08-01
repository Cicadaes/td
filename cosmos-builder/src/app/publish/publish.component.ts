import { Component, OnInit, OnDestroy, ApplicationRef, ComponentFactoryResolver, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CmNotificationService, CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { CosmosSDK, ComponentEvent, EventEmitter, DataStore, EventType } from 'cosmos-td-sdk';
import { componentList } from '../../sdk-ui/component.list';
import { ConfigApi } from '../../sdk-ui/api/config-api';
import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { PublishService } from './publish.service';
import { SwitchRequestGraph } from '../../sdk-ui/components/angular/common/switch-request.graph';
import { ReportConfigService } from '../../sdk-ui/service/report-config.service';
import ComponentBootstrap from '../../sdk-ui/components/angular/component.bootstrap';
@Component({
    selector: 'publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.less'],
})
export class PublishComponent implements OnInit {

    private cosmosSDK: CosmosSDK = null;
    private tabs: Array<any> = [];
    private heightStyles: any;
    private params: any = {};
    private reportId: any;
    title: any = [];

    constructor(
        private _notification: CmNotificationService,
        private configApi: ConfigApi,
        private route: ActivatedRoute,
        private publishService: PublishService,
        private reportConfigService: ReportConfigService,
        private appRef: ApplicationRef,
        private resolver: ComponentFactoryResolver,
        private cmModalService: CmModalService
    ) {
        // 舞台启动组件
        ComponentBootstrap.appRef = appRef;
        ComponentBootstrap.resolver = resolver;

        EventEmitter.register(EventType.VISUALAREAINIT, this.loadChartData, this);
        EventEmitter.register(EventType.CHARTUPDATE, this.componentTrigger, this);

        window.addEventListener('message', function (event) {
            // if(event.origin !== 'http://davidwalsh.name') return;
            // console.log('message received:  ' + event.data,event);
            // event.source.postMessage('holla back youngin!',event.origin);
        }, false);

    }

    ngOnInit() {
        this.cosmosSDK = new CosmosSDK('.stage');
        this.cosmosSDK.registerComponents(componentList);
        this.cosmosSDK.previewMode = true;
        let id = (this.route.snapshot.params.id).split("?")[0];
        //通知取数据
        let dataStr: any = JSON.stringify({ eventType: 'get', eventInfo: { data: ['report'], sourceType: 'publish-report' } });
        window.parent.postMessage(dataStr, '*');

        //监听返回数据
        window.addEventListener('message', (event: any) => {
            if (event.source != window.parent) return;
            let data: any = null;
            if (event.data && typeof event.data == "string") data = JSON.parse(event.data);
            if (data && data.eventType !== 'get' && data.eventType !== 'save' && data.eventInfo && data.eventInfo.sourceType == 'publish-report') {
                let report = data.eventInfo.data && JSON.parse(data.eventInfo.data['report']);
                this.params = report && report.report;
                this.title = this.params ? (this.params.header ? this.params.header : []) : [];
                this.reportId = this.params ? (this.params.reportId ? this.params.reportId : null) : null;
            }

        })

        this.reportId = this.reportId || id;
        this.getPublishData(this.reportId);
    }

    getPublishData(id: any) {
        this.publishService.get(id).then((response: any) => {
            if (response) {
                DataStore.saveGlobalData(response.styleConfig);
                if (response.styleConfig && response.styleConfig.title) {
                    this.title = this.title.length <= 0 ?  [response.styleConfig.title] : this.title;
                }
            }

            if (response.pages && response.pages.length > 0) {
                for (let i = 0; i < response.pages.length; i++) {
                    this.tabs.push({
                        id: response.pages[i].pageNum,
                        value: response.pages[i].name ? response.pages[i].name : `第${i + 1}页`
                    })
                    this.testTab();
                }
            }
            if (this.cosmosSDK && response.pages) {
                this.cosmosSDK.data = response.pages;
            }

        }).catch(err => {
            // return this._notification.error(err, "", { 'nzDuration': 3000 })
        });
    }

    testTab() {
        if (this.tabs.length > 1) {
            this.heightStyles = {
                'height': 'calc(100% - 104px)',
            }
        } else {
            this.heightStyles = {
                'height': '100%',
            }
        }
    }

    ChangeTabs(page: any) {
        if (this.cosmosSDK) {
            this.cosmosSDK.changePage(page);
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
        let component = DataStore.getComponentInstance(message.scope);
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

    // //响应事件
    // window.addEventListener('message',function(event) {
    //     if(event.origin !== 'http://davidwalsh.name') return;
    //     console.log('message received:  ' + event.data,event);
    //     event.source.postMessage('holla back youngin!',event.origin);
    // },false);

    ngOnDestroy() {
        this.cosmosSDK.destroy();
        EventEmitter.unRegister(EventType.VISUALAREAINIT, this.loadChartData, this);
        EventEmitter.unRegister(EventType.CHARTUPDATE, this.componentTrigger, this);
        this.cosmosSDK = null;
    }

    /**
     * 面包屑导航
     * @param index 索引
     * @param target 跳转目标
     */
    routerChange(index: any, target: any) {
        if (index < this.title.length - 1) {
           
            let that:any = this;
            this.cmModalService.confirm({
                title: `确定要退出当前页面`,
                showConfirmLoading: true,
                onOk() {
                    that.params.target = target;
                    let dataStr = JSON.stringify({ eventType: 'save', eventInfo: { data: { 'report': that.params }, sourceType: '*' } });
                    window.parent.postMessage(dataStr, '*');
                    window.location.href = that.params.url;
                },
                onCancel() {

                }
            });
        }
    }
}

