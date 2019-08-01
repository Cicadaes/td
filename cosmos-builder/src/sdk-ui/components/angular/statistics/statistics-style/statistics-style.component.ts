import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { StylePanel } from '../../common/style.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';


@Component({
    templateUrl: './statistics-style.component.html',
    styleUrls: ['./statistics-style.component.less'],
})
export class StatisticsStyleComponent extends StylePanel implements OnInit {
    statistics: any = {};

    missingData: any = "zero";
    // font-family: HelveticaNeue-Medium;
    // font-size: 24px;
    // color: #17233D;
    // line-height: 32px;
    layout: any = "left";
    _cmcolor: string = "#17233D";           //标签默认色
    _cmPosition: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];
    /* 小数精度 */
    decimal: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    decimalss: any[] = [{ label: "自动", value: "auto" }].concat(this.decimal.map(item => { return { label: item, value: item } }));
    /* 图例文字大小 */
    fontSizesArr: number[] = [8, 9, 10, 11, 12, 14, 18, 24, 28, 30, 32, 36, 48, 60, 72, 96];
    fontSizeOptions: any[] = [{ label: "自动", value: "24px" }].concat(this.fontSizesArr.map(item => { return { label: item + "px", value: item + "px" } }));
    /* 字体设置 */
    typefaces = [
        {
            value: "HelveticaNeue-Medium",
            label: "黑体"
        },
        {
            value: "PingFangSC-Medium",
            label: "苹方中号"
        },
        {
            value: "Microsoft YaHei",
            label: "微软雅黑"
        },
        {
            value: "SimSun",
            label: "宋体"
        },
        {
            value: "FangSong",
            label: "仿宋"
        },
        {
            value: "KaiTi",
            label: "楷体"
        },
    ];
    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {

        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];

        if (styleConfig && styleConfig["statistics"]) {
            this.missingData = styleConfig["missingData"];
            this.statistics = styleConfig["statistics"];
        } else {
            this.statistics = {
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
                textAlign: this.layout,
                decimals: this.decimalss[0].value,
                // height: {adapt: true}
            };
        }
        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let data = {
            statistics: this.statistics,
            missingData: this.missingData,
            layout: this.layoutStyle,
            height: { adapt: true }
        };

        this.nofication(this.configApi.scope, data);
    }
}
