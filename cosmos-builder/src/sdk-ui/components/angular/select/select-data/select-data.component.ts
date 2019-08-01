import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ReportConfigService } from '../../../../service/report-config.service';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataStoreUtil, dataType } from '../../../../api/data-store-util';

@Component({
    templateUrl: './select-data.component.html',
    styleUrls: ['./select-data.component.less'],
})
export class SelectDataComponent extends DataPanel implements OnInit {

    isShowName: boolean = false;//显示名称
    name: string = "";//筛选器左侧的文案
    return: boolean = true;//是否直接返回
    selectDimension: string = "";//选中的维度
    private positionStyles: object = {};
    private defaultList: any[];//默认值列表
    private dimensionDefault: any;//默认值
    workingDimension: any;//暂存维度

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
            this.dimensionDefault = this.dataConfig['dimensionDefault'];
            if (this.dimensionDefault) {
                this.setDefaultList(this.dataConfig['dimensionValueData'] && this.dataConfig['dimensionValueData'].options);
            }
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof (isFirst)) {//页面点击触发
            this.dataConfig = {};
            this.name = "";
            this.isShowName = false;
            this.selectDimension = null;
            this.metricsList = [];
            this.saveConfig2DataStore("cube", this.selectedCube);
        }
        this.defaultList = [];
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
    changeShowName(value: any) {
        this.saveConfig2DataStore("isShowName", this.isShowName);
    }

    /**
     * 改变所选维度
     * @param value 
     */
    changeDimension(value: string, type?: string) {
        if (this.workingDimension !== value) {
            this.defaultList = [];
            this.dimensionDefault = '';
        }
        this.workingDimension = value
        DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA, null);
        this.saveConfig2DataStore("dimension", this.selectDimension);
        setTimeout(() => {
            this.changeDefault(this.dimensionDefault)
            console.log(this.dimensionDefault)
        }, 1000);
    }

    /**
     * 改变维度值
     * @param dimensionValue 
     */
    changeDimensionValue(dimensionValue: any) {
        let dimensionValueData = DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA);
        this.saveConfig2DataStore();
        this.setDefaultList(dimensionValueData.options);
    }

    /**
     * 设置维度默认值列表
     * @param options 
     */
    setDefaultList(data: any) {
        this.defaultList = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].checked) {
                    this.defaultList.push({ label: data[i].label, value: data[i].value });
                }
            }
            if (this.defaultList.length > 0) {
                this.dimensionDefault = this.defaultList[0].value;
                this.changeDefault(this.dimensionDefault)
            }
        }
    }

    /**
    * 改变显示名称
    * @param value 
    */
    changeDefault(value: any) {
        this.saveConfig2DataStore("dimensionDefault", value);
        setTimeout(() => {
            this.dimensionDefault = value
        }, 0);
    }

    /**
    * 展示维度值
    */
    showDimensions(status: any) {
        this.dimensionDefault = '';
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

