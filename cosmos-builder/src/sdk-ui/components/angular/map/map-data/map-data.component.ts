import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
@Component({
    templateUrl: './map-data.component.html',
    styleUrls: ['./map-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class MapDataComponent extends DataPanel implements OnInit {
    province: any = {
        show: true,
        value: 10
    }
    cent: any = {}
    constructor(
        public configApi: ConfigApi) {
        super(configApi);
    }

    async ngOnInit() {
        this.cubeList = await this.configApi.getCubeList();
        let config = DataStore.getConfigData(this.configApi.scope);
        if (config && config["dataConfig"]) {
            this.dataConfig = config["dataConfig"];
            this.showBasicInfoByDataStore(this.dataConfig);
            if (this.dataConfig && this.dataConfig.provincesDistribution) {
                this.province = config["dataConfig"]["provincesDistribution"];
            }
            this.changeCube(true);
        } else {
            this.addDimension();
            this.addMetrics();
            this.province = this.province;
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        this.cityDimensionsList = [];
        this.metricsList = [];
        if ("boolean" != typeof (isFirst)) {//页面点击触发
            this.changeCubeInit();
            this.addDimension();
            this.addMetrics();
            this.getChartData(DataConfigKey.CUBE, this.selectedCube);
            this.getChartData("provincesDistribution", this.province);
        }
        this.getDimensionAndMetrics();

    }
    /**
     * @param data 
     */
    OptionChange(data: any) {
        if (typeof (data) !== 'boolean') {
            let cont = Number(this.province.value)
            if (cont < 0) {
                this.province.value = 1;
            }
            if (cont > 34) {
                this.province.value = 34;
            }
        }
        this.cent = this.deepCopy(this.province)
        this.getChartData("provincesDistribution", this.cent);
    }
    inputNumberChange() {
        if (this.province.value == null) {
            this.cent = this.deepCopy(this.province)
            this.cent['value'] = 1;
            this.getChartData("provincesDistribution", this.cent);
        } else if (this.province.value == 0) {
            this.province.value = 1;
            this.cent = this.deepCopy(this.province)
            this.getChartData("provincesDistribution", this.cent);
        }
    }

    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }

}

