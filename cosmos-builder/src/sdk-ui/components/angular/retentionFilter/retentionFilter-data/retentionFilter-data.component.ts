import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';

@Component({
    templateUrl: './retentionFilter-data.component.html',
    styleUrls: ['./retentionFilter-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class RetentionFilterDataComponent extends DataPanel implements OnInit {

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
        this.buildOrderByList();
        this.getChartData(DataConfigKey.DIMENSIONS,this.selectedDimensions);
        EventEmitter.trigger(EventType.CONFCHANGE, {type: "retention", scope: this.configApi.scope});
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
        EventEmitter.trigger(EventType.CONFCHANGE, {type: "retention", scope: this.configApi.scope});
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
        for (let i = 0; i < len; i++) {
            this.orderByList.push({
                value: this.selectedDimensions[i]["value"],
                label: this.selectedDimensions[i]["value"]
            });
        }
    }

    /**
     * 改变count
     * @param value 
     */
    changeCount(value: any) {
        this.getChartData(DataConfigKey.COUNT, value);
        EventEmitter.trigger(EventType.CONFCHANGE, {type: "retention", scope: this.configApi.scope});
    }

}

