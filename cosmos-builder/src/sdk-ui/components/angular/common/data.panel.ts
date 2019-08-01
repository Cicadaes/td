import { ConfigApi } from "../../../api/config-api";
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataStoreUtil, dataType } from "../../../api/data-store-util";
import { OnInit } from "@angular/core";
import { SwitchRequestGraph } from "./switch-request.graph";

/**
 * 存入dataStroe中数据面板的key(新加key时维护到该类中)
 */
export const DataConfigKey = {
    "CUBE": "cube",//cube
    "DIMENSIONS": "dimensions",//维度
    "METRICS": "metrics",//指标
    "DATEDIMENSION": "dateDimension",//时间维度
    "DATETYPE": "dateType",//时间类型（默认 OR 自定义）
    "DATERANGE": "dateRange",//时间跨度（时间类型是默认时）
    "ORDERBY": "orderBy",//排序方式
    "COUNT": "count",//图表的显示个数（例如饼图的扇区个数；条形图的维度个数）
    "FILTER": "filter"//过滤器

}

/**
 * 本类抽象了数据配置面板方法和属性，当该类的方法不适用子类的数据面板时，重写属性或者方法即可；
 */
export class DataPanel {
    cubeList: any = [];//cube列表
    dimensionList: any = [];//维度列表
    metricsList: any = [];//指标列表
    orderList: any = [
        { value: 'asc', label: '升序' },
        { value: 'desc', label: '降序' }
    ];//排序字段列表
    orderByList: any = [];//排序方式列表 || 日期范围维度暂时也使用这个列表
    dateDimensionsList: any = [];//日期维度列表
    cityDimensionsList: any = [];//地图维度
    selectedCube: number;//选中的cube
    selectedDimensions: any = [];//选中的维度列表
    selectedMetrics: any = [];//选中的指标列表
    selectedDate: string = "";//选中的日期维度
    dateRange: any = [];//自定义时间范围
    selectedOrderInfo: any = [];//选中的排序方式

    dataConfig: any = {};//数据配置面板信息

    showDimensionValues: boolean = false;//展示维度值

    dateRangeParam: any = {};//时间范围组件的参数

    constructor(
        public configApi: ConfigApi
    ) {

    }

    /**
     * 获取维度、指标、时间维度属性
     */
    async getDimensionAndMetrics() {
        if (!this.selectedCube) {
            return;
        }
        let data: any = await this.configApi.getAttributeByCubeId(this.selectedCube);
        for (let i = 0; i < data.length; i++) {
            if (data[i]["metaAttributeType"] == 2) {//维度
                this.dimensionList.push({ value: data[i]["metaAttributeName"], label: data[i]["metaAttributeName"] });
                if (data[i]["type"] == 3 || data[i]["type"] == 4) {//日期维度
                    this.dateDimensionsList.push({ value: data[i]["metaAttributeName"], label: data[i]["metaAttributeName"] });
                }
                if (data[i]["type"] !== 3 || data[i]["type"] !== 4) {//地图维度
                    this.cityDimensionsList.push({ value: data[i]["metaAttributeName"], label: data[i]["metaAttributeName"] });
                }
            } else if (data[i]["metaAttributeType"] == 3) {//指标
                this.metricsList.push({ value: data[i]["metaAttributeName"], label: data[i]["metaAttributeName"] });
            }
        }
    }

    /**
     * 根据从dataStore里获取的数据回显数据(cube、维度、指标、时间范围)
     * @param dataConfig 
     */
    showBasicInfoByDataStore(dataConfig: any) {
        this.selectedCube = dataConfig[DataConfigKey.CUBE];
        this.selectedDimensions = dataConfig[DataConfigKey.DIMENSIONS] || [{ value: "" }];
        this.selectedMetrics = dataConfig[DataConfigKey.METRICS] || [{ value: "" }];
    }

    /**
     * 改变cube时，初始化变量
     */
    changeCubeInit() {
        this.orderByList = [];
        this.dimensionList = [];
        this.metricsList = [];
        this.selectedDimensions = [];
        this.selectedMetrics = [];
        this.selectedOrderInfo = [];
        this.dateDimensionsList = [];

        this.dateRangeParam = {};
    }

