import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { DataStoreUtil, dataType } from '../../../../api/data-store-util';
@Component({
    templateUrl: './area-data.component.html',
    styleUrls: ['./area-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class AreaDataComponent extends DataPanel implements OnInit {
    private positionStyles: object = {};
    selectDimension: string = "";//选中的维度
    
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
            this.selectedCube = this.dataConfig["cube"];
            this.selectDimension = this.dataConfig["dimension"];
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

    secondDimensionChange(value:any, type:any){
        DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA, null);
        this.changeDimension(value, type)
    }

}

