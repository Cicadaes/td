import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { customfiltersComponent } from './angular/customfilters/customfilters.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:100%;
                background-color:#fff;
            }
            `
})
export default class MycustomfiltersComponent extends AngularComponent {
    constructor() {
        super();
        MycustomfiltersComponent.pattern = "filter";
        MycustomfiltersComponent.isEdit = false;
        MycustomfiltersComponent.scale = 'horizontal';

        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(customfiltersComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}