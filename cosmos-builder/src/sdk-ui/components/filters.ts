import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { FiltersComponent } from './angular/filters/filters.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
                background-color:#fff;
            }
            `
})
export default class MyfiltersComponent extends AngularComponent {
    constructor() {
        super();
        MyfiltersComponent.pattern = "filter";
        MyfiltersComponent.isEdit = false;
        MyfiltersComponent.scale = 'horizontal'; 

        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(FiltersComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}