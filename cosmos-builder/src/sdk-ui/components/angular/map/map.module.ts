import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { MapComponent } from "./map.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';
import { ProgressModule} from 'ng-cosmos-td-ui/src/base/progress/progress.module'

@NgModule({
    declarations: [
        MapComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule,
        ProgressModule
    ],
    entryComponents: [MapComponent]
})
export default class MapModule{
    
}