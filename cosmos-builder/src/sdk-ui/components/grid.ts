import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { GridComponent } from './angular/grid/grid.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
                background-color:#fff;
            }
            `
})
export default class MygridComponent extends AngularComponent {
    constructor() {
        super();

        this.styleAndData = true;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(GridComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}