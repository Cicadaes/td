import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { StylePanel } from '../../common/style.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';

@Component({
    templateUrl: './grid-style.component.html',
    styleUrls: ['./grid-style.component.less'],
})
export class GridStyleComponent extends StylePanel implements OnInit {
    gridName: any = {};         //表格名称
    gridColor: any = {};        //表格颜色
    gridValue: any = {};        //表格值
    gridDownload: any = {};     //表格下载
    gridHelp: any = {};         //表格帮助
    show: boolean = false;
    number: number = null;
    content: any;
    _cmcolor: string = "#515A6E";           //标签默认色
    _cmPosition: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];
    /* 小数精度 */
    decimal: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    decimalss: any[] = [{ label: "自动", value: 2 }].concat(this.decimal.map(item => { return { label: item, value: item } }));
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

        if (styleConfig && styleConfig["gridName"]) {
            this.gridName = styleConfig["gridName"];
        } else {
            this.gridName = {
                name: this.number,
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
            };
        }
        if (styleConfig && styleConfig["gridColor"]) {
            this.gridColor = styleConfig["gridColor"];
        } else {
            this.gridColor = {
                bg: this._cmcolor,
                odd: this._cmcolor,
                style: this._cmcolor,
                even: this._cmcolor,
            };
        }
        if (styleConfig && styleConfig["gridValue"]) {
            this.gridValue = styleConfig["gridValue"];
        } else {
            this.gridValue = {
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
                decimals: this.decimalss[0].value,
            };
        }
        if (styleConfig && styleConfig["gridDownload"]) {
            this.gridDownload = styleConfig["gridDownload"];
        } else {
            this.gridDownload = {
                show: this.show,
                number: this.number,
            };
        }
        if (styleConfig && styleConfig["gridHelp"]) {
            this.gridHelp = styleConfig["gridHelp"];
        } else {
            this.gridHelp = {
                show: this.show,
                content: this.content,
            };
        }
        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }
    OptionChange(event?: Event) {
        let data = {
            gridName: this.gridName,
            gridValue: this.gridValue,
            layout: this.layoutStyle,
            gridColor: this.gridColor,
            gridDownload: this.gridDownload,
            gridHelp: this.gridHelp,
        };
        this.nofication(this.configApi.scope, data);
    }
    changeGrid(data:any){
        this.gridHelp.content=data;
        this.OptionChange();
    }
}
