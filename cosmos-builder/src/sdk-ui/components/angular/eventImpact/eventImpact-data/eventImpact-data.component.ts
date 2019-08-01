import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataStoreUtil, dataType } from '../../../../api/data-store-util';
import { ReportConfigService } from "../../../../service/report-config.service";
@Component({
    templateUrl: './eventImpact-data.component.html',
    styleUrls: ['./eventImpact-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class EventImpactDataComponent extends DataPanel implements OnInit {
    DimensionList: any[] = [];//有数据字典的维度列表
    name: string = "";//筛选器左侧的文案
    selectDimension: string = "";//选中的维度
    constructor(
        public configApi: ConfigApi,
        private reportConfigService: ReportConfigService
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
            this.getAttributeByCubeId(this.selectedCube);
            this.selectedDimensions = this.dataConfig["dimensions"];
            this.changeCube(true);
        }else {
            this.addDimension();
        }
    }

    /**
     * 修改选中的cube
     */
    changeCube(isFirst: any) {
        if ("boolean" != typeof (isFirst)) {//页面点击触发
            this.name = "";
            this.addDimension();
            this.dataConfig = {};
            this.changeCubeInit();
            this.addDimension();
            this.saveConfig2DataStore('cube', this.selectedCube);
            this.getAttributeByCubeId(this.selectedCube);
        }
        this.DimensionList = [];
    }

    /**
    * 根据cubeId获取属性列表
    * @param cubeId
    */
    getAttributeByCubeId(cubeId: number) {
        this.reportConfigService.queryMetaAttr(cubeId).then((res: any) => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
                // if (data[i]["metaAttributeType"] == 2 && data[i]["isEnum"] == 1) {
                //     this.DimensionList.push(data[i]);
                //     this.assign();
                // }
                if (data[i]["metaAttributeType"] == 2 || data[i]["metaAttributeType"] == 3) {//lh全部唯度+指标
                    this.DimensionList.push(data[i]);
                    this.assign();
                }
            }
            this.saveConfig2DataStore('DimensionList', this.DimensionList);
        }).catch((err) => {
            // return err;
        });
    }

     /**
     * 下拉框赋值
     * @param 
     */
    private assign() {
        if (this.DimensionList && this.DimensionList.length > 0) {
            for (let i = 0; i < this.DimensionList.length; i++) {
                this.DimensionList[i]['value'] = this.DimensionList[i]['metaAttributeName'];
                this.DimensionList[i]['label'] = this.DimensionList[i]['metaAttributeName'];
            }
        }
    }

    /**
     * 改变名称
     * @param value 
     */
    changeName(value: any) {
        this.saveConfig2DataStore("name", this.name);
    }

    /**
     * 改变所选维度
     * @param value 
     */
    changeDimension(value: any) {
        this.saveConfig2DataStore(DataConfigKey.DIMENSIONS, this.selectedDimensions);
    }

    /**
     * 删除维度
     */
    removeDimension(data: any[], index: number) {
        data.splice(index, 1);
        this.saveConfig2DataStore(DataConfigKey.DIMENSIONS, this.selectedDimensions);
    }

}

