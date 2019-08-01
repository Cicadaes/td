import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FunnelComponent } from "./funnel.component";
import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';

@NgModule({
    declarations: [
        FunnelComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule
    ],
    entryComponents: [FunnelComponent]
})
export default class FunnelModule{
    
}