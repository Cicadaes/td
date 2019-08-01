import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { TableComponent } from "./table.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';

import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';

@NgModule({
    declarations: [
        TableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule,
        TableModule,
        DropdownModule
    ],
    entryComponents: [TableComponent]
})
export default class CmTableModule{
    
}