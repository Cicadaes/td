import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataStore, EventType } from 'cosmos-td-sdk';
import { StylePanel } from '../style.panel';
import { ConfigApi } from '../../../../api/config-api';

@Component({
    selector: 'axis',
    templateUrl: './axis-style.component.html',
    styleUrls: ['./axis-style.component.less'],
})

export class AxisStyleComponent extends StylePanel implements OnInit {

    _autoChecked: boolean = true;

    axisStyle: any = {};
    axisColor: string = "#C5C8CE";

    _cmPosition: string = 'left';
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];

    colorOptions: string[] = [];

    initData: any = {
        showAxis: true,
        //数据标签
        xAxisLabel: true,
        yAxisLabel: true,
        //y轴最大值最小值
        yAxisMin: "",
        yAxisMax: "",
        // xAxisInterval: "",
        yAxisInterval: "",
        axisColor: this.axisColor,
        //标题
        xAxisTitle:false,
        yAxisTitle:false,
        //轴线
        xAxisLine: true,
        yAxisLine: false
    };
    
    @Input()
    set layoutData(data: any) {
        if (data) {
            this.axisColor = data['axisColor'] || this.axisColor;
            Object.assign(this.axisStyle, data);
        } else {
            Object.assign(this.axisStyle, this.initData);
        }
        this.OptionChange();
    }

    @Output() dataChange = new EventEmitter();

    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {

    }

    OptionChange(event?: Event) {
        this.dataChange.emit(this.axisStyle);
    }
}

