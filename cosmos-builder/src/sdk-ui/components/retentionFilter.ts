import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { RetentionFilterComponent } from './angular/retentionFilter/retentionFilter.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
                background-color:#fff;
            }
            `
})
export default class MyretentionfilterComponent extends AngularComponent {
    static pattern:string = 'filter';
    constructor() {
        super();
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(RetentionFilterComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}