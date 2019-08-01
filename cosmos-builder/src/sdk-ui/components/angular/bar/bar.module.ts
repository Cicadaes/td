import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BarComponent } from './bar.component';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';

@NgModule({
    declarations: [
        BarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule
    ],
    entryComponents: [BarComponent]
})
export default class BarModule{

}