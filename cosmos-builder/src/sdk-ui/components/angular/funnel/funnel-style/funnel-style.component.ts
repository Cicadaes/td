import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';
import { DataStore } from 'cosmos-td-sdk';

@Component({
    templateUrl: './funnel-style.component.html',
    styleUrls: ['./funnel-style.component.less'],
})
export class FunnelStyleComponent extends StylePanel implements OnInit {

    funnelStyle: any = {};
    _cmcolor: string = "#515A6E";           //标签默认色
    _cmPosition: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];
    color: string[] = ['#34508C', '#2B85E4', '#1CB6FB', '#1BDBF5', '#80F2DA', '#C1F9D6', '#FCF4AE', '#FBE790', '#FFBD6E', '#FB7B49'];
    value: any = {};        //值
    percent: any = {};      //步骤间的转化率
    total: any = {};        //总转化率
    accumulated: any = {};    //累计转化率
    procedure: any = {};    //步骤
    change: boolean = false;
    showLegend: boolean = true;

    valueColor: string;
    percentColor: string;
    accumulatedColor: string;
    totalColor: string;
    procedureColor: string;

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
            value: "Microsoft YaHei",
            label: "微软雅黑"
        },
        {
            value: "SimHei",
            label: "黑体"
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
        if (styleConfig && styleConfig["value"]) {
            this.value = styleConfig["value"];
        } else {
            this.value = {
                boxShadow: true,
                color: "#ffffff",
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
            }
        }
        this.valueColor = this.value.color;

        if (styleConfig && styleConfig["percent"]) {
            this.percent = styleConfig["percent"];
        } else {
            this.percent = {
                boxShadow: true,
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
            };
        }
        this.percentColor = this.percent.color;

        if (styleConfig && styleConfig["accumulated"]) {
            this.accumulated = styleConfig["accumulated"];
        } else {
            this.accumulated = {
                boxShadow: true,
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
            };
        }
        this.accumulatedColor = this.accumulated.color;

        if (styleConfig && styleConfig["total"]) {
            this.total = styleConfig["total"];
        } else {
            this.total = {
                boxShadow: true,
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
            };
        }
        this.totalColor = this.total.color;

        if (styleConfig && styleConfig["procedure"]) {
            this.procedure = styleConfig["procedure"];
        } else {
            this.procedure = {
                boxShadow: true,
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
            }
        }
        this.procedureColor = this.procedure.color;

        if (styleConfig && styleConfig["change"]) {
            this.change = styleConfig["change"];
        } else {
            this.change = false;
        }

        this.componentStyleConf(styleConfig);

        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let data = {
            color: this.colorStyle,
            value: this.value,
            percent: this.percent,
            accumulated:this.accumulated,
            total: this.total,
            procedure: this.procedure,
            layout: this.layoutStyle,
            legend: this.legendStyle
        };
        this.nofication(this.configApi.scope, data);
    }
}