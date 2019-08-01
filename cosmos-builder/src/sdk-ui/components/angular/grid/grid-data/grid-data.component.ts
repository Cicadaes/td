import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { DataPanel, DataConfigKey } from '../../common/data.panel';

@Component({
    templateUrl: './grid-data.component.html',
    styleUrls: ['./grid-data.component.less'],
})
/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class GridDataComponent extends DataPanel implements OnInit {
    
    constructor(
        public configApi: ConfigApi
    ) {
        super(configApi);
    }

    async ngOnInit(){
        this.cubeList = await this.configApi.getCubeList();
        let config = DataStore.getConfigData(this.configApi.scope);
        if(config && config["dataConfig"]){
            this.dataConfig = config["dataConfig"];
            this.showBasicInfoByDataStore(this.dataConfig);
            this.changeCube(true);
        }else{
            this.addDimension();
            this.addMetrics();
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if("boolean" != typeof(isFirst)){//页面点击触发
            this.changeCubeInit();
            this.addDimension();
            this.addMetrics();
            this.getChartData(DataConfigKey.CUBE,this.selectedCube);
        }
        this.getDimensionAndMetrics();
    }

}

