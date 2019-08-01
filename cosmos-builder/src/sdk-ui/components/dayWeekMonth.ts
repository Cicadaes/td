import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { DayWeekMonthComponent } from './angular/dayWeekMonth/dayWeekMonth.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:auto;
            }
            `
})
export default class MyDayWeekMonthComponent extends AngularComponent {
    constructor() {
        super();
        MyDayWeekMonthComponent.pattern = "filter";
        MyDayWeekMonthComponent.isEdit = true; 
        MyDayWeekMonthComponent.scale = 'horizontal'; 

        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(DayWeekMonthComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}