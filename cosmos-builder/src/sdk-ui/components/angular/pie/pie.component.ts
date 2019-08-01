import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";
import { PieGraph } from './pie.graph';

@Component({
    templateUrl: './pie.component.html',
    styleUrls: ['./pie.component.less']
})

export class PieComponent extends Communication implements OnInit, OnDestroy {
    @ViewChild('cmchart') cmchart: CosmosChartComponent;

    constructor() {
        super();
    }

    public option: PieGraph = new PieGraph();

    private dataObj: any = {
        data: {},
        style: {}
    };

    ngOnInit() {

    }

    public onDataChange(scope: string, data: any) {
        this.dataObj.data = data;
        this.option = new PieGraph(this.dataObj);
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        this.option = new PieGraph(this.dataObj);
    }

    public onSizeChange() {
        if (this.cmchart.echarts) {
            this.cmchart.echarts.resize();
        }
    }

    public onVisualArea(scope: string, data?:any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope,componentFilter:data });
    }

    ngOnDestroy() {

    }


}
