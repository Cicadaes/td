import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";

import { BarGraph } from './bar.graph';
import { MOCK_DATA } from '../../../api/graph-data/constants/graph-data';
import { MOCK_STYLE } from '../../../api/graph-data/constants/graphbar-style';


@Component({
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.less']
})
export class BarComponent extends Communication implements OnInit, OnDestroy {

    @ViewChild('cmchart') cmchart: CosmosChartComponent;

    private dataObj: any = {
        data: {},
        style: {}
    };

    private option: BarGraph = new BarGraph();

    constructor() {
        super();
    }

    ngOnInit() {
        // this.dataObj = {
        //   data: MOCK_DATA,
        //   style: MOCK_STYLE
        // }
        // this.option = new BarGraph(this.dataObj, 'bar');
    }

    public onDataChange(scope: string, data: any) {
        this.dataObj.data = data;
        this.option = new BarGraph(this.dataObj);
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        this.option = new BarGraph(this.dataObj);
    }

    public onSizeChange() {
        if (this.cmchart && this.cmchart.echarts) {
            this.cmchart.echarts.resize();
        }
    }

    public onVisualArea(scope: string, data?:any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope,componentFilter:data });
    }

    ngOnDestroy() {

    }

}
