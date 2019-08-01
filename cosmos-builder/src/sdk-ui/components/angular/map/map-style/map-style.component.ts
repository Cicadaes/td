import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { StylePanel } from '../../common/style.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';


@Component({
    templateUrl: './map-style.component.html',
    styleUrls: ['./map-style.component.less'],
})
export class MapStyleComponent extends StylePanel implements OnInit {
    mapStyle: any = {};

    /* 颜色选择器 */
    _cmType: string = "noRgb";
    labelColor: string = "#000000";
    corLen: number = 10;
    colorsInit: string[] = [];
    colorOptions: string[] = [];
    _cmPosition: string = 'left';
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];

    /* 图例文字大小 */
    fontSizesArr: number[] = [8, 9, 10, 11, 12, 14, 18, 24, 28, 30, 32, 36, 48, 60, 72, 96];
    fontSizeOptions: any[] = [{ label: "自动", value: 12 }].concat(this.fontSizesArr.map(item => { return { label: item + "px", value: item } }));

    /* 字体设置 */
    typefaces = [
        {
            value: "PingFangSC-Medium",
            label: "苹方中号"
        },
        {
            value: 'Microsoft YaHei',
            label: '微软雅黑'
        },
        {
            value: 'SimHei',
            label: '黑体'
        },
        {
            value: 'SimSun',
            label: '宋体'
        },
        {
            value: 'FangSong',
            label: '仿宋'
        },
        {
            value: 'KaiTi',
            label: '楷体'
        },
    ];
    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {

        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];

        if (styleConfig && styleConfig["mapStyle"]) {
            this.mapStyle = styleConfig["mapStyle"];
        } else {
            this.mapStyle = {
                dataLabel: true,
                labelColor: '#2d8cf0',
                textColor: this.labelColor,
                fontFamily: this.typefaces[0].value,
                fontSize: this.fontSizeOptions[0].value,
            };
        }

        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let data = {
            mapStyle: this.mapStyle,
            layout: this.layoutStyle,
        };
        this.nofication(this.configApi.scope, data);
    }
}
