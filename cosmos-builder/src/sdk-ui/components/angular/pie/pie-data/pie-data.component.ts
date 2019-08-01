import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ReportConfigService } from '../../../../service/report-config.service';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { dataType } from '../../../../api/data-store-util';
import { DataStoreUtil } from '../../../../api/data-store-util';

@Component({
    templateUrl: './pie-data.component.html',
    styleUrls: ['./pie-data.component.less'],
})
export class PieDataComponent extends DataPanel implements OnInit {

    count: number; //扇形区域
    positionStyles: { 'transform': string; 'transition': string; };
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
            this.changeCube(true);
        } else {
            this.addDimension();
            this.addMetrics();
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof(isFirst)) {//页面点击触发
            this.count = 10;
            this.changeCubeInit();
            this.addDimension();
            this.addMetrics();
            this.dataConfig = {};
            this.getChartData(DataConfigKey.CUBE, this.selectedCube);
        }
        this.getDimensionAndMetrics();
    }

    /**
     * 改变count
     * @param value 
     */
    changeCount(value: any) {
        this.getChartData(DataConfigKey.COUNT, value);
        EventEmitter.trigger(EventType.CONFCHANGE, {type: "pie", scope: this.configApi.scope});
    }
/**
     * 展示维度值
     */
    showDimensions(status: any){
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
    changeDimensionValue(dimensionValue: any){
        this.getChartData(dataType.DIMENSIONVALUELIST,dimensionValue);
    }

    dimensionValueChange(value:any, type:any){
        
        DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA, null);
        this.changeDimension(value, type);
    }

}

