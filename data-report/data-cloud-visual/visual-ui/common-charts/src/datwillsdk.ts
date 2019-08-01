/**
 * Created by wangshouyun on 2017/3/2.
 */

import {StageContainer} from "./views/containers/stage/stage.container";
import {ReportData} from "./../public/report_data";
import {BaseComponentList} from "./views/components/base.list";
import {ComponentContainer} from "./views/containers/component/component.container";
import {EventBroker} from "./eventbroker";
import {EventEmitter} from './events/emitter.event';
import {EventType} from './events/type.event';

export class DatWillSDK {

    private static _instance: DatWillSDK = null;
    private _eventBroker: EventBroker = null;
    private stageData: any = null;
    private parameter: any = {};
    private stageConfig: any;

    constructor() {
        EventEmitter.register(EventType.COMONRENDER, this.onRender, this);
    }

    public static getInstance(): DatWillSDK {
        if (!DatWillSDK._instance) {
            DatWillSDK._instance = new DatWillSDK();
            DatWillSDK._instance._eventBroker = new EventBroker();
        }
        return DatWillSDK._instance;
    }

    private stage: StageContainer = null;

    public createStage(querySelect: string): void {
        this.removeAll();
        this.stage = new StageContainer(querySelect);
    }

    public createPage(): void {
        this.changePage(null);
    }

    public set preViewModel(bl: Boolean) {
        if (this.stage) {
            this.stage.preViewModel = bl;
        }
    }

    public saveStageData(data: any): void {
        this._eventBroker.stageDataArray = data;
    }

    private onRender(event: any, chart: any): void {
        this.changePage(this._eventBroker.stageDataArray[chart.eqType])
    }

    public changePage(data: any): void {
        this.removeAll();
        if (data != null) {
            this.renderData(data);
        }
    }

    public removeAll(): void {
        if (this.stage) {
            this.stage.removeAllChild();
        }

        this._eventBroker.removeRegister();
        EventEmitter.register(EventType.COMONRENDER, this.onRender, this);
        if (this.stage && this.stage.messenger) {
            EventEmitter.register(EventType.MESSAGE_CHANGE, this.stage.messageHandler, this.stage);
        }
        if (this.stage) {
            this.stage.rebindevent();
        }
    }

    private renderData(data: any): void {

        if (data.components == null) return;

        this.stageData = data;
        this.stage.stageData = this.stageData;

        if (data.size) {
            this.stage.historySize = {width: data.size.width, height: data.size.height};
        }

        let scaleValue: any = (this.stage.width / this.stage.historyWidth).toFixed(2);
        for (let component of this.stageData.components) {
            let chartStyle: any = component.chart.style;

            let configure_style: any;
            if (component.chart.style.data.configure_style && component.chart.style.data.configure_style["0"].name) {
                configure_style = JSON.parse(component.chart.style.data.configure_style["0"].name);
            }
            if (configure_style && configure_style.layout_x == "zoom") {
                chartStyle.data["component_x"] = "20";
                chartStyle.data["component_width"] = "" + (this.stage.width - 40);
            } else if (configure_style && configure_style.layout_x == "zoom_1") {
                chartStyle.data["component_x"] = "20";
                chartStyle.data["component_width"] = "" + Math.round((this.stage.width - 50) / 2);
            } else if (configure_style && configure_style.layout_x == "zoom_2") {
                chartStyle.data["component_x"] = "" + Math.round((this.stage.width - 50) / 2 + 20 + 10);
                chartStyle.data["component_width"] = "" + Math.round((this.stage.width - 50) / 2);

            } else if (configure_style && configure_style.layout_x == "full") {
                chartStyle.data["component_x"] = "0";
                chartStyle.data["component_width"] = "" + (this.stage.width - 5);
            } else if (configure_style && configure_style.layout_x == "right") {
                chartStyle.data["component_x"] = "" + (this.stage.width - parseInt(chartStyle.data["component_width"]) - 20);
            } else if (configure_style && configure_style.layout_x == "fix") {

            } else {
                if (chartStyle.data && chartStyle.data["component_width"]) {
                    chartStyle.data["component_width"] = "" + parseInt(chartStyle.data["component_width"]) * scaleValue;
                }
                if (chartStyle.data && chartStyle.data["component_x"]) {
                    chartStyle.data["component_x"] = "" + parseInt(chartStyle.data["component_x"]) * scaleValue;
                } else if (chartStyle.data) {
                    chartStyle.data["component_x"] = "0";
                }
            }
        }
        this.stage.historyWidth = this.stage.width;

        for (let component of this.stageData.components) {
            let chartStyle: any = component.chart.style;

            if (chartStyle.data && chartStyle.data["title_name"]) {
                chartStyle.data["title_name_titleValue"] = chartStyle.data["title_name"]["titleValue"];
                chartStyle.data["title_name_textValue"] = chartStyle.data["title_name"]["textValue"];
            }

            let chartDataSource: any = component.chart.dataSource;

            let chartConponent: any = BaseComponentList.getComponentByType(String(component.chart.type));

            //给组件赋值名称
            let viewName = chartConponent.constructor.name;
            if (viewName.endsWith("Component")) {
                let index = viewName.indexOf("Component");
                viewName = viewName.substring(0, index);
            }
            chartConponent.viewName = viewName;

            if (chartConponent) {

                let componentContainer: ComponentContainer = new ComponentContainer(this.stage, chartConponent, component.chart.uuid);

                componentContainer.chartStyle = chartStyle;

                componentContainer.x = chartStyle.box.point.x;
                componentContainer.y = chartStyle.box.point.y;
                componentContainer.width = chartStyle.box.size.width;
                componentContainer.height = chartStyle.box.size.height;
                componentContainer.layer = chartStyle.box.layer;
                componentContainer.type = component.chart.type;

                this.stage.addChild(componentContainer);

                //存储过滤器
                this.saveStageFilter(component.chart, componentContainer['component']);

                setTimeout(() => {
                    componentContainer.getconfiginformation("", {
                        scopeID: component.chart.uuid,
                        result: this.setConfigObject(chartDataSource),
                        parameter: this.parameter
                    })
                }, 200);

                setTimeout(() => {
                    componentContainer.styleChange({
                        scopeID: component.chart.uuid,
                        result: chartStyle.data
                    });
                }, 100);

                setTimeout(() => {
                    componentContainer.getFilterMethod = this.parameter.getFilterMethod;
                }, 100);

            }
        }

        setTimeout(() => {
            this._eventBroker.initData(this.data);
            this.stage.refresh();
        }, 200);

        if (this.parameter && this.parameter.projectId) {
            EventEmitter.trigger(EventType.OVERALLFILTERCHANGE, {
                result: this.parameter
            });
        }
    }

