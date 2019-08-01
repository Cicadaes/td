import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { StatisticsComponent } from './angular/statistics/statistics.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:auto;
            }
            `
})
export default class MyStatisticsComponent extends AngularComponent {
    constructor() {
        super();
        
        this.styleAndData = true;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(StatisticsComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}