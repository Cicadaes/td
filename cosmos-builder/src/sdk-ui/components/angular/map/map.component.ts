import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';

import { MapGraph } from './map.graph';
import { ConfigApi } from '../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { gradientColor } from './../common/color';
@Component({
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less']
})
export class MapComponent extends Communication implements OnInit, OnDestroy {

    @ViewChild('cmchart') cmchart: any;
    @ViewChild('contentColor') contentColor: any;
    provinces: any;
    conts: any;//总和
    yData: any;
    show: boolean = true;
    colors: any = [];
    numb: any;//显示条数
    /**
    * 求和,新组合,最大最小
    * @param data 
    */
    Value(data: any) {
        this.conts = 0;
        for (let j = 0; j < data.length; j++) {
            this.conts = Number(this.conts) + Number(data[j].value);
        }
    }
    /**
     * 转百分数
     * @param point 
     */
    toPercent(point: any) {
        var str = Number(point * 100).toFixed(2);
        // str += "%";
        let m = str.split(".");
        if (m.length != 1) {
            if (m[1].length != 2) {
                str = m[0] + "." + m[1] + "0";
            }
        }
        if (this.show) {
            if (str == "100.00") {
                setTimeout(() => {
                    this.contentColor.nativeElement.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].style.display = "none"
                    this.contentColor.nativeElement.children[0].children[0].children[0].children[0].children[0].children[0].children[1].innerHTML = "100%"
                    this.contentColor.nativeElement.children[0].children[0].children[0].children[0].children[0].children[0].children[1].style.color = "#000000"
                }, 50);
            }
            return str;
        }
    }

    diversity(content: any) {
        content.sort(function (o1: any, o2: any) {
            if (isNaN(o1.value) || o1.value == null) return -1;
            if (isNaN(o2.value) || o2.value == null) return 1;
            return o1.value - o2.value;
        });
        this.yData = [];
        for (var i = 0; i < content.length; i++) {
            this.yData.push(content[i]);
        }

        this.Value(content);
        this.yData = this.yData.reverse();
        for (let k = 0; k < this.yData.length; k++) {
            this.yData[k].value = this.yData[k].value / this.conts;
            this.yData[k].value = this.toPercent(this.yData[k].value);
        }
        this.provinces = this.yData.slice(0, this.numb);
    }
    public option: MapGraph = new MapGraph();

    private dataObj: any = {
        data: {},
        style: {}
    };

    constructor(public configApi: ConfigApi) {
        super();

    }



    ngOnInit() {
        this.diversity(this.option.data)
    }

    public onDataChange(scope: string, data: any) {
        // 这里有个巨坑，暂时不解释
        // 创建一个新实例覆盖触发变更检测
        let cont = this.deepCopy(data);
        let config = DataStore.getConfigData(scope);
        if (config && config["dataConfig"] && config["dataConfig"]["provincesDistribution"]) {
            this.numb = config["dataConfig"]["provincesDistribution"]["value"];
            this.numb = Number(this.numb);
            this.show = config["dataConfig"]["provincesDistribution"]["show"];
            this.provinces = this.yData.slice(0, this.numb);

        } else {
            this.show = true;
        }
        if (data.length) {
            this.diversity(data);
        } else {
            this.diversity(this.option.data);
        }
        this.optionColor()
        this.dataObj.data = cont;
        this.option = new MapGraph(this.dataObj)
        setTimeout(() => {
            this.optionColor()
        }, 50);
        setTimeout(() => {
            this.onSizeChange();
        }, 100);

    }

    public onStyleChange(scope: string, data: any) {
        this.colors = data["mapStyle"]["labelColor"];
        this.dataObj.style = data;
        this.option = new MapGraph(this.dataObj)
        this.optionColor()
    }
    optionColor() {
        if (this.show) {
            setTimeout(() => {
                for (let i = 0; i < this.contentColor.nativeElement.childElementCount; i++) {
                    this.contentColor.nativeElement.children[i].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].style.backgroundColor = this.colors;
                }
            }, 50);

        }
        return;

    }
    public onSizeChange() {
        this.cmchart && this.cmchart.echarts && this.cmchart.echarts.resize()
        // this.cmchart && this.cmchart.canvas && this.width();
    }
    // width() {
    //     this.cmchart.canvas.nativeElement.children[0].style.width = "auto"
    // }
    public onVisualArea(scope: string, data?: any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope, componentFilter: data });
    }

    ngOnDestroy() {

    }
    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}
