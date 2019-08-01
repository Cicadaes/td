import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { RetentionComponent } from './angular/retention/retention.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
                background: #fff;
            }
            `
})
export default class MyRetentionComponent extends AngularComponent {
    constructor() {
        super();

        this.styleAndData = true;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(RetentionComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}