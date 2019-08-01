import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { TitleComponent } from './angular/title/title.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:auto;
            }
            `
})
export default class MyTitleComponent extends AngularComponent {
    constructor() {
        super();
        MyTitleComponent.pattern = "filter";
        MyTitleComponent.isEdit = false;

        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(TitleComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}