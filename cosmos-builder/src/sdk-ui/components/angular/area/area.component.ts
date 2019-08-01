import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';

import { AreaGraph } from './area.graph';
import { MOCK_DATA } from '../../../api/graph-data/constants/graph-data';
import { MOCK_STYLE } from '../../../api/graph-data/constants/graphline-style';


@Component({
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.less']
})
export class AreaComponent extends Communication implements OnInit, OnDestroy {

    @ViewChild('cmchart') cmchart: CosmosChartComponent;

    public option: AreaGraph = new AreaGraph();

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
        // this.option = new AreaGraph(this.dataObj);
        
    }

    public onDataChange(scope: string, data: any) {
        // 这里有个巨坑，暂时不解释
        // 创建一个新实例覆盖触发变更检测
        this.dataObj.data = data;
        this.option = new AreaGraph(this.dataObj)
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        this.option = new AreaGraph(this.dataObj);
        this.option.series.forEach((ele:any) => {
            if(!ele.areaStyle){
                ele.areaStyle =  {
                }
            }
        });
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
