import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";

import { StatisticsGraph } from './statistics.graph';
import { MOCK_DATA } from '../../../api/graph-data/constants/graph-data';
import { MOCK_STYLE } from '../../../api/graph-data/constants/graphline-style';


@Component({
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.less']
})
export class StatisticsComponent extends Communication implements OnInit, OnDestroy {
    content: any = "0";
    @ViewChild('statistics') statistics: any;
    contentStyle: any;
    value: any;
    public option: StatisticsGraph = new StatisticsGraph();

    private dataObj: any = {
        data: {},
        style: {}
    };

    constructor() {
        super();
    }

    ngOnInit() {
    }

    public onDataChange(scope: string, data: any) {
        // 这里有个巨坑，暂时不解释
        // 创建一个新实例覆盖触发变更检测
        data && data.length && this.setStatistucsData(data);
    }

    public onStyleChange(scope: string, data: any) {
        data && this.setStatistucsStyle(data);
    }

    setStatistucsData(data: any) {
        this.value = this.deepCopy(data)
        if (data[0]["Y"] !== null) {
            this.content = this.addThousands(Number(data[0]["Y"]));
        } else {
            this.content = '0';
        }
        if (this.contentStyle) {
            this.setStatistucsStyle(this.contentStyle);
        }
    }
    setStatistucsStyle(data: any) {
        this.statistics.nativeElement.style.color = data.statistics.color;
        this.statistics.nativeElement.style.fontSize = data.statistics.fontSize;
        this.statistics.nativeElement.style.fontFamily = data.statistics.fontFamily;
        this.statistics.nativeElement.style.textAlign = data.statistics.textAlign;
        if (this.content == "0" || this.content == "无数据") {
            if (data.missingData == "zero") {
                this.content = "0";
            }
            if (data.missingData == "noData") {
                this.content = "无数据";
            }
        }
        if (this.content == "0" || this.content == "无数据") {
        } else {
            this.setDataPrecision(data.statistics);
        }

        this.contentStyle = data;
    }
    /**
     * 设置数据的精度
     * @param obj 精度
     */
    setDataPrecision(obj: any) {
        if (!isNaN(Number(this.value[0]["Y"]))) {
            this.content = this.addThousands(Number(this.value[0]["Y"]).toFixed(2 - 0));
            if (this.content !== 0) {
                let m = this.content.split(".");
                if (m.length != 1) {
                    if (m[1].length != 2) {
                        this.content = m[0] + "." + m[1] + "0";
                    }
                    if (m[1] && m[1] == "00") {
                        this.content = m[0];
                    }

                }
            }
        }
        return;
    }
    public onSizeChange() {
        this.statistics && this.statistics.echarts && this.statistics.echarts.resize()
    }

    public onVisualArea(scope: string, data?: any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope, componentFilter: data });
    }

    ngOnDestroy() {

    }
    /**
     * 转为千分位
     * @param number 
     */
    addThousands(number: any) {
        if (number == 0) {
            return number;
        } else if (number == 0.0) {
            return number;
        }
        var num = number + "";
        num = num.replace(new RegExp(",", "g"), "");
        // 正负号处理
        var symble = "";
        if (/^([-+]).*$/.test(num)) {
            symble = num.replace(/^([-+]).*$/, "$1");
            num = num.replace(/^([-+])(.*)$/, "$2");
        }
        if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
            var num = num.replace(new RegExp("^[0]+", "g"), "");
            if (/^\./.test(num)) {
                num = "0" + num;
            }
            var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, "$1");
            var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, "$1");
            var re = /(\d+)(\d{3})/;
            while (re.test(integer)) {
                integer = integer.replace(re, "$1,$2");
            }
            return symble + integer + decimal;
        } else {
            return number;
        }
    }
    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }

}
