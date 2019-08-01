import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { GridComponent } from "./grid.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';

import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';

@NgModule({
    declarations: [
        GridComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule,
        TableModule,
        DropdownModule
    ],
    entryComponents: [GridComponent]
})
export default class GridModule{
    
}