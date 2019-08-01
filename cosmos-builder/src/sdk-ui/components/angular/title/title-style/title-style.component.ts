import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataStore } from 'cosmos-td-sdk';
import { EventEmitter } from 'cosmos-td-sdk';
import { ComponentEvent, EventType } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';


@Component({
    templateUrl: './title-style.component.html',
    styleUrls: ['./title-style.component.less'],
})

export class TitleStyleComponent extends StylePanel implements OnInit {


    gridName: any = {};         //表格名称
    gridDownload: any = {};     //表格下载
    gridHelp: any = {};         //表格帮助
    gridHelpTitle:string;
    show: boolean = true;
    number: number = null;
    content: any;
    layout: any = "left";       //默认排布
    _cmcolor: string = "#17233D";           //标签默认色
    _cmPosition: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];
    /* 小数精度 */
    decimal: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    decimalss: any[] = [{ label: "自动", value: 2 }].concat(this.decimal.map(item => { return { label: item, value: item } }));
    /* 图例文字大小 */
    fontSizesArr: number[] = [8, 9, 10, 11, 12, 14, 18, 24, 28, 30, 32, 36, 48, 60, 72, 96];
    fontSizeOptions: any[] = [{ label: "自动", value: 14 }].concat(this.fontSizesArr.map(item => { return { label: item + "px", value: item } }));
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
                name: '标题',
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
                layout: this.layout,
            };
        }
        if (styleConfig && styleConfig["gridDownload"]) {
            this.gridDownload = styleConfig["gridDownload"];
        } else {
            this.gridDownload = {
                show: this.show,
                // number: this.number,
            };
        }
        if (styleConfig && styleConfig["gridHelp"]) {
            this.gridHelp = styleConfig["gridHelp"];
        } else {
            this.gridHelp = {
                show: this.show,
                content: this.content,
                title:this.gridHelpTitle
            };
        }
        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }
    OptionChange(event?: Event) {
        let data = {
            gridName: this.gridName,
            gridDownload: this.gridDownload,
            gridHelp: this.gridHelp,
            layout: this.layoutStyle,
        };
        this.nofication(this.configApi.scope, data);
    }
    changeTitle(data: any) {
        this.gridHelp.content = data;
        this.OptionChange();
    }
    /**
     * @param data 
     */
    cent:any;
    optionChange(data: any) {
        if (typeof (data) !== 'boolean') {
            let cont = Number(this.gridDownload.number)
            if (cont < 0) {
                this.gridDownload.number = 1;
            }
        }
        let date = {
            gridName: this.gridName,
            gridDownload: this.gridDownload,
            gridHelp: this.gridHelp,
            layout: this.layoutStyle,
        };
        this.nofication(this.configApi.scope, date);
    }
    inputNumberChange() {
        if (this.gridDownload.number == null) {
            this.cent = this.deepCopy(this.gridDownload.number)
            // this.gridDownload.number = 1;
        } else if (this.gridDownload.number == 0) {
            this.gridDownload.number = 1;
        }
    }

    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}

