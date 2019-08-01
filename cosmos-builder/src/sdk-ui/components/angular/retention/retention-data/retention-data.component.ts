import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';

@Component({
    templateUrl: './retention-data.component.html',
    styleUrls: ['./retention-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class RetentionDataComponent extends DataPanel implements OnInit {

    selectedTime: number;
    times: any = [
        {
            label: "最近7天",
            value: 7
        },
        {
            label: "最近30天",
            value: 30
        },
    ];

    isShowFilter: boolean = true;//舞台展示留存访客定义

    checkDimension: string;//考察对象维度
    selectedCheckDimensionValue: string; //选中的考察对象维度值
    checkDimensionValueList: any = [];//考察对象维度值列表

    retainDimension: string;//留存维度
    selectedRetainDimensionValue: string; //选中的留存维度值
    retainDimensionValueList: any = [];//留存维度值列表

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
            this.selectedDate = this.dataConfig["dateDimension"];
            this.selectedTime = this.dataConfig["time"];
            this.checkDimension = this.dataConfig["checkDimension"];
            this.checkDimensionValueList = this.checkDimension && await this.configApi.queryDimensionValue(this.selectedCube, this.checkDimension);
            this.selectedCheckDimensionValue = this.dataConfig["checkDimensionValue"];

            this.retainDimension = this.dataConfig["retainDimension"];
            this.retainDimensionValueList = this.retainDimension && await this.configApi.queryDimensionValue(this.selectedCube, this.retainDimension);
            this.selectedRetainDimensionValue = this.dataConfig["retainDimensionValue"];
            this.changeCube(true);
        } else {
            this.addMetrics();
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof (isFirst)) {//页面点击触发
            this.changeCubeInit();
            this.addMetrics();
            this.selectedDate = null;
            this.selectedTime = null;
            this.checkDimension = null;
            this.selectedCheckDimensionValue = null;
            this.retainDimension = null;
            this.selectedRetainDimensionValue = null;
            this.getChartData(DataConfigKey.CUBE, this.selectedCube);
            this.dataConfig["isShowFilter"] = this.isShowFilter;
        }
        this.getDimensionAndMetrics();
    }

    /**
     * 改变日期维度字段
     * @param value 
     */
    changeDate(value: any) {
        this.getChartData(DataConfigKey.DATEDIMENSION, this.selectedDate);
    }

    /**
     * 改变舞台是否显示留存定义
     * @param value 
     */
    changeShowFilter(value: any) {
        this.getChartData("isShowFilter", this.isShowFilter);
    }

    changeTime(value: any) {
        this.getChartData("time", this.selectedTime);
    }

    async changeCheckDimension(value: any) {
        this.selectedCheckDimensionValue = null;
        this.checkDimensionValueList = await this.configApi.queryDimensionValue(this.selectedCube, this.checkDimension);
        this.getChartData("checkDimension", this.checkDimension);
    }

    changeCheckDimensionValue(value: any) {
        this.getChartData("checkDimensionValue", this.selectedCheckDimensionValue);
    }

    async changeRetainDimension(value: any) {
        this.selectedRetainDimensionValue = null;
        this.retainDimensionValueList = await this.configApi.queryDimensionValue(this.selectedCube, this.retainDimension);
        this.getChartData("retainDimension", this.retainDimension);
    }

    changeRetainDimensionValue(value: any) {
        this.getChartData("retainDimensionValue", this.selectedRetainDimensionValue);
    }

}

