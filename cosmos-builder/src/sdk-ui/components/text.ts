import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { TextComponent } from './angular/text/text.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:auto;
                width:auto;
            }
            `
})
export default class MyTextComponent extends AngularComponent {
    constructor() {
        super();
        MyTextComponent.isEdit = false;
        MyTextComponent.pattern = "filter";
        this.styleAndData = false;
    }

    public onCreate(): void {
        this.componentRef = this.bootstrapAngular(TextComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}