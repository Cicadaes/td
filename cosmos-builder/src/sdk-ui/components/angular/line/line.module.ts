import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { LineComponent } from "./line.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';

@NgModule({
    declarations: [
        LineComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule
    ],
    entryComponents: [LineComponent]
})
export default class LineModule {
    
}