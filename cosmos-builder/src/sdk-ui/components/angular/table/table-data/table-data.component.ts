import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataPanel, DataConfigKey } from '../../common/data.panel';

@Component({
    templateUrl: './table-data.component.html',
    styleUrls: ['./table-data.component.less'],
})
/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class TableDataComponent extends DataPanel implements OnInit {
    
    constructor(
        public configApi: ConfigApi
    ) {
        super(configApi);
    }

    async ngOnInit() {
        this.cubeList = await this.configApi.getCubeList();
        let config = DataStore.getConfigData(this.configApi.scope);
        if (config && config["dataConfig"]) {
            this.dataConfig = config["dataConfig"];
            this.showBasicInfoByDataStore(this.dataConfig);
            this.selectedOrderInfo = this.dataConfig[DataConfigKey.ORDERBY] || [];
            this.changeCube(true);
            this.buildOrderByList();
        } else {
            this.addDimension();
            this.addMetrics();
            this.addOrder();
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof(isFirst)) {//页面点击触发
            this.changeCubeInit();
            this.addDimension();
            this.addMetrics();
            this.getChartData(DataConfigKey.CUBE,this.selectedCube);
        }
        if (this.selectedOrderInfo.length == 0) {
            this.addOrder();
        }
        this.getDimensionAndMetrics();
    }

    /**
     * 改变所选维度
     * @param value 
     */
    changeDimension(value: string, type?: string) {
        this.selectedOrderInfo = [];
        this.addOrder();
        this.buildOrderByList();
        this.getChartData(DataConfigKey.DIMENSIONS,this.selectedDimensions);
        EventEmitter.trigger(EventType.CONFCHANGE, {type: "table", scope: this.configApi.scope});
    }

    /**
     * 改变所选指标
     * @param value 
     */
    changeMetrics(value: any, type?: string) {
        this.selectedOrderInfo = [];
        this.addOrder();
        this.buildOrderByList();
        this.getChartData(DataConfigKey.METRICS, this.selectedMetrics);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

    /**
     * 删除维度
     */
    removeDimension(data: any[] ,index: number, type?: string) {
        data.splice(index,1);
        this.selectedOrderInfo = [];
        this.addOrder();
        this.buildOrderByList();
        this.getChartData(DataConfigKey.DIMENSIONS, data);
        EventEmitter.trigger(EventType.CONFCHANGE, {type: "table", scope: this.configApi.scope});
    }

    /**
     * 删除指标
     * @param i 
     * @param e 
     */
    removeMetrics(data: any[], index: number, type?: string) {
        data.splice(index, 1);
        this.selectedOrderInfo = [];
        this.addOrder();
        this.buildOrderByList();
        this.getChartData(DataConfigKey.METRICS, data);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }


    /**
     * 处理回显时的排序
     */
    buildOrderByList() {
        this.orderByList = [];

        if (!this.selectedDimensions && !this.selectedMetrics) {
            return;
        }

        this.selectedDimensions.forEach((item: any) => {
            item["value"] && this.orderByList.push({
                value: item["value"],
                label: item["value"]
            });
        });
        this.selectedMetrics.forEach((item: any) => {
            item["value"] && this.orderByList.push({
                value: item["value"],
                label: item["value"]
            });
        });
    }

    /**
     * 改变count
     * @param value 
     */
    changeCount(value: any) {
        this.getChartData(DataConfigKey.COUNT, value);
        EventEmitter.trigger(EventType.CONFCHANGE, {type: "table", scope: this.configApi.scope});
    }

}

