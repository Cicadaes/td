import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ReportConfigService } from '../../../../service/report-config.service';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';

@Component({
    templateUrl: './tab-data.component.html',
    styleUrls: ['./tab-data.component.less'],
})
export class TabDataComponent extends DataPanel implements OnInit {

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
            this.showBasicInfoByDataStore(config["dataConfig"]);
            this.changeCube(true);
        } else {
            this.addMetrics();
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof(isFirst)) {//页面点击触发
            this.addMetrics();
            this.dataConfig = {};
            this.changeCubeInit();
            this.addMetrics();
            this.saveConfig2DataStore("cube", this.selectedCube);
        }
        this.getDimensionAndMetrics();
    }

    /**
     * 删除指标
     * @param i 
     * @param e 
     */
    removeMetrics(data: any[], index: number, type?: string) {
        data.splice(index, 1);
        this.saveConfig2DataStore(DataConfigKey.METRICS, this.selectedMetrics);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

     /**
     * 改变所选指标
     * @param value 
     */
    changeMetrics(value: any, type?: string) {
        this.saveConfig2DataStore(DataConfigKey.METRICS, this.selectedMetrics);
        EventEmitter.trigger(EventType.CONFCHANGE, { type: type || "style", scope: this.configApi.scope });
    }

}

