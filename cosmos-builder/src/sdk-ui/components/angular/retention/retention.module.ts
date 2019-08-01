import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RetentionComponent } from './retention.component';

import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';
import { TooltipModule } from 'ng-cosmos-td-ui/src/base/tooltip/tooltip.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';

@NgModule({
    declarations: [
        RetentionComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule,
        TooltipModule,
        SelectModule,
        datePickerModule
    ],
    entryComponents: [RetentionComponent]
})


export default class RetentionModule{
    
}