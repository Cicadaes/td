import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Communication, EventEmitter, EventType, DataStore, ComponentEvent, DomEvent } from "cosmos-td-sdk";
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';

import { DateGraph } from './date.graph';

@Component({
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.less']
})
export class DateComponent extends Communication implements OnInit, OnDestroy {
    private alignStyle: any = {};
    name: any = "日期";
    @ViewChild('cmchart') cmchart: CosmosChartComponent;

    @ViewChild('select') select: any;
    start: any;
    end: any;
    dadys: any;//默认天数
    link: any;
    subscript: any;//下标
    firstTime: boolean = false;//事件触发器
    inception: any = true;

    _disabledDate(current: Date): any {
        if (current) {
            // if ((Date.now() - current.getTime() > 0) && (current.getTime() - (Date.now() - 365 * 24 * 60 * 60 * 1000) > 0)) {
            //     return false;
            // } else {
            //     return true;
            // }
            if ((Date.now() - current.getTime() > 0)) {
                return false;
            } else {
                return true;
            }
        }
    };
    typefaces = [
        {
            value: 2,
            label: "最近3天"
        },
        {
            value: 6,
            label: "最近7天"
        },
        {
            value: 29,
            label: "最近30天"
        },
        {
            value: 0,
            label: "自定义最近N天"
        }
    ];
    constructor(private changeDetectorRef: ChangeDetectorRef
    ) {
        super()
    }
    private option: DateGraph = new DateGraph(this.select);

    private dataObj: any = {
        data: {},
    };



    ngOnInit() {
        let now = new Date();
        this.dadys = this.typefaces[3].value;
        DomEvent.fireEvent(this.select.nativeElement, ComponentEvent.COMFILTERCHANGE, {
            data: { "dateRange": [this.time(now), this.time(now)] },
            bubble: false
        });
    }

    OptionChange(data: any) {
        this.link = {
            direction: "minus",
            value: [data]
        };
        this.firstTime = true;
        this.initial(this.link);
        this.dataObj.data = this.link;
        this.option = new DateGraph(this.select, this.dataObj);
    }

    public onDataChange(scope: string, data: any) {
        if (data && data[0]) {
            if (data[0]["name"]) {
                this.name = data[0]["name"] + " : ";
            } else {
                this.name = '';
            }
            this.firstTime = true;
            this.initial(data[0]);
            this.dataObj.data = data[0];
            this.option = new DateGraph(this.select, this.dataObj);
        }
    }

    public onStyleChange(scope: string, data: any) {
        let alignment = data.alignment;
        if (alignment == 'left') {
            this.alignStyle = { 'float': 'left' }
        }
        if (alignment == 'right') {
            this.alignStyle = { 'float': 'right' }
        }
        if (alignment == 'center') {
            this.alignStyle = { 'float': 'none', 'text-align': 'center' }
        }
    }
    initial(data: any) {
        if (data["direction"] == "minus") {
            let now = new Date();
            if (data["value"].length > 1) {
                this.end = new Date(now.getTime() - data["value"][1] * 24 * 60 * 60 * 1000);
                this.start = new Date(this.end.getTime() - data["value"][0] * 24 * 60 * 60 * 1000);
                this.subscript = 3;
                this.dadys = this.typefaces[this.subscript].value;
            } else {
                this.end = new Date();
                this.start = new Date(this.end.getTime() - data["value"][0] * 24 * 60 * 60 * 1000);
                if (data["value"] == 2) {
                    this.subscript = 0;
                }
                if (data["value"] == 6) {
                    this.subscript = 1;
                }
                if (data["value"] == 29) {
                    this.subscript = 2;
                }
                this.dadys = this.typefaces[this.subscript].value;
            }
        }
        if (data["direction"] == "add") {
            let now = new Date();
            this.start = new Date(now.getTime() + data["value"][1] * 24 * 60 * 60 * 1000);
            this.end = new Date(this.start.getTime() + data["value"][0] * 24 * 60 * 60 * 1000);
            this.dadys = this.typefaces[3].value;
        }
        if (data["direction"] == "both") {
            let now = new Date();
            this.start = new Date(now.getTime() - data["value"][0] * 24 * 60 * 60 * 1000);;
            this.end = new Date(now.getTime() + data["value"][1] * 24 * 60 * 60 * 1000);
            this.dadys = this.typefaces[3].value;
        }
        if (this.firstTime) {
            DomEvent.fireEvent(this.select.nativeElement, ComponentEvent.COMFILTERCHANGE, {
                data: { "dateRange": [this.time(this.start), this.time(this.end)] },
                bubble: false 
            });
            this.firstTime = false;
        }
        if (this.inception) {
            DomEvent.fireEvent(this.select.nativeElement, ComponentEvent.COMFILTERCHANGE, {
                data: { "dateRange": [this.time(this.start), this.time(this.end)] },
                bubble: false
            });
            this.inception = false;
        }
    }
    public onSizeChange() {
        this.cmchart && this.cmchart.echarts && this.cmchart.echarts.resize()
    }
    private changeModel(value: any, bubble?: boolean) {
        this.dadys = this.typefaces[3].value;
        if (value[0] === null && value[1] === null) {
            return;
        } else {
            DomEvent.fireEvent(this.select.nativeElement, ComponentEvent.COMFILTERCHANGE, {
                data: { "dateRange": [this.time(value[0]), this.time(value[1])] },
                bubble: bubble
            });
        }
    }
    // _disabledStartDate = (startValue:any) => {
    //     // if (!startValue || !this._endDate) {
    //     //     return false;
    //     // }
    //     // return startValue.getTime() >= this._endDate.getTime();
    // };
    /**
     *时间格式转化
     * @param data 
     */
    time(date: any) {
        // let Time = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate();
        let Time = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());

        return Time;
    }

    public onVisualArea(scope: string) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope });
    }

    ngOnDestroy() {

    }

}
