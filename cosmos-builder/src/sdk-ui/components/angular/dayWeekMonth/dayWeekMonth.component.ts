import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, ComponentEvent, DomEvent } from "cosmos-td-sdk";

@Component({
    templateUrl: './dayWeekMonth.component.html',
    styleUrls: ['./dayWeekMonth.component.less']
})

export class DayWeekMonthComponent extends Communication implements OnInit, OnDestroy {

    private dataArr: any = [
        { value: 'day',label: '日' },
        { value: 'week',label: '周' },
        { value: 'month',label: '月' }
    ];

    private alignStyle: any = {};

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {

    }

    public onDataChange(scope: string, data: any) {
        
    }

    public onStyleChange(scope: string, data: any) {
        let option  = data.dayWeekMonth;
        if (option && option.length > 0) {
            this.dataArr = []
            for (let i = 0; i < option.length; i++) {
                if (option[i].checked) {
                    let item ={}
                    item['value'] = option[i].value;
                    item['label'] = option[i].label;
                    this.dataArr.push(item);
                }
            }
        }
        let alignment = data.alignment;
        if(alignment == 'left'){
            this.alignStyle = {'float': 'left'}
        }else if(alignment == 'right'){
            this.alignStyle = {'float': 'right'}
        }else if(alignment == 'center'){
            this.alignStyle = {'float': 'none', 'text-align': 'center'}
        }
    }

    public onSizeChange() {

    }

    public onVisualArea(scope: string) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope });
    }

    @ViewChild('dayWeekMonth') dayWeekMonth: any;

    private changeButton(value: any) {
        DomEvent.fireEvent(this.dayWeekMonth.nativeElement, ComponentEvent.COMFILTERCHANGE,
            {
                data: {
                    dayWeekMonth:value
                },
                bubble: true
            });
    }

    ngOnDestroy() {

    }


}
