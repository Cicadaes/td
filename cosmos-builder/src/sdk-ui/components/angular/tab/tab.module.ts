import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabComponent } from "./tab.component";
import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { TabsModule } from 'ng-cosmos-td-ui/src/base/tabs/tabs.module';

@NgModule({
    declarations: [
        TabComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule,
        TabsModule
    ],
    entryComponents: [TabComponent]
})
export default class TabModule{
    
}