import {ChartsConfigService} from './config.service';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {DatWillSDK} from 'datwill-sdk-charts/lib/datwillsdk';
import {EventEmitter as EventEmit} from 'datwill-sdk-charts/lib/events/emitter.event';
import {EventType} from 'datwill-sdk-charts/lib/events/type.event';

// 保存前后对比保存文件的MD5
import {Md5} from 'ts-md5/dist/md5'

@Injectable()
export class StageService extends ChartsConfigService {

    constructor() {
        super();

        EventEmit.register(EventType.COMDELETE, this.deleteChangeData, this);
        EventEmit.register(EventType.SELECTCHART, this.dragChangeData, this);
    }

    public StageInstance: DatWillSDK = DatWillSDK.getInstance();
    public chartScopeId: string
    public reportName: string = "";
    public chartType: any;
    public stageDataBoolean: boolean = true;
    public chartMode: boolean = false;
    public chartMd5: any = '';
    public legend: any = {};
    public formatData: Array<any> = [
        {code: 'width', value: ''},
        {code: 'height', value: '768'},
        {code: 'margin', value: "true"},
        {code: 'size', value: "true"},
        {code: 'dataConfig', value: ""}
    ];
    public reportId: any = null;

    static transformInput(key: string, val: any): any {
        let o = {};
        o[key] = val;
        return o
    }

    triggerChange(type: number, value: any) {
        let eventType: any;
        switch (type) {
            case 1:
                eventType = EventType.STYLECHANGE;
                break;
            case 3:
                eventType = EventType.STAGECHANGE;
                break;
        }
        EventEmit.trigger(eventType, value)
    }

    //ng-event
    public missionConfigsControl = new Subject<any>();
    public ConfigsControl$ = this.missionConfigsControl.asObservable();
    public missionPostDataSource = new Subject<any>();
    public PostDataSource$ = this.missionPostDataSource.asObservable();
    public missionTagStage = new Subject<any>();
    public TagChangeStage$ = this.missionTagStage.asObservable();
    public missionDragChart = new Subject<any>();
    public DragChart$ = this.missionDragChart.asObservable();

    //选中组件还是舞台，用于右侧config的tab切换
    public missionOnTabChart = new Subject<any>();
    public OnTabChart$ = this.missionOnTabChart.asObservable();

    public missionStageDataFormatSource = new Subject<any>();
    public missionStageDataFormat$ = this.missionStageDataFormatSource.asObservable();

    clearReportConfigs() {
        this.missionConfigsControl.next([]);
        this.chartScopeId = ''
    }

    // 节流函数(规定时间内函数至少执行一次)
    // func:执行函数 wait:间隔执行 mustRun:一定时间范围内保障执行一次
    throttle(func: any, context: any, wait: number, mustRun: number) {
        let timeout: any,
            startTime: any = new Date();

        return function () {
            let args = arguments,
                curTime: any = new Date();

            clearTimeout(timeout);
            // 如果达到了规定的触发时间间隔，触发 handler
            if (curTime - startTime >= mustRun) {
                func.apply(context, args);
                startTime = curTime;
                // 没达到触发间隔，重新设定定时器
            } else {
                timeout = setTimeout(func, wait);
            }
        };
    };

