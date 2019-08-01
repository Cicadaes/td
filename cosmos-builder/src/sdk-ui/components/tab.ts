import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { TabComponent } from './angular/tab/tab.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
            }
            `
})
export default class MytabComponent extends AngularComponent {
    constructor() {
        super();
        MytabComponent.pattern = "filter";
        MytabComponent.isEdit = true;
        MytabComponent.scale = 'horizontal'; 

        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(TabComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}