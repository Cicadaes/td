import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { StatisticsComponent } from "./statistics.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';

@NgModule({
    declarations: [
        StatisticsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule
    ],
    entryComponents: [StatisticsComponent]
})
export default class StatisticsModule{
    
}