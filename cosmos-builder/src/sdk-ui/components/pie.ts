import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { PieComponent } from './angular/pie/pie.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
                background-color:#fff;
            }
            `
})
export default class MyPieComponent extends AngularComponent {
    constructor() {
        super();

        this.styleAndData = true;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(PieComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}