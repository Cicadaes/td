import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ReportConfigService } from '../../../../service/report-config.service';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataStoreUtil, dataType } from '../../../../api/data-store-util';

@Component({
    templateUrl: './dayWeekMonth-data.component.html',
    styleUrls: ['./dayWeekMonth-data.component.less'],
})
export class DayWeekMonthDataComponent extends DataPanel implements OnInit {

    isShowName: boolean = false;//显示名称
    name: string = "";//筛选器左侧的文案

    selectDimension: string = "";//选中的维度
    private positionStyles: object = {};

    constructor(
        public configApi: ConfigApi,
        private cdref: ChangeDetectorRef,
    ) {
        super(configApi);
    }

    async ngOnInit() {
        this.cubeList = await this.configApi.getCubeList();
        let config = DataStore.getConfigData(this.configApi.scope);
        if (config && config["dataConfig"]) {
            this.dataConfig = config["dataConfig"];
            this.selectedCube = this.dataConfig["cube"];
            this.name = this.dataConfig["name"];
            this.isShowName = this.dataConfig["isShowName"];
            this.selectDimension = this.dataConfig["dimension"];
            this.changeCube(true);
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof(isFirst)) {//页面点击触发
            this.dataConfig = {};
            this.name = "";
            this.isShowName = false;
            this.selectDimension = null;
            this.saveConfig2DataStore("cube", this.selectedCube);
        }
        this.dimensionList = [];
        this.getDimensionAndMetrics();
    }

    /**
     * 改变名称
     * @param value 
     */
    changeName(value: any) {
        this.saveConfig2DataStore("name", this.name);
    }

    /**
     * 改变显示名称
     * @param value 
     */
    changeShowName(value: any){
        this.saveConfig2DataStore("isShowName", this.isShowName);
    }

    /**
     * 改变所选维度
     * @param value 
     */
    changeDimension(value: string, type?: string) {
        DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA, null);
        this.saveConfig2DataStore("dimension", this.selectDimension);
    }

    /**
     * 改变维度值
     * @param dimensionValue 
     */
    changeDimensionValue(dimensionValue: any){
        let dimensionValueData = DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA);
        this.saveConfig2DataStore();
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
        // this.cdref.detectChanges();
    }
}

