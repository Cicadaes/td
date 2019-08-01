import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';
import { DataStore } from 'cosmos-td-sdk';

@Component({
    templateUrl: './pie-style.component.html',
    styleUrls: ['./pie-style.component.less'],
})
export class PieStyleComponent extends StylePanel implements OnInit {

    /* 滑块 */
    min: number = 0;
    max: number = 20;
    mid: number;

    /* 内圆半径 */
    _fill: number = 20;

    sectorsNum: number = 10;            //扇区默认个数

    pieStyle: any = {};                 //扇区
    labelStyle: any = {};               //标签
    /* 颜色选择器 */
    labelColor: string = "#ffffff";
    corLen: number = 10;
    colorsInit: string[] = [];
    colorOptions: string[] = [];
    _cmPosition: string = 'left';
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];

    /* 标题格式 */
    tagFormats = [
        {
            value: 'none',
            label: '无'
        },
        {
            value: 'percent',
            label: '百分比'
        },
        {
            value: 'label',
            label: '标签'
        },
        {
            value: 'value',
            label: '值'
        },
    ];

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
    preIconClassMap = {
        'anticon': true,
        'anticon-frown-o': true
    };
    nextIconClassMap = {
        'anticon': true,
        'anticon-smile-o': true
    };

    set fill(value: number) {
        this._fill = value;
        this.highlightIcon();
    }

    get fill() {
        return this._fill;
    }

    highlightIcon() {
        const lower = this._fill >= this.mid;
        this.preIconClassMap['anticon-highlight'] = !lower;
        this.nextIconClassMap['anticon-highlight'] = lower;
    }

    constructor(public configApi: ConfigApi) {
        super(configApi);
        this.mid = parseFloat(((this.max - this.min) / 2).toFixed(5));
    }

    ngOnInit() {
        this.colorsInit = [];
        this.colorOptions = [];

        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];
        if (config && config["dataConfig"] && config.dataConfig.count) {
            //  this.sectorsNum = Number(config.dataConfig.count);
        }
        if (styleConfig && styleConfig["pie"]) {
            this.pieStyle = styleConfig["pie"];
            this.colorOptions = this.pieStyle.colors;
            for (let i = this.colorOptions.length; i < this.corLen; i++) {
                this.colorOptions.push(this.color[i]);
            }
        } else {
            for (let i = 0; i < this.corLen; i++) {
                this.colorOptions.push(this.color[i]);
            }
            this.pieStyle = {
                mode: 'queue',
                colors: this.colorOptions,
                fill: this._fill,
                total: false,
                totalAttr: ''
            }
        }
        if (styleConfig && styleConfig["label"]) {
            this.labelColor = styleConfig["label"].color || this.labelColor;
            this.labelStyle = styleConfig["label"];
        } else {
            this.labelStyle = {
                color: this.labelColor,
                fontFamily: this.typefaces[0].value,
                type: this.tagFormats[1].value,
            };
        }

        Object.assign(this.colorsInit, this.colorOptions);
        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }

    _colorPicker(index: number) {
        if (0 == index) {
            return true;
        }
        if (this.pieStyle.mode == "queue") {
            if (this.sectorsNum) {
                if (index < this.sectorsNum) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else if (this.pieStyle.mode == "single") {
            return false;
        } else {

        }
        return false;
    }

    /* 颜色改变 */
    colorChange(color: string, index: number) {
        this.colorOptions[index] = color;
        this.OptionChange();
    }

    totalChange() {
        if (this.pieStyle.total) {
            this.chartConfig = DataStore.getConfigData(this.configApi.scope);
            let metrics = this.chartConfig && this.chartConfig["dataConfig"] && this.chartConfig["dataConfig"]['metrics'];
            this.pieStyle['totalAttr'] = (metrics && metrics.length && metrics[0].value) || "";
        } else {
            this.pieStyle['totalAttr'] = '';
        }
        this.OptionChange();
    }

    OptionChange() {
        let sectors = {};
        let corlen = this.pieStyle.mode == 'single' ? 1 : (this.sectorsNum ? (this.sectorsNum >= this.corLen ? this.corLen : this.sectorsNum) : 10);

        Object.assign(sectors, this.pieStyle);
        sectors['colors'] = this.colorOptions.slice(0, corlen);

        let data = {
            pie: sectors,
            label: this.labelStyle,
            legend: this.legendStyle,
            layout: this.layoutStyle
        };

        this.nofication(this.configApi.scope, data);
    }

    public reRenderData(type: string) {
        if (type != "pie") {
            return;
        }
        if (this.chartConfig && this.chartConfig["dataConfig"]) {
            if (this.chartConfig.dataConfig.count &&
                this.sectorsNum != Number(this.chartConfig.dataConfig.count)) {
                this.sectorsNum = Number(this.chartConfig.dataConfig.count);
                //this.OptionChange();      改变扇区个数data改变没有样式快，防止图表闪动
            }
        }
    }
}
