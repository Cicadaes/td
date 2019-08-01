import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';
import { DataStore } from 'cosmos-td-sdk';
import { textLinkService } from './text-style-link/text-style-link.service'

@Component({
    templateUrl: './text-style.component.html',
    styleUrls: ['./text-style.component.less'],
})
export class TextStyleComponent extends StylePanel implements OnInit {

    labelStyle: any = {};               //标签
    marginStyle: any = {};               //内边距
    styles: any = {
        FontWigth: false,
        FontStyle: false,
        textDecoration: false,
        decoration: false,
        link: false,
        style: false,
    }


    username: boolean = true;
    FontWigth: boolean = false;
    /* 颜色选择器 */
    labelColor: string = "#17233D";
    corLen: number = 10;
    colorsInit: string[] = [];
    colorOptions: string[] = [];
    _cmPosition: string = 'left';
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];
    //label
    layout: any = "left";

    //margin
    margin: any[] = [0, 4, 5, 8, 10, 16, 24, 32, 36, 48, 72, 96];
    heights: any[] = [{ label: "自动", value: "125%" }].concat(this.margin.map(item => { return { label: item + "px", value: item + "px" } }));
    lefts: any[] = [].concat(this.margin.map(item => { return { label: item + "px", value: item + "px" } }));
    rights: any[] = [].concat(this.margin.map(item => { return { label: item + "px", value: item + "px" } }));
    tops: any[] = [].concat(this.margin.map(item => { return { label: item + "px", value: item + "px" } }));
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


    constructor(public configApi: ConfigApi, private textLinkService: textLinkService, ) {
        super(configApi);
    }

    ngOnInit() {
        this.colorsInit = [];
        this.colorOptions = [];

        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];

        if (styleConfig && styleConfig["label"]) {
            this.labelStyle = styleConfig["label"];
        } else {
            this.labelStyle = {
                color: this.labelColor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
                layout: this.layout,
            };
        }
        // if (styleConfig && styleConfig["margin"]) {
        //     this.marginStyle = styleConfig["margin"];
        // } else {
        //     this.marginStyle = {
        //         height: this.heights[0].value,
        //         left: this.lefts[6].value,
        //         top: this.tops[6].value,
        //         right: this.rights[6].value,
        //     };
        // }
        if (styleConfig && styleConfig["styles"]) {
            this.styles = styleConfig["styles"];
        } else {
            this.styles = {
                FontWigth: false,
                FontStyle: false,
                textDecoration: false,
                decoration: false,
                link: false,
                style: false,
            };
        }
        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }
    /**
     * 改变样式
     * @param data 
     * @param type 
     */
    onclick(data: any, type?: any) {
        data[type] = !data[type];
        this.OptionChange();
    }
    link(data: any) {
        this.styles = {
            FontWigth: false,
            FontStyle: false,
            textDecoration: false,
            decoration: false,
        };
        this.labelStyle = {
            color: this.labelColor,
            fontSize: this.fontSizeOptions[0].value,
            fontFamily: this.typefaces[0].value,
            layout: this.layout,
        };
        this.OptionChange();
    }
    /**
     * 链接
     * @param data 
     * @param type 
     */
    onClick(data: any, type: any) {
        data[type] = !data[type];
        let config = DataStore.getConfigData(this.configApi.scope);
        let conter = config["dataConfig"];
        this.textLinkService.showSourceOK(conter);
    }

    /* 颜色改变 */
    colorChange(color: string, index: number) {
        this.colorOptions[index] = color;
        this.OptionChange();
    }
    OptionChange() {
        let data = {
            label: this.labelStyle,
            // margin: this.marginStyle,
            layout: this.layoutStyle,
            styles: this.styles,
        };
        this.nofication(this.configApi.scope, data);
    }

}
