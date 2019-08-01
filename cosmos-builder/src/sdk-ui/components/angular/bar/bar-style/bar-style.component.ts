import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataStore } from 'cosmos-td-sdk';
import { EventEmitter } from 'cosmos-td-sdk';
import { ComponentEvent, EventType } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';


@Component({
    templateUrl: './bar-style.component.html',
    styleUrls: ['./bar-style.component.less'],
})

export class BarStyleComponent extends StylePanel implements OnInit {
    ratio: boolean = true;
    _autoChecked: boolean = true;
    barNum: number = 10;
    corLen: number = 10;
    shadows: boolean;
    barStyle: any = {};

    axisColor: string = "#2889e9";
    gridColor: string = "transparent";
    gridBackgroud: string = "transparent";

    _cmDisColor: string = "#BBBDC6";
    _cmType: string = "input";
    _cmPosition: string = 'left';
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];

    colorsInit: string[] = [];
    colorOptions: string[] = [];

    initData: any = {
        category: "xAxis",
        mode: "queue",
        colors: [],
        dataLabel: false,
        stacked: false,
        allStacked: false,
        crossGrid: false,
        verticalGrid: false,
        date: false,
        gridColor: this.gridColor,
        gridBackgroud: this.gridBackgroud,
        scaling:false,
    };

    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {
        this.colorsInit = [];
        this.colorOptions = [];
        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];
        //阴影显示?
        // let dataConfig = config && config["dataConfig"];
        // if (dataConfig && dataConfig["dimensions"].length == 1 && dataConfig["metrics"].length == 1) {
        //     this.shadows = true;
        // } else {
        //     this.shadows = false;
        // }
        if (styleConfig && styleConfig["bar"]) {
            this.barStyle = styleConfig["bar"];
            this.colorOptions = this.barStyle.colors;
            for (let i = this.colorOptions.length; i < this.corLen; i++) {
                this.colorOptions.push(this.color[i]);
            }
            Object.assign(this.colorsInit, this.colorOptions);
        } else {
            this.colorsInit = this.color;
            Object.assign(this.colorOptions, this.color);
            Object.assign(this.barStyle, this.initData);
            this.barStyle.colors = this.colorOptions;
            this.barStyle.shadow = true;
            this.barStyle.shadowcolor = "#F4F7FB";
        }

        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }

    _colorPicker(index: number) {
        if (0 == index) {
            return true;
        }
        if (this.barStyle.mode == "queue") {
            if (this.barNum) {
                if (index < this.barNum) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else if (this.barStyle.mode == "single") {
            return false;
        } else {

        }
        return false;
    }

    colorChange(color: string, index: number) {
        this.colorOptions[index] = color;
        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let barData = {};
        let corlen = this.barStyle.mode == 'single' ? 1 : (this.barNum ? (this.barNum >= this.corLen ? this.corLen : this.barNum) : 10);
        if (this.barStyle.stacked == false) {
            this.barStyle.allStacked = false
        }
        if (this.barStyle.stacked || this.barStyle.category !== 'yAxis') {
            this.ratio = false;
            this.barStyle.date = false;
        } else {
            this.barStyle.scaling = false;
            this.ratio = true;
        }
        Object.assign(barData, this.barStyle);
        barData['colors'] = this.colorOptions.slice(0, corlen);
        let data = { bar: barData, layout: this.layoutStyle, legend: this.legendStyle, axis: this.axisStyle, grid: this.gridStyle };
        this.nofication(this.configApi.scope, data);
    }

    public reRenderData(type: string) {
        if (type != "bar") {
            return;
        }
        if (this.axisStyle.xAxisLabel || this.axisStyle.yAxisLabel) {
            this.OptionChange();
        }
    }

}

