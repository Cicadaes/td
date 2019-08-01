import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, ComponentEvent, DomEvent } from "cosmos-td-sdk";

@Component({
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.less']
})

export class TabComponent extends Communication implements OnInit, OnDestroy {

    public selectedIndex = 0;
    private dataObj: any = {
        data: {},
        style: {}
    };
    private option: any[] = [
        {
            name: 'Tab 1',
        },
        {
            name: 'Tab 2',
        },
        {
            name: 'Tab 3',
        }
    ];

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super();
    }

    ngOnInit() {

    }
    @ViewChild('tabFilter') tabFilter: any;

    private selectChange(tab: any) {
        // console.log(tab.name, { metrics: tab.name });
        DomEvent.fireEvent(this.tabFilter.nativeElement, ComponentEvent.COMFILTERCHANGE, {
            data: {
                metrics: tab.name
            },
            bubble: true
        })
    }

    public onDataChange(scope: string, data: any) {
        if (data[0].metrics) {
            this.option = [];
            for (let i = 0; i < data[0].metrics.length; i++) {
                this.option.push({ name: data[0].metrics[i].value });
            }
            DomEvent.fireEvent(this.tabFilter.nativeElement, ComponentEvent.COMFILTERCHANGE, {
                data: {
                    metrics: this.option[0].name
                },
                bubble: false
            })
        }
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        // this.option = new FilterGraph(this.dataObj);
    }

    public onSizeChange() {

    }

    public onVisualArea(scope: string) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope });
    }

    ngOnDestroy() {

    }


}