    public static getColor() {
        //定义字符串变量colorValue存放可以构成十六进制颜色值的值
        let colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
        let colorArray = colorValue.split(",");
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += colorArray[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    //save stage data
    public mergeStageData(): any {
        let stageData = this.StageBaseData;
        stageData.name = this.reportName;
        stageData.formatAndTheme.format = this.formatData;
        stageData.stages.forEach((stage: any, index: number) => {
            stage.size = this.StageInstance.data.stages[0].size;
            this.saveData(stage.components);
        });
        return stageData
    }

    private saveData(components: any) {
        for (let item of components) {
            if (item.chart.dataSource.parameters && item.chart.dataSource.parameters.length > 0) {
                item.chart.dataSource.data = {};
                this.getDataFromView(item.chart.dataSource.parameters, item.chart.dataSource.data);
            }
            if (item.chart.style.parameters && item.chart.style.parameters.length > 0) {
                item.chart.style.data = {};
                this.getDataFromView(item.chart.style.parameters, item.chart.style.data);
            }

            if (item.chart.dataSource.data.dataSource && item.chart.dataSource.data.dataSource.length > 0) {
                if (item.chart.dataSource.data.dataSource["0"].id) {
                    item.chart.dataSourceId = item.chart.dataSource.data.dataSource["0"].id;
                }
            }
            item.chart.dataSource.parameters = [];
            item.chart.style.parameters = [];

            // debugger;
            if (!item.chart.style.box) {
                item.chart.style.box = {
                    layer: 1,
                    point: {},
                    size: {}
                }
            }

            let dataObj = item.chart.style.data;
            let boxObj = item.chart.style.box;
            boxObj.point.x = dataObj.component_x;
            boxObj.point.y = dataObj.component_y;
            boxObj.size.height = dataObj.component_height;
            boxObj.size.width = dataObj.component_width;

        }
    }

    private getDataFromView(viewList: any, data: any) {
        for (let i = 0; i < viewList.length; i++) {
            let obj = viewList[i];
            //data[obj.code] = obj.value;
            for (let j = 0; j < obj.fields.length; j++) {
                let field = obj.fields[j];
                this.getDataFromViewRecursion(field, data);
            }
        }
    }

    private getDataFromViewRecursion(field: any, data: any) {
        if (field.value) {
            data[field.code] = field.value;
        }
        if (field.childrenFields) {
            for (let j = 0; j < field.childrenFields.length; j++) {
                let child = field.childrenFields[j];
                this.getDataFromViewRecursion(child, data);
            }
        }
    }

    private deepCopy(obj: any) {
        let objNew = {};
        if (obj instanceof Object) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    objNew[key] = obj[key];
                }
            }
        } else {
            objNew = obj;
        }

