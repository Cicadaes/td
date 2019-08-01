import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { SelectComponent } from './angular/select/select.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:auto;
            }
            `
})
export default class MyselectComponent extends AngularComponent {
    constructor() {
        super();
        MyselectComponent.pattern = "filter";
        MyselectComponent.isEdit = false;
        MyselectComponent.scale = 'horizontal'; 

        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(SelectComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}