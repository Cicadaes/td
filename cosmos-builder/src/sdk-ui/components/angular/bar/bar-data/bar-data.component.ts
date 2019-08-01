import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { dataType } from '../../../../api/data-store-util';

@Component({
    templateUrl: './bar-data.component.html',
    styleUrls: ['./bar-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class BarDataComponent extends DataPanel implements OnInit {

    positionStyles: { 'transform': string; 'transition': string; };
    count: number = 10;//条形图个数；

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
            this.count = this.dataConfig[DataConfigKey.COUNT];
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
        if ("boolean" != typeof (isFirst)) {//页面点击触发
            this.changeCubeInit();
            this.addDimension();
            this.addMetrics();
            this.getChartData(DataConfigKey.CUBE, this.selectedCube);
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
        this.getChartData(DataConfigKey.DIMENSIONS, this.selectedDimensions);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: "bar", scope: this.configApi.scope });
    }

    /**
     * 删除维度
     */
    removeDimension(data: any[], index: number, type?: string) {
        data.splice(index, 1);
        this.selectedOrderInfo = [];
        this.addOrder();
        this.buildOrderByList();
        this.getChartData(DataConfigKey.DIMENSIONS, data);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: "bar", scope: this.configApi.scope });
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
        this.buildOrderByList();
    }

    /**
     * 处理回显时的排序
     */
    buildOrderByList() {
        this.orderByList = [];
        if (!this.selectedDimensions) {
            return;
        }
        let len = this.selectedDimensions.length || 0;
        if (len != 1) {
            for (let i = 1; i < len; i++) {
                this.orderByList.push({
                    value: this.selectedDimensions[i]["value"],
                    label: this.selectedDimensions[i]["value"]
                });
            }
        } else {
            for (let i = 0; i < len; i++) {
                this.orderByList.push({
                    value: this.selectedDimensions[i]["value"],
                    label: this.selectedDimensions[i]["value"]
                });
            }
        }
        this.selectedMetrics.forEach((item: any) => {
            item["value"] && this.orderByList.push({
                value: item["value"],
                label: item["value"]
            });
        });
    }

    /**
     * 展示维度值
     */
    showDimensions(status: any) {
        if (status) {
            this.positionStyles = {
                'transform': 'translateX(-260px)',
                'transition': 'all 0.5s ease 0s'
            }

        } else {
            this.positionStyles = {
                'transform': 'translateX(0px)',
                'transition': 'all 0.5s ease 0s'
            }
        }
    }

    /**
     * 改变维度值
     * @param dimensionValue 
     */
    changeDimensionValue(dimensionValue: any) {
        this.getChartData(dataType.DIMENSIONVALUELIST, dimensionValue);
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
        EventEmitter.trigger(EventType.CONFCHANGE, { type: "bar", scope: this.configApi.scope });
    }

    /**
     * 改变count
     * @param value 
     */
    changeCount(value: any) {
        this.getChartData(DataConfigKey.COUNT, value);
    }

}

