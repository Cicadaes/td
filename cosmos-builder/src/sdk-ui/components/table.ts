import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { TableComponent } from './angular/table/table.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
                background-color:#fff;
            }
            `
})
export default class MyTableComponent extends AngularComponent {
    constructor() {
        super();

        this.styleAndData = true;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(TableComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}