import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayWeekMonthComponent } from "./dayWeekMonth.component";
import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
@NgModule({
    declarations: [
        DayWeekMonthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule,
        ButtonModule,
        ReactiveFormsModule,
        FormModule,
        RadioModule
    ],
    entryComponents: [DayWeekMonthComponent]
})
export default class DayWeekMonthModule{
    
}