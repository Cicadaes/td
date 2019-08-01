import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { FunnelGraph } from './funnel.graph';

@Component({
    templateUrl: './funnel.component.html',
    styleUrls: ['./funnel.component.less']
})

export class FunnelComponent extends Communication implements OnInit, OnDestroy {
    @ViewChild('cmchart') cmchart: CosmosChartComponent;

    constructor() {
        super();
    }

    public option: FunnelGraph = new FunnelGraph();

    private dataObj: any = {
        data: {},
        style: {}
    };

    ngOnInit() {

    }

    public onDataChange(scope: string, data: any) {
        this.dataObj.data = data;
        this.option = new FunnelGraph(this.dataObj)
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        this.option = new FunnelGraph(this.dataObj);
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