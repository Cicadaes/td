import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { AreaComponent } from "./area.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';

@NgModule({
    declarations: [
        AreaComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule
    ],
    entryComponents: [AreaComponent]
})
export default class AreaModule{

}