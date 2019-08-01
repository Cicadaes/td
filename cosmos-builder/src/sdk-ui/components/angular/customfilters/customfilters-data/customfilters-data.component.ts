import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataStoreUtil, dataType } from '../../../../api/data-store-util';
import { ReportConfigService } from "../../../../service/report-config.service";
@Component({
    templateUrl: './customfilters-data.component.html',
    styleUrls: ['./customfilters-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class customfiltersDataComponent extends DataPanel implements OnInit {
    DimensionList: any[] = [];//有数据字典的维度列表
    name: string = "";//筛选器左侧的文案
    selectDimension: string = "";//选中的维度
    constructor(
        public configApi: ConfigApi,
        private reportConfigService: ReportConfigService,
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
            // this.getAttributeByCubeId(this.selectedCube);
            this.dataConfig["dimensions"] ? this.selectedDimensions = this.dataConfig["dimensions"] : this.addDimension();;
            this.changeCube(true);
        } else {
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
            // this.getAttributeByCubeId(this.selectedCube);
        }
        this.DimensionList = [];
    }
    /**
     * 改变名称
     * @param value 
     */
    changeName(value: any) {
        this.saveConfig2DataStore("name", this.name);
    }
    /**
     * 获取URL
     * @param name 
     */
    // getParamByName(name: string) {
    //     var search = document.location.href;
    //     var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    //     var matcher = pattern.exec(search);
    //     var items = null;
    //     if (null != matcher) {
    //         try {
    //             items = decodeURIComponent(decodeURIComponent(matcher[1]));
    //         } catch (e) {
    //             try {
    //                 items = decodeURIComponent(matcher[1]);
    //             } catch (e) {
    //                 items = matcher[1];
    //             }
    //         }
    //     }
    //     return items;
    // };
    // /**
    // * 根据cubeId获取属性列表
    // * @param cubeId
    // */
    // getAttributeByCubeId(cubeId: number) {
    //     let globalData = DataStore.getGlobalData();
    //     let productid;
    //     if (globalData && globalData["filter"]) {
    //         for (let k = 0; k < globalData["filter"].length; k++) {
    //             if (globalData["filter"][k]["field"] == "product_id") {
    //                 productid = this.getParamByName(globalData["filter"][k]["field"]) || globalData["filter"][k]["value"];
    //             }
    //         }
    //     } else {
    //         let paramList = this.reportConfigService.globalParamList;
    //         if (paramList && paramList["filter"]) {
    //             for (let k = 0; k < paramList.length; k++) {
    //                 if (paramList[k]["name"] == "product_id") {
    //                     productid = this.getParamByName(paramList[k]["name"]) || null;
    //                 }
    //             }
    //         } else {
    //             productid = null;
    //         }
    //     }
    //     // let dat: any = { "cubeId": cubeId, "productid": productid }
    //     let dat: any = { "cubeId": 284, "productid": 344 }
    //     this.reportConfigService.customqueryMetaAttr(dat).then((res: any) => {
    //         let data = res;
    //         for (let i = 0; i < data.length; i++) {
    //             for (let j = 0; j < data[i]["child"].length; j++) {
    //                 this.DimensionList.push({ "label": data[i]["child"][j]["name"], "value": data[i]["child"][j]["code"], "displayType": data[i]["child"][j]["displayType"], "dicKey": data[i]["child"][j]["dicKey"] });
    //             }
    //         }
    //         this.saveConfig2DataStore('DimensionList', this.DimensionList);
    //     }).catch((err) => {
    //         return err;
    //     });
    // }
    /**
    * 下拉框赋值
    * @param 
    */
    // private assign() {
    //     if (this.DimensionList && this.DimensionList.length > 0) {
    //         for (let i = 0; i < this.DimensionList.length; i++) {
    //             this.DimensionList[i]['value'] = this.DimensionList[i]['metaAttributeName'];
    //             this.DimensionList[i]['label'] = this.DimensionList[i]['metaAttributeName'];
    //         }
    //     }
    // }
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

