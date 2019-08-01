import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { EventImpactComponent } from './angular/eventImpact/eventImpact.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:auto;
            }
            `
})
export default class MyeventImpactComponent extends AngularComponent {
    constructor() {
        super();
        MyeventImpactComponent.pattern = "filter";
        MyeventImpactComponent.isEdit = true;
        MyeventImpactComponent.scale = 'horizontal'; 

        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(EventImpactComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}