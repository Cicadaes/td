import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ReportConfigService } from '../../../../service/report-config.service';
import { funnelProcedureService } from './funnel-data-procedure/funnel-procedure.service';
import { Subscription } from 'rxjs/Subscription';
import { DataStoreUtil, dataType } from "./../../../../api/data-store-util";



@Component({
    templateUrl: './funnel-data.component.html',
    styleUrls: ['./funnel-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class FunnelDataComponent extends DataPanel implements OnInit {
    selectedCube: any;
    selectedDimensions: any;
    target: any;
    private subscription: Subscription;

    constructor(
        public configApi: ConfigApi,
        private funnelProcedureService: funnelProcedureService,
    ) {
        super(configApi);
    }

    async ngOnInit() {
        this.cubeList = await this.configApi.getCubeList();
        let config = DataStore.getConfigData(this.configApi.scope);
        if (config && config["dataConfig"]) {
            this.dataConfig = config["dataConfig"];
            this.showBasicInfoByDataStore(this.dataConfig);
            this.changeCube(true);
        } else {
            this.addDimension();
            this.addMetrics();
        }
        this.target = this.selectedDimensions[0].value;
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof (isFirst)) {//页面点击触发
            this.changeCubeInit();
            this.addDimension();
            this.addMetrics();
            this.dataConfig = {};
            this.getChartData(DataConfigKey.CUBE, this.selectedCube);
        }
        this.getDimensionAndMetrics();
    }

    /**
     * 改变所选维度
     * @param value 
     */
    changeDimension(value: string, type?: string) {
        if (DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA)) {
            let data: any = {};
            DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA, data);
        }
        this.getChartData(DataConfigKey.DIMENSIONS, this.selectedDimensions);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

    /**
     * 漏斗配置改变时触发
     * @param data 
     */
    changeFunnel(data: any) {
        this.getChartData();
    }
}

