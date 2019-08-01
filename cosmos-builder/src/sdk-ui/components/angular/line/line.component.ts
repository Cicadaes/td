import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';

import { LineGraph } from './line.graph';
import { MOCK_DATA } from '../../../api/graph-data/constants/graph-data';
import { MOCK_STYLE } from '../../../api/graph-data/constants/graphline-style';


@Component({
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.less']
})
export class LineComponent extends Communication implements OnInit, OnDestroy {

    @ViewChild('cmchart') cmchart: CosmosChartComponent;

    public option: LineGraph = new LineGraph();

    private dataObj: any = {
        data: {},
        style: {}
    };

    constructor() {
        super();
    }

    ngOnInit() {
        // this.dataObj = {
        //   data: MOCK_DATA,
        //   style: MOCK_STYLE
        // }
        // this.option = new LineGraph(this.dataObj);
    }

    public onDataChange(scope: string, data: any) {
        // 这里有个巨坑，暂时不解释
        // 创建一个新实例覆盖触发变更检测
        this.dataObj.data = data;
        this.option = new LineGraph(this.dataObj)
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        this.option = new LineGraph(this.dataObj)
    }

    public onSizeChange() {
        this.cmchart && this.cmchart.echarts && this.cmchart.echarts.resize()
    }

    public onVisualArea(scope: string, data?:any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope,componentFilter:data });
    }

    ngOnDestroy() {

    }

}
