import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { StylePanel } from '../../common/style.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { TableProcedureService } from './table-style-content/table-style-content.service'

@Component({
    templateUrl: './table-style.component.html',
    styleUrls: ['./table-style.component.less'],
})
export class TableStyleComponent extends StylePanel implements OnInit {
    tableName: any = {};         //表头
    tableColor: any = {};        //颜色
    tableValue: any = {};        //内容
    rests: any = {
        paging: true,
        row: false,
        amount: false
    }
    show: boolean = false;
    number: any = "auto";
    content: any;
    layout: any = "left";
    _cmcolor: string = "#515A6E";           //标签默认色
    _cmPosition: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];
    /* 小数精度 */
    decimal: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    decimalss: any[] = [{ label: "自动", value: "auto" }].concat(this.decimal.map(item => { return { label: item, value: item } }));
    /* 图例文字大小 */
    fontSizesArr: number[] = [8, 9, 10, 11, 12, 14, 18, 24, 28, 30, 32, 36, 48, 60, 72, 96];
    fontSizeOptions: any[] = [{ label: "自动", value: "12px" }].concat(this.fontSizesArr.map(item => { return { label: item + "px", value: item + "px" } }));
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

        if (styleConfig && styleConfig["tableName"]) {
            this.tableName = styleConfig["tableName"];
        } else {
            this.tableName = {
                color: " #17233D",
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
                textAlign: this.layout,
            };
        }
        if (styleConfig && styleConfig["tableColor"]) {
            this.tableColor = styleConfig["tableColor"];
        } else {
            this.tableColor = {
                bg: "rgb(248,248,249)",
                odd: "#ffffff",
                style: "#e9e9e9",
                even: "#ffffff",
            };
        }
        if (styleConfig && styleConfig["tableValue"]) {
            this.tableValue = styleConfig["tableValue"];
        } else {
            this.tableValue = {
                color: " rgba(0, 0, 0, 0.65)",
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
                decimals: this.decimalss[0].value,
                textAlign: this.layout,
            };
        }
        if (styleConfig && styleConfig["rests"]) {
            this.rests = styleConfig["rests"];
        } else {
            this.rests = {
                paging: true,
                row: true,
                amount: false
            };
        }
        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }
    OptionChange(event?: Event) {
        if (this.rests["paging"]) {
            let data = {
                tableName: this.tableName,
                tableValue: this.tableValue,
                layout: this.layoutStyle,
                tableColor: this.tableColor,
                rests: this.rests,
            };
            this.nofication(this.configApi.scope, data);
        } else {
            this.rests = {
                paging: false,
                row: false,
                amount: false
            };
            let data = {
                tableName: this.tableName,
                tableValue: this.tableValue,
                layout: this.layoutStyle,
                tableColor: this.tableColor,
                rests: this.rests,
            };
            this.nofication(this.configApi.scope, data);
        }
    }
}
