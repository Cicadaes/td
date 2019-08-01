import { Component, SdkComponent } from 'cosmos-td-sdk';
import AngularComponent from './angular/angular.component';
import { MapComponent } from './angular/map/map.component';

@SdkComponent({
    template: `<div class="component"></div>`,
    style: `.component{
                height:100%;
                width:100%;
            }
            `
})
export default class MyMapComponent extends AngularComponent {
    constructor() {
        super();
        // MyMapComponent.isEdit = true;

        this.styleAndData = true;
    }

    public onCreate(): void {

        this.componentRef = this.bootstrapAngular(MapComponent);
        this.componentRef.onCreate();
    }

    public onDestroy(): void {
        this.componentRef.onDestroy();
    }

}