        return objNew;
    }

    //删除legend
    public deleteStyleLenged(legend: any, savelegend: any) {
        for (let key in legend) {
            for (let s in savelegend) {
                if (key.indexOf('legend') == 0) {
                    if (key !== s) {
                        delete legend[key]
                    }
                }
            }

        }
    }

    public deleteChangeData(e: any, d: any) {
        if (d.length == 1) {
            this.delStageBaseData(d[0]);
        }
    }

    public dragChangeData(e: any, d: any) {
        if (d.length == 1) {
            // this.callback(d[0]);
            //获取组件配置，显示在右侧
            this.getReportConfigs(d[0].scopeID, d[0].type, null);
            this.tabChange(d[0]);

            this.stageDataBoolean = false;
            this.dragChart(this.stageDataBoolean);
            this.onTabChart(1);//选中组件
        } else {
            console.warn("d.length is not 1, length is" + d.length);
            this.onTabChart(3);//选中舞台
        }
    }

    private delStageBool: boolean = true;

    public delStageBaseData(d: any) {
        let stageComponents = this.getStageComponents(this.stagePages.current);
        for (let i = 0; i < stageComponents.length; i++) {
            if (stageComponents[i].chart.uuid == d) {
                stageComponents.splice(i, 1)
            }
        }

        if (stageComponents.length < 1) {
            this.stageDataBoolean = true;
        } else {
            this.stageDataBoolean = false;
        }
        this.dragChart(this.stageDataBoolean);
    }

    public getStageBaseDataByIndex(currentIndex: number): any {
        return this.StageBaseData.stages[currentIndex]
    }

    public delStageBaseDataByIndex(index: any) {
        this.StageBaseData.stages.splice(index, 1)
    }

    //pages change data
    getStagePageChangeData(currentIndex: number): any {
        let base = this.getStageBaseDataByIndex(currentIndex)
        return base
    }

    //edit reports
    initStage(data: any) {
        this.chartScopeId = '';

        this.reportName = data.name;
        this.StageBaseData = data;
        this.missionStageDataFormatSource.next();

        this.createStagePages(data.stages.length)
        if (!this.StageBaseData.stages.length) {
            this.StageBaseData.stages.push({
                name: '第1页',
                // editbool: false,
                backgroundColor: '',
                backgroundImage: '',
                zIndex: 0,
                size: null,
                components: []
            })
        } else {
            if (this.StageBaseData.stages[0].components.length > 0) {
                this.stageDataBoolean = false;
                this.dragChart(this.stageDataBoolean);
            }
        }

        this.chartMd5 = this.getDataMd5(JSON.stringify(this.StageBaseData));
        // console.log(this.chartMd5,"md5")

        //rendering stage
        let c
        if (this.StageBaseData.stages.length) {
            c = this.StageBaseData.stages[0]
        } else {
            c = null
        }
        this.StageInstance.saveStageData(this.StageBaseData.stages);
        this.StageInstance.changePage(c);

        //0 2为未发布，默认编辑模式，其他为已发布，默认预览模式
        if (data.status == 0 || data.status == 2) {
            this.chartMode = false;
            this.StageInstance.preViewModel = false;
        }

        this.reBindEvents();
    }

    public reBindEvents(){
        EventEmit.register(EventType.SELECTCHART, this.dragChangeData, this)
        EventEmit.register(EventType.COMDELETE, this.deleteChangeData, this)
    }

    public getStageBoolean: boolean = false;

    public yAxisName: Array<any> = [];
    public xAxisName: Array<any> = [];

    public getDatasourceData(datasourceDataArr: Array<any>): any {
        this.yAxisName = [];
        this.xAxisName = [];
        for (let item of datasourceDataArr) {
            if (item.code == "metric") {
                for (let j of item.value) {
                    this.yAxisName.push(j.name)
                }
            }
            if (item.code == "dimension_0") {
                for (let j of item.value) {
                    this.xAxisName.push(j.name)
                }
            }
        }
    }

    static checkAxisValue(tconfig: any): any {
        if (tconfig && Object.keys(tconfig).length > 0) {
            for (let key in tconfig) {
                if (tconfig[key]) { // 表示这一选项是有值的
                    switch (key) {
                        case 'valueType':
                            tconfig.value = this.checkAxisValueType(tconfig[key], tconfig.value);
                            break;
                    }
                }
            }
        }
        return tconfig
    }

    // 根据算子值的类型做不同的校验
    static checkAxisValueType(valueType: any, value: any) {
        switch (valueType) {
            case 1: // 字符串只做非空校验(因为在外层已经做过，所以这里只对非法字符进行校验)
                this.checkAxisValueString(value);
                break;
            case 2: // 整型
                if (this.checkAxisValueInteget(value) !== "") {
                    value = this.checkAxisValueInteget(value);
                } else {
                    value = ''
                }
                break;
            case 3: // 浮点型
                if (this.checkAxisValueFloat(value) !== "") {
                    value = this.checkAxisValueFloat(value);
                } else {
                    value = ''
                }
                break;
        }
        return value
    }

    // 检查是否是字符串
    static checkAxisValueString(value: any, errTips?: string) {
        if (typeof value != 'string') {
            return errTips || '数值类型不合法'
        } else {
            return ''
        }
    }

    // 检查整型
    static checkAxisValueInteget(value: any, errTips?: string): string {
        let pattern = new RegExp("^-?\\d+$")
        if (pattern.test(value)) {
            return value
        } else {
            return ''
        }
    }

    // 检查浮点型
    static checkAxisValueFloat(value: any, errTips?: string): string {
        let pattern = new RegExp("^(-?\\d+)(\\.\\d+)?$")
        if (pattern.test(value)) {
            return value
        } else {
            return ''
        }

    }

    // 根据算子的最大最小值的区间做校验
    static checkAxisValueRange(rangeType: string, valueRange: any, value: any): string {
        if (rangeType === 'minValue') {
            return value < valueRange ? '数值太小' : ''
        } else if (rangeType === 'maxValue') {
            return value > valueRange ? '数值太大' : ''
        }
    }

    postDataSource(data: any) {
        this.missionPostDataSource.next(data)
    }

    tabChange(d: any) {
        this.missionTagStage.next(d)
    }

    dragChart(b: any) {
        this.missionDragChart.next(b)
    }

    onTabChart(b: any) {
        this.missionOnTabChart.next(b)
    }

    // 获取数据对应的Md5
    getDataMd5(data: any) {
        // console.log(JSON.parse(data))
        return Md5.hashStr(data)
    }

    //正则校验名称
    public illegalChar(str: any) {
        let pattern = /^[a-zA-Z0-9_*\.?*\-?\u4e00-\u9fa5]+$/
        if (!pattern.test(str)) {
            return false;
        }
        return true;
    }

    public HandleData(formatArray: Array<any>) {
        let styleObj: any = {};
        for (let item of formatArray) {
            Object.assign(styleObj, StageService.transformInput(item.code, item.value));
        }
        return styleObj;
    }

}