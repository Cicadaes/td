import { EventEmitter } from "cosmos-td-sdk";
import { ComponentEvent, EventType } from "cosmos-td-sdk";
import { DataStore } from 'cosmos-td-sdk';
import { Timer } from 'cosmos-td-sdk';
import { ConfigApi } from './../../../api/config-api';

export class StylePanel {

    chartConfig: any = {};  //样式面板信息

    axisStyle: any = {};    //坐标轴
    gridStyle: any = {};    //网格
    bgBdStyle: any = {};    //背景与边框
    legendStyle: any = {};  //图例
    colorStyle: any = {};   //颜色
    heightStyle: any = {};  //自适应高度
    setStyle: any = {};  //设置
    alignmentStyle: any = {};  //自适应对齐
    layoutStyle:any = {} //容器

    /* 对应组件的注入数据 */
    _layoutBgbd: any;
    _layoutAxis: any;
    _layoutLegend: any;
    _layoutGrid: any;
    _layoutColor: any;
    _layoutHeight: any;
    _layoutSet: any;
    _layoutAlignment: any;
    _layoutLayout: any;


    private _timer: Timer = null;
    private _triggerTimer: Timer = null;

    // 调色盘颜色列表
    public color: string[] = ['#2d8cf0', '#2de3c5', '#fcc45f', '#ff8454', '#db425a', '#34508c', '#5bb6fd', '#56d08b', '#b3e768', '#71808f'];

    constructor(public configApi: ConfigApi) {
        this._timer = new Timer();
        this._triggerTimer = new Timer();
        EventEmitter.register(EventType.CONFCHANGE, this.configChange, this);
    }

    /**
     * 更新样式数据, 触发 STYLECHANGE 事件
     */
    public renderEcharts(styleConfig: any) {
        EventEmitter.trigger(EventType.STYLECHANGE, {
            scope: this.configApi.scope, data: styleConfig
        });
    }

    public nofication(scope: string, styleConfig: any) {
        if (scope != this.configApi.scope) {
            return;
        }
        this.noficationChange({
            scope: scope,
            callback: () => {
                this.chartChange(scope, styleConfig);
            }
        })
    }

    /**
     * 对应分装组件的数据和注入数据
     */
    public componentStyleConf(styleConfig: any) {

        if (styleConfig && styleConfig["axis"]) {
            this.axisStyle = this._layoutAxis = styleConfig["axis"];
        }

        if (styleConfig && styleConfig["grid"]) {
            this.gridStyle = this._layoutGrid = styleConfig["grid"];
        }

        if (styleConfig && styleConfig["legend"]) {
            this.legendStyle = this._layoutLegend = styleConfig["legend"];
        }

        if (styleConfig && styleConfig["bgAndBorder"]) {
            this.bgBdStyle = this._layoutBgbd = styleConfig["bgAndBorder"];
        }

        if (styleConfig && styleConfig["color"]) {
            this.colorStyle = this._layoutColor = styleConfig["color"];
        }

        if (styleConfig && styleConfig["height"]) {
            this.heightStyle = this._layoutHeight = styleConfig["height"];
        }

        if (styleConfig && styleConfig["set"]) {
            this.setStyle = this._layoutSet = styleConfig["set"];
        }

        if (styleConfig && styleConfig["alignment"]) {
            this.alignmentStyle = this._layoutAlignment = styleConfig["alignment"];
        }

        if (styleConfig && styleConfig["layout"]) {
            this.layoutStyle = this._layoutLayout = styleConfig["layout"];
        }

    }

    public legendData(data: any) {
        this.legendStyle = data;
        this.OptionChange();
    }

    public axisData(data: any) {
        this.axisStyle = data;
        this.axisNameChange();
        this.OptionChange();
    }

    public bgBdData(data: any) {
        this.bgBdStyle = data;
        this.OptionChange();
    }

    public setLayoutData(data: any) {
        this.layoutStyle = data;
        this.OptionChange();
    }

    public gridData(data: any) {
        this.gridStyle = data;
        this.OptionChange();
    }

    public colorData(data: any) {
        this.colorStyle = data;
        this.OptionChange();
    }

    public heightData(data: any) {
        this.heightStyle = data;
        this.OptionChange();
    }

    public setData(data: any) {
        this.setStyle = data;
        this.OptionChange();
    }

    public alignmentData(data: any) {
        this.alignmentStyle = data;
        this.OptionChange();
    }
    /**
     * 样式改变事件 子类重写方法
     */
    public OptionChange() {

    }

    /**
     * 数据/样式 Tab 改变事件 子类重写方法
     */
    public reRenderData(type: string) {

    }

    private axisNameChange() {
        this.chartConfig = DataStore.getConfigData(this.configApi.scope);
        if (this.axisStyle.xAxisTitle) {
            let dimensions = this.chartConfig && this.chartConfig["dataConfig"] && this.chartConfig["dataConfig"]['dimensions'];
            this.axisStyle['xAxisName'] = (dimensions && dimensions.length) ? dimensions[0].value : "";
        } else {
            delete this.axisStyle.xAxisName;
        }
        if (this.axisStyle.yAxisTitle) {
            let metrics = this.chartConfig && this.chartConfig["dataConfig"] && this.chartConfig["dataConfig"]['metrics'];

            if (metrics) {
                let str: string = '';
                metrics.forEach((element: any) => {
                    str += `/${element['value']}`;
                });
                this.axisStyle['yAxisName'] = (metrics) ? str.substr(1) : "";
            }


        } else {
            delete this.axisStyle.yAxisName;
        }
    }

    private configChange(e: any, data: any) {
        if (!data || data['scope'] !== this.configApi.scope) {
            return;
        }
        if (this._triggerTimer) {
            this._triggerTimer.stopTimeOut();
        }
        let callback = (e: any) => {
            this.axisNameChange();
            this.reRenderData(data['type']);
        };
        this._triggerTimer.startTimeOut(0.1, callback, this);
    }

    /**
     * 保存对应图表的样式数据
     * @param styleConfig
     */
    private saveStyle(styleConfig: any) {
        DataStore.saveConfigData(this.configApi.scope, "styleConfig", styleConfig);
    }

    /**
     * 保存样式数据并且触发 STYLECHANGE 事件
     */
    private chartChange(scope: string, styleConfig: any) {
        if (scope != this.configApi.scope) {
            return;
        }
        if (this._timer) {
            this._timer.stopTimeOut();
        }
        this.saveStyle(styleConfig);
        this.renderEcharts(styleConfig);
    }

    private noficationChange(obj: { scope: string, callback: () => void }) {
        if (obj.scope != this.configApi.scope) {
            return;
        }
        if (this._timer) {
            this._timer.stopTimeOut();
        }
        this._timer.startTimeOut(0.1, obj.callback, this);
    }
}