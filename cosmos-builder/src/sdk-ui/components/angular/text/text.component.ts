import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";
import { TextGraph } from './text.graph';

import { Subscription } from 'rxjs/Subscription';
import { textLinkService } from './text-style/text-style-link/text-style-link.service';
@Component({
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.less']
})

export class TextComponent extends Communication implements OnInit, OnDestroy {
    linkAddress: any;
    keys: any;
    title: any = "";
    switch: any = false;
    @ViewChild('cmchart') cmchart: CosmosChartComponent;
    @ViewChild('text') text: any;
    @ViewChild('link') link: any;
    constructor(public renderer: Renderer, private el: ElementRef, private textLinkService: textLinkService) {
        super();
    }

    public option: TextGraph = new TextGraph(this.text);

    private dataObj: any = {
        data: {},
        style: {}
    };

    ngOnInit() {

    }

    public onDataChange(scope: string, data: any) {
        if (data[0]['dataLabel']) {
            this.keys = '_blank'
        } else {
            this.keys = '_self'
        }
        if (data[0]['site'] && data[0]["content"]) {
            this.linkAddress = data[0]['protocol'] + data[0]['site'];
            this.switch = true;
            this.text.nativeElement.style.cursor="pointer"
        } else {
            this.switch = false;
            this.linkAddress = data[0]['protocol'] + "#";
            this.text.nativeElement.style.cursor="default"
        }
        this.title = data[0]['content'];
    }

    onClick(e: any) {
        if (this.switch) {
            window.open(this.linkAddress, this.keys, '')
        }
    }
    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        this.option = new TextGraph(this.text, this.dataObj);
    }

    public onSizeChange() {
        this.cmchart && this.cmchart.echarts && this.cmchart.echarts.resize()
    }

    public onVisualArea(scope: string, data?: any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope, componentFilter: data });
    }
    ngOnDestroy() {

    }


}
