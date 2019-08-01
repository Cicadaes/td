import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { DateComponent } from './angular/date/date.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:auto;
            }
            `
})
export default class MydateComponent extends AngularComponent {
    constructor() {
        super();
        MydateComponent.pattern = "filter";
        MydateComponent.isEdit = false;      
        MydateComponent.scale = 'horizontal';    
        
        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(DateComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}