    /**
     * 检查参数
     */
    checkParam() {
        if (!this.selectedCube) {
            return false;
        }
        if ("statistics" != this.configApi.type && "retention" != this.configApi.type) {
            if (this.selectedDimensions && this.selectedDimensions.length > 0) {
                for (let i = 0; i < this.selectedDimensions.length; i++) {
                    if (!this.selectedDimensions[i]["value"]) {
                        return false;
                    }
                }
            }
        }

        if (this.selectedMetrics && this.selectedMetrics.length > 0) {
            for (let i = 0; i < this.selectedMetrics.length; i++) {
                if (!this.selectedMetrics[i]["value"]) {
                    return false;
                }
            }
        }
        //漏斗图表：没选择步骤时，不获取数据
        if ("funnel" == this.configApi.type && !DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA)) {
            return false;
        }
        return true;
    }

    /**
     * 储存数据到DataStore并获取图表的数据
     * @param key 要保存到dataStore里的key
     * @param value 要保存到dataStore里的value
     */
    getChartData(key?: string, value?: any) {
        if (key) {
            if (key == DataConfigKey.CUBE) {
                this.dataConfig = {};
            }
            this.dataConfig[key] = value;
        }

        Object.assign(this.dataConfig, this.dateRangeParam);//时间组件的参数合并到dataConfig

        if (key == DataConfigKey.DIMENSIONS || key == DataConfigKey.METRICS) {//切换维度指标清空order查询
            this.dataConfig[DataConfigKey.ORDERBY] = "";
        }

        if ("pie" == this.configApi.type) {
            if (!this.dataConfig[DataConfigKey.COUNT]) {            //别的key触发时，判断当时的count是否有值
                this.dataConfig[DataConfigKey.COUNT] = key == "count" && value ? value : 10;
            } else if (this.dataConfig[DataConfigKey.COUNT] > 10) {
                this.dataConfig[DataConfigKey.COUNT] = 10;
            }
        } else if ("bar" == this.configApi.type) {
            if (!this.dataConfig[DataConfigKey.COUNT]) {            //别的key触发时，判断当时的count是否有值
                this.dataConfig[DataConfigKey.COUNT] = key == "count" && value ? value : 10;
            }
        }

        /*
        if (key == "count" || "pie" == this.configApi.type) {
            if (!this.dataConfig[DataConfigKey.COUNT]) {            //别的key触发时，判断当时的count是否有值
                this.dataConfig[DataConfigKey.COUNT] = key == "count" && value ? value : 10;
            } else if (this.dataConfig[DataConfigKey.COUNT] > 10) {
                this.dataConfig[DataConfigKey.COUNT] = 10;
            }
        }
        */

        if (key == "time") {//留存特殊处理
            this.dataConfig["datetime"] = [this.configApi.getBeforeDate(value), this.configApi.getBeforeDate(1)];
        }

        //先将面板保存到DataStore
        DataStore.saveConfigData(this.configApi.scope, "dataConfig", this.dataConfig);

        if (!this.checkParam()) { //检查必传参数（cube、维度、指标）不取数据
            EventEmitter.trigger(EventType.DATACHANGE,
                {
                    scope: this.configApi.scope,
                    data: {
                        code: "300",
                        data: []
                    }
                }
            );
            return;
        }

        new SwitchRequestGraph(
            this.configApi.type,
            {
                "queryParam": this.dataConfig,
                "scope": this.configApi.scope
            },
            this.configApi.reportConfigService
        );
    }

    /**
     * 保存配置数据到DataStore 并触发舞台将配置数据传入
     * @param key 
     * @param data 
     */
    saveConfig2DataStore(key?: string, data?: any) {
        if (key) {
            this.dataConfig[key] = data;
        }
        DataStore.saveConfigData(this.configApi.scope, "dataConfig", this.dataConfig);

        EventEmitter.trigger(EventType.DATACHANGE,
            {
                scope: this.configApi.scope,
                data: {
                    code: "200",
                    data: [this.dataConfig]
                }
            }
        );
    }

    /**
    * 添加维度
    */
    addDimension() {
        this.selectedDimensions.push({
            value: ""
        });
    }
    /**
     * 删除维度
     */
    removeDimension(data: any[], index: number, type?: string) {
        data.splice(index, 1);
        this.getChartData(DataConfigKey.DIMENSIONS, data);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

    /**
     * 添加指标
     */
    addMetrics() {
        this.selectedMetrics.push({
            value: ""
        });
    }
    /**
     * 删除指标
     * @param i 
     * @param e 
     */
    removeMetrics(data: any[], index: number, type?: string) {
        data.splice(index, 1);
        this.getChartData(DataConfigKey.METRICS, data);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

    /**
     * 添加排序
     */
    addOrder() {
        this.selectedOrderInfo.push({
            field: "",
            order: "asc"
        });
    }

    /**
     * 删除排序
     * @param data 
     * @param index 
     */
    removeOrder(data: any[], index: number) {
        data.splice(index, 1);
        this.getChartData(DataConfigKey.ORDERBY, data);
    }


    /**
     * 改变所选维度
     * @param value 
     */
    changeDimension(value: string, type?: string) {
        this.getChartData(DataConfigKey.DIMENSIONS, this.selectedDimensions);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

    /**
     * 改变所选指标
     * @param value 
     */
    changeMetrics(value: any, type?: string) {
        this.getChartData(DataConfigKey.METRICS, this.selectedMetrics);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

    /**
     * 改变排序的字段
     * @param value 
     */
    changeOrderBy(value: any) {
        this.getChartData(DataConfigKey.ORDERBY, this.selectedOrderInfo);
    }

    /**
     * 改变排序方式
     * @param value 
     */
    changeOrder(value: any) {
        this.getChartData(DataConfigKey.ORDERBY, this.selectedOrderInfo);
    }

    /**
     * 过滤器改动时触发
     * @param data 
     */
    changeFilter(data: any) {
        this.getChartData();
    }

    /**
     * 改变维度值
     * @param dimensionValue 
     */
    changeDimensionValue(dimensionValue: any) {
        this.getChartData();
    }

    /**
     * 日期范围组件改变触发
     * @param value 
     */
    dateRangeChange(value: any) {
        this.dateRangeParam = value;
        this.getChartData();
    }
}