    public saveStageFilter(chart: any, componentContainer: any) {
        if (chart.dataSource.data['configure'].length > 0) {
            let dataSourceChart: any = chart.dataSource.data['configure'][0].name;

            if (dataSourceChart !== "") {
                if (JSON.parse(dataSourceChart).topLevelFilter) {
                    componentContainer['topLevelFilter'] = JSON.parse(dataSourceChart).topLevelFilter;
                }
                if (JSON.parse(dataSourceChart).chartScopeID) {
                    this._eventBroker.stageFilterComponent.push(componentContainer)
                }
            }

        }
    }

    public setConfigObject(chartDataSource: any) {
        let setConfigObj: any = null,
            fieldValue: any = null;
        if (chartDataSource.data && chartDataSource.data !== undefined) {
            fieldValue = chartDataSource.data["configure"][0].name;
            if (fieldValue !== "") {
                setConfigObj = JSON.parse(fieldValue)
            } else {
                setConfigObj = {};
            }
        }
        return setConfigObj;
    }

    public get data(): any {

        let reportData: ReportData = new ReportData();

        let stageData = {};
        stageData['backgroundColor'] = "";
        stageData['backgroundImage'] = "";
        stageData['size'] = {
            width: this.stage.width,
            height: this.stage.height
        };
        stageData['components'] = [];

        let chartList = this.stage.allChildren;

        for (let chart of chartList) {
            let chartData = {
                chart: {
                    uuid: chart.scopeID,
                    type: chart.type,
                    style: {
                        box: {
                            size: {
                                width: chart.width,
                                height: chart.height
                            },
                            point: {
                                x: chart.x,
                                y: chart.y
                            },
                            layer: chart.layer
                        }
                    }
                }
            };

            stageData['components'].push(chartData);
        }

        reportData.stages.push(stageData);

        return reportData;
    }

    public getParameter(parameter: Object) {
        this.parameter = parameter;
    }

    public renderReport(domStr: any, reportId: string, messenger: any) {
        this.createStage(domStr);
        if (this.stage && messenger) {
            this.stage.messenger = messenger;
        }
        EventEmitter.register(EventType.MESSAGE_CHANGE, this.stage.messageHandler, this.stage);

        this.sendRequest(reportId);
    }

    public sendRequest(reportId: any) {
        let url_host = "/wreport_datareport";
        let _self = this;
        $.ajax({
            url: url_host + '/report/reports/' + reportId,
            dataType: 'JSON',
            contentType: 'application/json',
            type: 'GET',
            success: function (data: any) {
                _self.stageConfig = data.formatAndTheme.format;
                _self.saveStageData(data.stages);
                _self.changePage(data.stages[0]);
            },
            error: function (data: any) {
                if (data.status == '401') {
                    _self.registLogin(url_host);
                } else {
                    console.error('请求失败' + data)
                }
            },
            beforeSend: function () {
                // console.log('正在加载中...');
            }
        });
    }

    public registLogin(url_host: any) {
        $.ajax({
            url: url_host + "/user/login",
            type: 'GET',
            success: function (data: any) {
                document.location.href = data.service + document.location.origin + data.redirect + document.location.href;
            },
            error: function (data: any) {
                debugger;
                document.location.href = data.service + document.location.origin + data.redirect + document.location.href
            },
            beforeSend: function () {
            }
        });
    }
}