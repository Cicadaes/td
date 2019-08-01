/**
 * Created by wangshouyun on 2017/3/2.
 */

import {StageContainer} from "./views/containers/stage/stage.container";
import {ReportData} from "./public/report_data";
import {BaseComponentList} from "datwill-sdk-charts/lib/base.list";
// import {BaseComponentList} from "../../../components/base.list";
import {ComponentContainer} from "./views/containers/component/component.container";
import {EventBroker} from "./eventbroker";
import {EventEmitter} from "./events/emitter.event";
import {EventType} from "./events/type.event";


export class DatWillSDK {

    private static _instance: DatWillSDK = null;
    private _preViewModel:Boolean = false;
    private _eventBroker: EventBroker = null;

    public static getInstance(): DatWillSDK {
        if (!DatWillSDK._instance) {
            DatWillSDK._instance = new DatWillSDK();
            DatWillSDK._instance._eventBroker = new EventBroker();
        }
        return DatWillSDK._instance;
    }

    private stage: StageContainer = null;

    public createStage(querySelect: string, size?: any): void {
        this.stage = new StageContainer(querySelect);
    }

    public createPage(): void {
        this.changePage(null);
    }

    public set preViewModel(bl: Boolean) {
        this._preViewModel = bl;
        this.stage.preViewModel = this._preViewModel;
    }

    public changePage(data: any): void {
        // this.stage.removeAllChild();
        if (data != null) {
            this.renderData(data);
        }
    }

    private renderData(data: any): void {
        if(data.size){
            this.stage.historySize = {width: data.size.width, height: data.size.height};
        }else{
            this.stage.historySize = {width: data.width, height: data.height};
        }

        if (data.components == null) return;
        this._eventBroker.initData(data);
        for (let component of data.components) {
            let chartStyle: any = component.chart.style;
            let chartDataSource: any = component.chart.dataSource;
            let chartConponent: any = BaseComponentList.getComponentByType(String(component.chart.type));

            if (chartConponent) {
                let componentContainer: ComponentContainer = new ComponentContainer(chartConponent, component.chart.uuid);
                componentContainer.x = chartStyle.box.point.x;
                componentContainer.y = chartStyle.box.point.y;
                componentContainer.width = chartStyle.box.size.width;
                componentContainer.height = chartStyle.box.size.height;
                componentContainer.layer = chartStyle.box.layer;
                componentContainer.type = component.chart.type;
                this.stage.addChild(componentContainer);

                setTimeout(() => {
                    componentContainer.dataChange({
                        scopeID: component.chart.uuid,
                        result: chartDataSource.data
                    });
                }, 300);

                setTimeout(() => {
                    componentContainer.styleChange({
                        scopeID: component.chart.uuid,
                        result: chartStyle.data
                    });
                }, 100);
            }
        }
        this.stage.refresh();
        this.preViewModel =  this._preViewModel;
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
                    },
                    dataSource: {
                        data: chart.component.itemObj
                    }
                }
            };

            stageData['components'].push(chartData);
        }

        reportData.stages.push(stageData);

        return reportData;
    }

}